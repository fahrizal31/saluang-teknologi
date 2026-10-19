import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { portfolioProjects, type NewPortfolioProject } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';
import crypto from 'crypto';
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
 * GET /api/admin/portfolio
 * Ambil seluruh portofolio proyek
 */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allProjects = await db
      .select()
      .from(portfolioProjects)
      .orderBy(asc(portfolioProjects.displayOrder));
    return NextResponse.json({ success: true, data: allProjects });
  } catch (error) {
    console.error('[API:Admin:Portfolio:GET] Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data portofolio' }, { status: 500 });
  }
}

/**
 * POST /api/admin/portfolio
 * Tambah studi kasus proyek baru
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

    if (!slug || !title || !clientName || !category || !summary || !problem || !solution || !imageUrl) {
      return NextResponse.json(
        {
          error:
            'Field wajib tidak boleh kosong (slug, title, clientName, category, summary, problem, solution, imageUrl)',
        },
        { status: 400 }
      );
    }

    // Pastikan slug belum terpakai
    const existing = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: `Slug "${slug}" sudah digunakan proyek lain.` }, { status: 400 });
    }

    const newProject: NewPortfolioProject = {
      id: body.id || slug || crypto.randomUUID(),
      slug,
      title,
      clientName,
      category,
      categoryLabel: categoryLabel || category,
      summary,
      problem,
      solution,
      results: Array.isArray(results) ? results : [],
      techStack: Array.isArray(techStack) ? techStack : [],
      imageUrl,
      featured: Boolean(featured),
      completionYear: completionYear || new Date().getFullYear().toString(),
      liveUrl: liveUrl || null,
      testimonial: testimonial || null,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    };

    await db.insert(portfolioProjects).values(newProject);

    clearPortfolioCache();

    return NextResponse.json(
      { success: true, message: 'Proyek portofolio berhasil ditambahkan', data: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API:Admin:Portfolio:POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menyimpan proyek baru' },
      { status: 500 }
    );
  }
}
