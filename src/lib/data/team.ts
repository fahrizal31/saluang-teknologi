import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { teamData } from '@/data/team';
import type { TeamMember } from '@/types/team';
import { asc } from 'drizzle-orm';

export function clearTeamCache() {
  // no-op, always fresh
}

/**
 * Mengambil profil seluruh anggota tim Saluang Teknologi secara langsung dari database.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {

  try {
    const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.displayOrder));
    if (rows && rows.length > 0) {
      const result: TeamMember[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        roleCategory: r.roleCategory as TeamMember['roleCategory'],
        bio: r.bio,
        avatarUrl: r.avatarUrl,
        linkedinUrl: r.linkedinUrl || undefined,
        githubUrl: r.githubUrl || undefined,
      }));
      return result;
    }
  } catch (err) {
    console.warn('[Data:Team] Gagal mengambil dari DB, menggunakan fallback data mock:', err instanceof Error ? err.message : err);
  }

  return teamData;
}
