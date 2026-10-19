import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { teamData } from '@/data/team';
import type { TeamMember } from '@/types/team';
import { asc } from 'drizzle-orm';

let cachedTeam: { data: TeamMember[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export function clearTeamCache() {
  cachedTeam = null;
}

/**
 * Mengambil profil seluruh anggota tim Saluang Teknologi.
 * Menggunakan in-memory cache 60s untuk respon instan.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const now = Date.now();
  if (cachedTeam && now - cachedTeam.timestamp < CACHE_TTL_MS) {
    return cachedTeam.data;
  }

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
      cachedTeam = { data: result, timestamp: now };
      return result;
    }
  } catch (err) {
    console.warn('[Data:Team] Gagal mengambil dari DB, menggunakan fallback data mock:', err instanceof Error ? err.message : err);
  }

  return teamData;
}
