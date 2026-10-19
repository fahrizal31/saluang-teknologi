import { db } from '@/lib/db';
import { portfolioProjects, type PortfolioProjectModel } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { AdminPortfolioClient } from '@/components/admin/AdminPortfolioClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portofolio Proyek | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPortfolioPage() {
  let allProjects: PortfolioProjectModel[] = [];
  try {
    allProjects = await db
      .select()
      .from(portfolioProjects)
      .orderBy(asc(portfolioProjects.displayOrder));
  } catch (error) {
    console.error('[AdminPortfolioPage] Gagal membaca data portofolio dari database:', error);
  }

  return <AdminPortfolioClient initialProjects={allProjects} />;
}
