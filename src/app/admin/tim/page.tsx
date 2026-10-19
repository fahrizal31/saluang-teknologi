import { db } from '@/lib/db';
import { teamMembers, type TeamMemberModel } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { AdminTeamClient } from '@/components/admin/AdminTeamClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Anggota Tim | Admin Saluang Teknologi',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminTeamPage() {
  let allMembers: TeamMemberModel[] = [];
  try {
    allMembers = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder));
  } catch (error) {
    console.error('[AdminTeamPage] Gagal membaca data anggota tim dari database:', error);
  }

  return <AdminTeamClient initialMembers={allMembers} />;
}
