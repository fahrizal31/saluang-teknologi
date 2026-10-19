import { Suspense } from 'react';
import { db } from '@/lib/db';
import { companySettings, type CompanySettingsModel } from '@/lib/db/schema';
import { companyData } from '@/data/company';
import { eq } from 'drizzle-orm';
import { AdminCompanyClient } from '@/components/admin/AdminCompanyClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pengaturan Perusahaan | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanyPage() {
  let settings: CompanySettingsModel | null = null;
  try {
    const rows = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.id, 'default'))
      .limit(1);

    if (rows && rows.length > 0) {
      settings = rows[0];
    }
  } catch (error) {
    console.error('[AdminCompanyPage] Gagal membaca pengaturan dari database:', error);
  }

  // Fallback ke companyData jika database belum terisi
  const fallbackSettings: CompanySettingsModel = {
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
    stats: companyData.stats,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || null,
    telegramChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-saluang-dark">Memuat pengaturan perusahaan...</div>}>
      <AdminCompanyClient initialSettings={settings || fallbackSettings} />
    </Suspense>
  );
}
