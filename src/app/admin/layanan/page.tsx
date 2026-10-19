import { db } from '@/lib/db';
import { services, type ServiceModel } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { AdminServicesClient } from '@/components/admin/AdminServicesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Katalog Layanan | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminServicesPage() {
  let allServices: ServiceModel[] = [];
  try {
    allServices = await db.select().from(services).orderBy(asc(services.displayOrder));
  } catch (error) {
    console.error('[AdminServicesPage] Gagal membaca layanan dari database:', error);
  }

  return <AdminServicesClient initialServices={allServices} />;
}
