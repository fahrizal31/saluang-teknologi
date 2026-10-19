import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { leads, type Lead } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { AdminLeadsClient } from '@/components/admin/AdminLeadsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard Permintaan Proyek | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLeadsPage() {
  // 1. Verifikasi Sesi Admin Authoritatif dari Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/leads');
  }

  // 2. Baca seluruh data leads dari database MySQL
  let allLeads: Lead[] = [];
  try {
    allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch (error) {
    console.error('[AdminLeads] Gagal mengambil data leads:', error);
  }

  return (
    <AdminLeadsClient
      initialLeads={allLeads}
      adminUser={{
        name: session.user.name || 'Administrator',
        email: session.user.email,
      }}
    />
  );
}
