import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { companySettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clearCompanyCache } from '@/lib/data/company';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * GET /api/admin/company
 * Ambil pengaturan profil & kontak perusahaan saat ini
 */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.id, 'default'))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Pengaturan belum diinisialisasi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('[API:Admin:Company:GET] Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil pengaturan perusahaan' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/company
 * Simpan / perbarui pengaturan profil & kontak perusahaan
 */
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      name,
      legalName,
      tagline,
      shortDescription,
      fullDescription,
      vision,
      mission,
      phoneDisplay,
      phoneWhatsapp,
      email,
      addressStreet,
      addressCity,
      addressProvince,
      addressCountry,
      addressPostalCode,
      socialLinkedin,
      socialInstagram,
      socialGithub,
      telegramBotToken,
      telegramChatId,
      telegramEnabled,
      stats,
    } = body;

    if (!name || !phoneWhatsapp || !email) {
      return NextResponse.json(
        { error: 'Field wajib tidak boleh kosong (name, phoneWhatsapp, email)' },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim(),
      legalName: legalName ? legalName.trim() : name.trim(),
      tagline: tagline ? tagline.trim() : '',
      shortDescription: shortDescription ? shortDescription.trim() : '',
      fullDescription: fullDescription ? fullDescription.trim() : '',
      vision: vision ? vision.trim() : '',
      mission: Array.isArray(mission) ? mission : [],
      phoneDisplay: phoneDisplay ? phoneDisplay.trim() : phoneWhatsapp.trim(),
      phoneWhatsapp: phoneWhatsapp.trim().replace(/\D/g, ''),
      email: email.trim(),
      addressStreet: addressStreet ? addressStreet.trim() : '',
      addressCity: addressCity ? addressCity.trim() : '',
      addressProvince: addressProvince ? addressProvince.trim() : '',
      addressCountry: addressCountry ? addressCountry.trim() : 'Indonesia',
      addressPostalCode: addressPostalCode ? addressPostalCode.trim() : '',
      socialLinkedin: socialLinkedin ? socialLinkedin.trim() : null,
      socialInstagram: socialInstagram ? socialInstagram.trim() : null,
      socialGithub: socialGithub ? socialGithub.trim() : null,
      telegramBotToken: telegramBotToken ? telegramBotToken.trim() : null,
      telegramChatId: telegramChatId ? telegramChatId.trim() : null,
      telegramEnabled: typeof telegramEnabled === 'boolean' ? telegramEnabled : true,
      stats: Array.isArray(stats) ? stats : null,
      updatedAt: new Date(),
    };

    const existing = await db
      .select()
      .from(companySettings)
      .where(eq(companySettings.id, 'default'))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(companySettings).values({
        id: 'default',
        ...payload,
      });
    } else {
      await db
        .update(companySettings)
        .set(payload)
        .where(eq(companySettings.id, 'default'));
    }

    clearCompanyCache();
    revalidatePath('/');
    revalidatePath('/tentang');
    revalidatePath('/kontak');

    return NextResponse.json({
      success: true,
      message: 'Pengaturan perusahaan berhasil diperbarui!',
      data: payload,
    });
  } catch (error) {
    console.error('[API:Admin:Company:PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui pengaturan perusahaan' },
      { status: 500 }
    );
  }
}
