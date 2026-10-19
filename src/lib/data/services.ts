import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { servicesData } from '@/data/services';
import type { ServiceItem } from '@/types/service';
import { eq, asc } from 'drizzle-orm';

export function clearServicesCache() {
  // no-op, always fresh
}

/**
 * Mengambil seluruh katalog layanan digital langsung dari database.
 */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const rows = await db.select().from(services).orderBy(asc(services.displayOrder));
    if (rows && rows.length > 0) {
      const result: ServiceItem[] = rows.map((r) => ({
        id: r.id,
        slug: r.slug as ServiceItem['slug'],
        title: r.title,
        shortTitle: r.shortTitle,
        subtitle: r.subtitle,
        tagline: r.tagline,
        heroDescription: r.heroDescription,
        iconName: r.iconName as ServiceItem['iconName'],
        badge: r.badge,
        features: r.features,
        problemsSolved: r.problemsSolved,
        deliverables: r.deliverables,
        workflow: r.workflow,
        techStack: r.techStack,
        accentColor: r.accentColor,
      }));
      return result;
    }
  } catch (err) {
    console.warn('[Data:Services] Gagal mengambil dari DB, menggunakan fallback data mock:', err instanceof Error ? err.message : err);
  }

  return servicesData;
}

/**
 * Mengambil satu layanan spesifik berdasarkan slug unik.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  try {
    const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        slug: r.slug as ServiceItem['slug'],
        title: r.title,
        shortTitle: r.shortTitle,
        subtitle: r.subtitle,
        tagline: r.tagline,
        heroDescription: r.heroDescription,
        iconName: r.iconName as ServiceItem['iconName'],
        badge: r.badge,
        features: r.features,
        problemsSolved: r.problemsSolved,
        deliverables: r.deliverables,
        workflow: r.workflow,
        techStack: r.techStack,
        accentColor: r.accentColor,
      };
    }
  } catch (err) {
    console.warn(`[Data:Services] Gagal mengambil slug "${slug}" dari DB, fallback ke mock:`, err instanceof Error ? err.message : err);
  }

  const fallback = servicesData.find((s) => s.slug === slug);
  return fallback || null;
}
