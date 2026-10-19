import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { services, type NewService } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import crypto from 'crypto';
import { clearServicesCache } from '@/lib/data/services';

/**
 * Helper verifikasi admin session
 */
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
 * GET /api/admin/services
 * Ambil seluruh katalog layanan
 */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allServices = await db.select().from(services).orderBy(asc(services.displayOrder));
    return NextResponse.json({ success: true, data: allServices });
  } catch (error) {
    console.error('[API:Admin:Services:GET] Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data layanan' }, { status: 500 });
  }
}

/**
 * POST /api/admin/services
 * Tambah katalog layanan baru
 */
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      slug,
      title,
      shortTitle,
      subtitle,
      tagline,
      heroDescription,
      iconName,
      badge,
      features,
      problemsSolved,
      deliverables,
      workflow,
      techStack,
      accentColor,
      displayOrder,
    } = body;

    if (!slug || !title || !shortTitle || !subtitle || !heroDescription) {
      return NextResponse.json(
        { error: 'Field wajib tidak boleh kosong (slug, title, shortTitle, subtitle, heroDescription)' },
        { status: 400 }
      );
    }

    // Pastikan slug belum terpakai
    const existing = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: `Slug "${slug}" sudah digunakan.` }, { status: 400 });
    }

    const newService: NewService = {
      id: body.id || slug || crypto.randomUUID(),
      slug,
      title,
      shortTitle,
      subtitle,
      tagline: tagline || '',
      heroDescription,
      iconName: iconName || 'Code',
      badge: badge || 'Layanan Digital',
      features: Array.isArray(features) ? features : [],
      problemsSolved: Array.isArray(problemsSolved) ? problemsSolved : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      workflow: Array.isArray(workflow) ? workflow : [],
      techStack: Array.isArray(techStack) ? techStack : [],
      accentColor: accentColor || 'teal',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    };

    await db.insert(services).values(newService);

    clearServicesCache();

    return NextResponse.json({ success: true, message: 'Layanan berhasil ditambahkan', data: newService }, { status: 201 });
  } catch (error) {
    console.error('[API:Admin:Services:POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menyimpan layanan baru' },
      { status: 500 }
    );
  }
}
