import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manajemen Administrator | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/users');
  }

  let allUsers: any[] = [];
  try {
    allUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));
  } catch (error) {
    console.error('[AdminUsersPage] Gagal membaca data user dari database:', error);
  }

  return (
    <AdminUsersClient
      initialUsers={allUsers}
      currentUserId={session.user.id}
    />
  );
}
