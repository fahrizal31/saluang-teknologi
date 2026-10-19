import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { teamMembers, type NewTeamMember } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import crypto from 'crypto';
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
 * GET /api/admin/team
 * Ambil seluruh anggota tim
 */
export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allMembers = await db
      .select()
      .from(teamMembers)
      .orderBy(asc(teamMembers.displayOrder));
    return NextResponse.json({ success: true, data: allMembers });
  } catch (error) {
    console.error('[API:Admin:Team:GET] Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data anggota tim' }, { status: 500 });
  }
}

/**
 * POST /api/admin/team
 * Tambah profil anggota tim baru
 */
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    if (!name || !role || !roleCategory || !bio || !avatarUrl) {
      return NextResponse.json(
        {
          error: 'Field wajib tidak boleh kosong (name, role, roleCategory, bio, avatarUrl)',
        },
        { status: 400 }
      );
    }

    const newMember: NewTeamMember = {
      id: body.id || `team-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name: name.trim(),
      role: role.trim(),
      roleCategory: roleCategory.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      linkedinUrl: linkedinUrl ? linkedinUrl.trim() : null,
      githubUrl: githubUrl ? githubUrl.trim() : null,
      displayOrder: typeof displayOrder === 'number' ? displayOrder : 0,
    };

    await db.insert(teamMembers).values(newMember);

    clearTeamCache();

    return NextResponse.json(
      { success: true, message: 'Anggota tim berhasil ditambahkan', data: newMember },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API:Admin:Team:POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menyimpan anggota tim baru' },
      { status: 500 }
    );
  }
}
