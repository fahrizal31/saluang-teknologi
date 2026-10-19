import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminAnalyticsClient } from '@/components/admin/AdminAnalyticsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Statistik & Pengunjung Online | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminAnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/analytics');
  }

  return (
    <AdminAnalyticsClient
      adminUser={{
        name: session.user.name || 'Administrator',
        email: session.user.email,
      }}
    />
  );
}
