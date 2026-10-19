import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

const VALID_STATUSES = ['baru', 'dihubungi', 'negosiasi', 'deal', 'ditolak'] as const;

/**
 * PATCH /api/admin/leads/[id]
 * Perbarui status lead atau catatan internal admin
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Data lead tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { status, notes } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status tidak valid. Pilihan: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await db
      .update(leads)
      .set({
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes: notes ? notes.trim() : null } : {}),
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id));

    return NextResponse.json({
      success: true,
      message: 'Status dan catatan lead berhasil diperbarui',
    });
  } catch (error) {
    console.error('[API:Admin:Leads:PATCH] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui data lead' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/leads/[id]
 * Hapus data lead dari database
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Data lead tidak ditemukan' }, { status: 404 });
    }

    await db.delete(leads).where(eq(leads.id, id));

    return NextResponse.json({
      success: true,
      message: 'Data lead berhasil dihapus',
    });
  } catch (error) {
    console.error('[API:Admin:Leads:DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus data lead' },
      { status: 500 }
    );
  }
}
