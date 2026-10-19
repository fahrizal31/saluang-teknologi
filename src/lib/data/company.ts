import { db } from '@/lib/db';
import { companySettings, type CompanySettingsModel } from '@/lib/db/schema';
import { companyData } from '@/data/company';
import type { CompanyInfo } from '@/types/company';
import { eq } from 'drizzle-orm';

export function clearCompanyCache() {
  // no-op, always fresh
}

/**
 * Mengambil profil & pengaturan lengkap perusahaan Saluang Teknologi langsung dari database.
 */
export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    const rows = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.id, 'default'))
      .limit(1);

    if (rows && rows.length > 0) {
      const r = rows[0];
      const result: CompanyInfo = {
        name: r.name,
        legalName: r.legalName,
        tagline: r.tagline,
        shortDescription: r.shortDescription,
        fullDescription: r.fullDescription,
        vision: r.vision,
        mission: Array.isArray(r.mission) ? r.mission : companyData.mission,
        values: companyData.values, // Core values tetap terkurasi
        stats: Array.isArray(r.stats) && r.stats.length > 0 ? r.stats : companyData.stats,
        phoneDisplay: r.phoneDisplay,
        phoneWhatsapp: r.phoneWhatsapp,
        email: r.email,
        address: {
          street: r.addressStreet,
          city: r.addressCity,
          province: r.addressProvince,
          country: r.addressCountry,
          postalCode: r.addressPostalCode,
        },
        socials: [
          {
            platform: 'linkedin',
            url: r.socialLinkedin || 'https://linkedin.com/company/saluang-teknologi',
            label: 'LinkedIn Saluang Teknologi',
          },
          {
            platform: 'instagram',
            url: r.socialInstagram || 'https://instagram.com/saluangteknologi',
            label: 'Instagram Saluang Teknologi',
          },
          {
            platform: 'github',
            url: r.socialGithub || 'https://github.com/saluang-teknologi',
            label: 'GitHub Saluang Teknologi',
          },
          {
            platform: 'whatsapp',
            url: `https://wa.me/${r.phoneWhatsapp}?text=${encodeURIComponent('Halo Saluang Teknologi, saya ingin berdiskusi mengenai proyek perangkat lunak.')}`,
            label: 'WhatsApp Resmi',
          },
        ],
      };
      return result;
    }
  } catch (err) {
    console.warn('[Data:Company] Gagal mengambil dari DB, menggunakan fallback data lokal:', err instanceof Error ? err.message : err);
  }

  return companyData;
}
