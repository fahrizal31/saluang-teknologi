import { db } from '@/lib/db';
import { portfolioProjects } from '@/lib/db/schema';
import { portfolioData } from '@/data/portfolio';
import type { PortfolioProject, ServiceCategory } from '@/types/portfolio';
import { eq, asc } from 'drizzle-orm';

let cachedPortfolio: { data: PortfolioProject[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export function clearPortfolioCache() {
  cachedPortfolio = null;
}

/**
 * Mengambil seluruh daftar proyek portofolio, opsional difilter berdasarkan kategori layanan.
 * Menggunakan in-memory cache 60s untuk respon instan.
 */
export async function getPortfolioProjects(category?: 'all' | ServiceCategory): Promise<PortfolioProject[]> {
  const now = Date.now();
  let allProjects: PortfolioProject[];

  if (cachedPortfolio && now - cachedPortfolio.timestamp < CACHE_TTL_MS) {
    allProjects = cachedPortfolio.data;
  } else {
    try {
      const query = db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.displayOrder));
      const rows = await query;

      if (rows && rows.length > 0) {
        allProjects = rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          clientName: r.clientName,
          category: r.category as ServiceCategory,
          categoryLabel: r.categoryLabel,
          summary: r.summary,
          problem: r.problem,
          solution: r.solution,
          results: r.results,
          techStack: r.techStack,
          imageUrl: r.imageUrl,
          featured: r.featured,
          completionYear: r.completionYear,
          liveUrl: r.liveUrl || undefined,
          testimonial: r.testimonial || undefined,
        }));
        cachedPortfolio = { data: allProjects, timestamp: now };
      } else {
        allProjects = portfolioData;
      }
    } catch (err) {
      console.warn('[Data:Portfolio] Gagal mengambil dari DB, menggunakan fallback data mock:', err instanceof Error ? err.message : err);
      allProjects = portfolioData;
    }
  }

  if (category && category !== 'all') {
    return allProjects.filter((p) => p.category === category);
  }
  return allProjects;
}

/**
 * Mengambil proyek unggulan (featured) yang tampil di Beranda.
 */
export async function getFeaturedProjects(): Promise<PortfolioProject[]> {
  try {
    const rows = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.featured, true))
      .orderBy(asc(portfolioProjects.displayOrder));

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        clientName: r.clientName,
        category: r.category as ServiceCategory,
        categoryLabel: r.categoryLabel,
        summary: r.summary,
        problem: r.problem,
        solution: r.solution,
        results: r.results,
        techStack: r.techStack,
        imageUrl: r.imageUrl,
        featured: r.featured,
        completionYear: r.completionYear,
        liveUrl: r.liveUrl || undefined,
        testimonial: r.testimonial || undefined,
      }));
    }
  } catch (err) {
    console.warn('[Data:Portfolio] Gagal mengambil featured dari DB, fallback ke mock:', err instanceof Error ? err.message : err);
  }

  return portfolioData.filter((p) => p.featured);
}

/**
 * Mengambil satu proyek spesifik berdasarkan slug unik.
 */
export async function getPortfolioProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    const rows = await db.select().from(portfolioProjects).where(eq(portfolioProjects.slug, slug)).limit(1);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        clientName: r.clientName,
        category: r.category as ServiceCategory,
        categoryLabel: r.categoryLabel,
        summary: r.summary,
        problem: r.problem,
        solution: r.solution,
        results: r.results,
        techStack: r.techStack,
        imageUrl: r.imageUrl,
        featured: r.featured,
        completionYear: r.completionYear,
        liveUrl: r.liveUrl || undefined,
        testimonial: r.testimonial || undefined,
      };
    }
  } catch (err) {
    console.warn(`[Data:Portfolio] Gagal mengambil slug "${slug}" dari DB, fallback ke mock:`, err instanceof Error ? err.message : err);
  }

  const fallback = portfolioData.find((p) => p.slug === slug);
  return fallback || null;
}
