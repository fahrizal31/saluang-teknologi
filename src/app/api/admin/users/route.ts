import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, account } from '@/lib/db/schema';
import { hashPassword } from 'better-auth/crypto';
import { desc, eq } from 'drizzle-orm';
import crypto from 'crypto';

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
 * GET /api/admin/users
 * Mengambil daftar seluruh administrator
 */
export async function GET() {
  const currentAdmin = await verifyAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await db
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

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('[API:Admin:Users:GET] Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data administrator' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Membuat akun administrator baru
 */
export async function POST(req: NextRequest) {
  const currentAdmin = await verifyAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Field nama, email, dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Kata sandi minimal harus 8 karakter demi keamanan.' },
        { status: 400 }
      );
    }

    const existing = await db.select().from(user).where(eq(user.email, cleanEmail)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `Email "${cleanEmail}" sudah terdaftar sebagai administrator.` },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();

    // 1. Simpan ke tabel user
    await db.insert(user).values({
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      emailVerified: true,
      role: 'admin',
    });

    // 2. Simpan kredensial terenkripsi ke tabel account
    await db.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Administrator baru berhasil dibuat.',
        data: { id: userId, name: name.trim(), email: cleanEmail, role: 'admin' },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API:Admin:Users:POST] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal membuat administrator baru' },
      { status: 500 }
    );
  }
}
