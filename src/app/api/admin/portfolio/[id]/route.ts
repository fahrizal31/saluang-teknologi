import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clearPortfolioCache } from '@/lib/data/portfolio';

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
 * PUT /api/admin/portfolio/[id]
 * Perbarui portofolio proyek
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
    const existing = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();

    const {
      slug,
      title,
      clientName,
      category,
      categoryLabel,
      summary,
      problem,
      solution,
      results,
      techStack,
      imageUrl,
      featured,
      completionYear,
      liveUrl,
      testimonial,
      displayOrder,
    } = body;

    // Jika slug diubah, pastikan tidak bentrok dengan ID lain
    if (slug && slug !== existing[0].slug) {
      const clash = await db
        .select()
        .from(portfolioProjects)
        .where(eq(portfolioProjects.slug, slug))
        .limit(1);

      if (clash.length > 0 && clash[0].id !== id) {
        return NextResponse.json({ error: `Slug "${slug}" sudah digunakan proyek lain.` }, { status: 400 });
      }
    }

    await db
      .update(portfolioProjects)
      .set({
        ...(slug ? { slug } : {}),
        ...(title ? { title } : {}),
        ...(clientName ? { clientName } : {}),
        ...(category ? { category } : {}),
        ...(categoryLabel ? { categoryLabel } : {}),
        ...(summary ? { summary } : {}),
        ...(problem ? { problem } : {}),
        ...(solution ? { solution } : {}),
        ...(results ? { results } : {}),
        ...(techStack ? { techStack } : {}),
        ...(imageUrl ? { imageUrl } : {}),
        ...(typeof featured === 'boolean' ? { featured } : {}),
        ...(completionYear ? { completionYear } : {}),
        ...(liveUrl !== undefined ? { liveUrl } : {}),
        ...(testimonial !== undefined ? { testimonial } : {}),
        ...(typeof displayOrder === 'number' ? { displayOrder } : {}),
        updatedAt: new Date(),
      })
      .where(eq(portfolioProjects.id, id));

    clearPortfolioCache();

    return NextResponse.json({ success: true, message: 'Proyek portofolio berhasil diperbarui' });
  } catch (error) {
    console.error('[API:Admin:Portfolio:PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui proyek' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/portfolio/[id]
 * Hapus proyek portofolio
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
    const existing = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan' }, { status: 404 });
    }

    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));

    clearPortfolioCache();

    return NextResponse.json({ success: true, message: 'Proyek berhasil dihapus' });
  } catch (error) {
    console.error('[API:Admin:Portfolio:DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus proyek' },
      { status: 500 }
    );
  }
}
