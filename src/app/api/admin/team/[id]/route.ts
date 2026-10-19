import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { clearTeamCache } from '@/lib/data/team';

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * PUT /api/admin/team/[id]
 * Perbarui data anggota tim
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Anggota tim tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();

    const {
      name,
      role,
      roleCategory,
      bio,
      avatarUrl,
      linkedinUrl,
      githubUrl,
      displayOrder,
    } = body;

    await db
      .update(teamMembers)
      .set({
        ...(name ? { name: name.trim() } : {}),
        ...(role ? { role: role.trim() } : {}),
        ...(roleCategory ? { roleCategory: roleCategory.trim() } : {}),
        ...(bio ? { bio: bio.trim() } : {}),
        ...(avatarUrl ? { avatarUrl: avatarUrl.trim() } : {}),
        ...(linkedinUrl !== undefined ? { linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null } : {}),
        ...(githubUrl !== undefined ? { githubUrl: githubUrl ? githubUrl.trim() : null } : {}),
        ...(typeof displayOrder === 'number' ? { displayOrder } : {}),
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, id));

    clearTeamCache();

    return NextResponse.json({ success: true, message: 'Data anggota tim berhasil diperbarui' });
  } catch (error) {
    console.error('[API:Admin:Team:PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui anggota tim' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/team/[id]
 * Hapus anggota tim
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
    const existing = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Anggota tim tidak ditemukan' }, { status: 404 });
    }

    await db.delete(teamMembers).where(eq(teamMembers.id, id));

    clearTeamCache();

    return NextResponse.json({ success: true, message: 'Anggota tim berhasil dihapus' });
  } catch (error) {
    console.error('[API:Admin:Team:DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus anggota tim' },
      { status: 500 }
    );
  }
}
