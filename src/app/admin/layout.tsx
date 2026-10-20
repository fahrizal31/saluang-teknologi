import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getVerifiedAdminSession } from '@/lib/auth-session';
import { AdminShell } from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Portal | Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifikasi authoritatif sesi admin via server & evaluasi idle timeout 1 jam
  const sessionResult = await getVerifiedAdminSession(await headers());

  if (sessionResult.status === 'timeout') {
    redirect('/login?reason=timeout');
  }

  if (sessionResult.status === 'unauthenticated' || !sessionResult.user) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-saluang-sand" />}>
      <AdminShell
        adminUser={{
          name: sessionResult.user.name || 'Administrator',
          email: sessionResult.user.email,
        }}
        sessionLastActiveAt={sessionResult.lastActiveTimestamp}
      >
        {children}
      </AdminShell>
    </Suspense>
  );
}
