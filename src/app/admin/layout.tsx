import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
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
  // Verifikasi authoritatif sesi admin via Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-saluang-sand" />}>
      <AdminShell
        adminUser={{
          name: session.user.name || 'Administrator',
          email: session.user.email,
        }}
      >
        {children}
      </AdminShell>
    </Suspense>
  );
}
