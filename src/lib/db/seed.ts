import * as dotenv from 'dotenv';
dotenv.config();

import { db, connectionPool } from './index';
import { services, portfolioProjects, teamMembers, user, account, companySettings } from './schema';
import { servicesData } from '@/data/services';
import { portfolioData } from '@/data/portfolio';
import { teamData } from '@/data/team';
import { companyData } from '@/data/company';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { auth } from '@/lib/auth';
import crypto from 'crypto';

async function seed() {
  console.log('[Seed] Memulai seeding database Saluang Teknologi...');

  try {
    // 1. Seed Services
    console.log(`[Seed] Mengisi ${servicesData.length} katalog layanan digital...`);
    for (let i = 0; i < servicesData.length; i++) {
      const s = servicesData[i];
      const existing = await db.select().from(services).where(eq(services.id, s.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(services).values({
          id: s.id,
          slug: s.slug,
          title: s.title,
          shortTitle: s.shortTitle,
          subtitle: s.subtitle,
          tagline: s.tagline,
          heroDescription: s.heroDescription,
          iconName: s.iconName,
          badge: s.badge,
          features: s.features,
          problemsSolved: s.problemsSolved,
          deliverables: s.deliverables,
          workflow: s.workflow,
          techStack: s.techStack,
          accentColor: s.accentColor,
          displayOrder: i,
        });
      }
    }
    console.log('[Seed] ✓ Katalog layanan berhasil tersimpan.');

    // 2. Seed Portfolio
    console.log(`[Seed] Mengisi ${portfolioData.length} proyek portofolio...`);
    for (let i = 0; i < portfolioData.length; i++) {
      const p = portfolioData[i];
      const existing = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, p.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(portfolioProjects).values({
          id: p.id,
          slug: p.slug,
          title: p.title,
          clientName: p.clientName,
          category: p.category,
          categoryLabel: p.categoryLabel,
          summary: p.summary,
          problem: p.problem,
          solution: p.solution,
          results: p.results,
          techStack: p.techStack,
          imageUrl: p.imageUrl,
          featured: p.featured,
          completionYear: p.completionYear,
          liveUrl: p.liveUrl || null,
          testimonial: p.testimonial || null,
          displayOrder: i,
        });
      }
    }
    console.log('[Seed] ✓ Proyek portofolio berhasil tersimpan.');

    // 3. Seed Team Members
    console.log(`[Seed] Mengisi ${teamData.length} anggota tim profil...`);
    for (let i = 0; i < teamData.length; i++) {
      const t = teamData[i];
      const existing = await db.select().from(teamMembers).where(eq(teamMembers.id, t.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(teamMembers).values({
          id: t.id,
          name: t.name,
          role: t.role,
          roleCategory: t.roleCategory,
          bio: t.bio,
          avatarUrl: t.avatarUrl,
          linkedinUrl: t.linkedinUrl || null,
          githubUrl: t.githubUrl || null,
          displayOrder: i,
        });
      }
    }
    console.log('[Seed] ✓ Anggota tim berhasil tersimpan.');

    // 4. Seed Company Settings
    console.log('[Seed] Memeriksa data profil & pengaturan perusahaan...');
    const existingCompany = await db.select().from(companySettings).where(eq(companySettings.id, 'default')).limit(1);
    if (existingCompany.length === 0) {
      await db.insert(companySettings).values({
        id: 'default',
        name: companyData.name,
        legalName: companyData.legalName,
        tagline: companyData.tagline,
        shortDescription: companyData.shortDescription,
        fullDescription: companyData.fullDescription,
        vision: companyData.vision,
        mission: companyData.mission,
        phoneDisplay: companyData.phoneDisplay,
        phoneWhatsapp: companyData.phoneWhatsapp,
        email: companyData.email,
        addressStreet: companyData.address.street,
        addressCity: companyData.address.city,
        addressProvince: companyData.address.province,
        addressCountry: companyData.address.country,
        addressPostalCode: companyData.address.postalCode,
        socialLinkedin: companyData.socials.find((s) => s.platform === 'linkedin')?.url || null,
        socialInstagram: companyData.socials.find((s) => s.platform === 'instagram')?.url || null,
        socialGithub: companyData.socials.find((s) => s.platform === 'github')?.url || null,
      });
      console.log('[Seed] ✓ Pengaturan perusahaan default berhasil disimpan ke TiDB!');
    }

    // 4. Inisialisasi Akun Admin Basis Data (Terenkripsi)
    // Kredensial TIDAK disimpan di .env. Seluruh kata sandi dienkripsi (scrypt hash) langsung di MySQL.
    const defaultAdminEmail = 'admin@saluangteknologi.com';
    const defaultAdminPassword = 'AdminSaluang2026!';
    const defaultAdminName = 'Admin Saluang';

    console.log(`[Seed] Memeriksa akun admin di database...`);
    const existingUsers = await db.select().from(user).limit(1);

    if (existingUsers.length === 0) {
      console.log(`[Seed] Menginisialisasi admin awal dengan kata sandi terenkripsi (scrypt)...`);
      const hashedPassword = await hashPassword(defaultAdminPassword);
      const userId = crypto.randomUUID();

      await db.insert(user).values({
        id: userId,
        name: defaultAdminName,
        email: defaultAdminEmail,
        emailVerified: true,
        role: 'admin',
      });

      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
      });

      console.log(`[Seed] ✓ Akun admin awal berhasil dibuat di database dengan kata sandi terenkripsi!`);
      console.log(`[Seed]   Email: ${defaultAdminEmail}`);
      console.log(`[Seed]   (Gunakan 'npm run admin:reset-password' atau 'npm run admin:create' untuk mengelola akun)`);
    } else {
      const u = existingUsers[0];
      await db.update(account).set({ accountId: u.id }).where(eq(account.userId, u.id));
      console.log(`[Seed] Akun admin sudah aktif di database (${u.email}). Kredensial aman & terenkripsi.`);
    }

    console.log('[Seed] ✓ Seluruh proses seeding database selesai!');
  } catch (error) {
    console.error('[Seed] ✗ Gagal melakukan seed database:', error);
    process.exit(1);
  } finally {
    await connectionPool.end();
  }
}

seed();
