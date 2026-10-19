import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clearServicesCache } from '@/lib/data/services';

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
 * PUT /api/admin/services/[id]
 * Perbarui layanan yang ada
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    }

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

    // Jika slug diubah, pastikan tidak bentrok dengan ID lain
    if (slug && slug !== existing[0].slug) {
      const clash = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
      if (clash.length > 0 && clash[0].id !== id) {
        return NextResponse.json({ error: `Slug "${slug}" sudah digunakan layanan lain.` }, { status: 400 });
      }
    }

    await db
      .update(services)
      .set({
        ...(slug ? { slug } : {}),
        ...(title ? { title } : {}),
        ...(shortTitle ? { shortTitle } : {}),
        ...(subtitle ? { subtitle } : {}),
        ...(tagline !== undefined ? { tagline } : {}),
        ...(heroDescription ? { heroDescription } : {}),
        ...(iconName ? { iconName } : {}),
        ...(badge ? { badge } : {}),
        ...(features ? { features } : {}),
        ...(problemsSolved ? { problemsSolved } : {}),
        ...(deliverables ? { deliverables } : {}),
        ...(workflow ? { workflow } : {}),
        ...(techStack ? { techStack } : {}),
        ...(accentColor ? { accentColor } : {}),
        ...(typeof displayOrder === 'number' ? { displayOrder } : {}),
        updatedAt: new Date(),
      })
      .where(eq(services.id, id));

    clearServicesCache();

    return NextResponse.json({ success: true, message: 'Layanan berhasil diperbarui' });
  } catch (error) {
    console.error('[API:Admin:Services:PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui layanan' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/services/[id]
 * Hapus layanan
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    }

    await db.delete(services).where(eq(services.id, id));

    clearServicesCache();

    return NextResponse.json({ success: true, message: 'Layanan berhasil dihapus' });
  } catch (error) {
    console.error('[API:Admin:Services:DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus layanan' },
      { status: 500 }
    );
  }
}
