import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { session as sessionTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const IDLE_TIMEOUT_MS = 60 * 60 * 1000; // 1 Jam = 3.600.000 ms

export type VerifiedSessionResult =
  | {
      status: 'authenticated';
      user: {
        id: string;
        email: string;
        name: string;
        role?: string;
      };
      session: {
        id: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        token: string;
      };
      lastActiveTimestamp: number;
    }
  | {
      status: 'timeout';
      user: null;
      session: null;
      lastActiveTimestamp?: number;
    }
  | {
      status: 'unauthenticated';
      user: null;
      session: null;
    };

/**
 * Memvalidasi sesi admin secara authoritatif di sisi server.
 * Menegakkan aturan: Jika dalam 1 jam tidak ada aktivitas/pergerakan (misal laptop dimatikan),
 * sesi langsung dibatalkan (dihapus dari database) dan ditandai sebagai 'timeout'.
 */
export async function getVerifiedAdminSession(headersList: Headers): Promise<VerifiedSessionResult> {
  const sessionResult = await auth.api.getSession({
    headers: headersList,
  });

  if (!sessionResult?.user || !sessionResult?.session) {
    return { status: 'unauthenticated', user: null, session: null };
  }

  const rawDate = sessionResult.session.updatedAt || sessionResult.session.createdAt;
  const lastActiveTimestamp = new Date(rawDate).getTime();
  const idleElapsedMs = Date.now() - lastActiveTimestamp;

  // Skenario: Tidak ada pergerakan/aktivitas lebih dari 1 jam
  if (idleElapsedMs >= IDLE_TIMEOUT_MS) {
    try {
      // Hapus permanen sesi dari database TiDB agar cookie tidak bisa digunakan lagi
      await db.delete(sessionTable).where(eq(sessionTable.id, sessionResult.session.id));
    } catch (err) {
      console.error('[AuthSession] Gagal menghapus sesi kedaluwarsa:', err);
    }

    return {
      status: 'timeout',
      user: null,
      session: null,
      lastActiveTimestamp,
    };
  }

  // Jika masih aktif dalam rentang 1 jam, perbarui timestamp updatedAt di database (throttle per 60 detik)
  if (idleElapsedMs >= 60 * 1000) {
    try {
      await db
        .update(sessionTable)
        .set({ updatedAt: new Date() })
        .where(eq(sessionTable.id, sessionResult.session.id));
    } catch (err) {
      console.error('[AuthSession] Gagal memperbarui aktivitas sesi:', err);
    }
  }

  return {
    status: 'authenticated',
    user: sessionResult.user as any,
    session: sessionResult.session as any,
    lastActiveTimestamp,
  };
}
