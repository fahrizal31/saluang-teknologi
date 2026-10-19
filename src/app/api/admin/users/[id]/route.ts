import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { user, account } from '@/lib/db/schema';
import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
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
 * PUT /api/admin/users/[id]
 * Reset kata sandi atau perbarui nama administrator
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const currentAdmin = await verifyAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const existing = await db.select().from(user).where(eq(user.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    const body = await req.json();
    const { name, password } = body;

    // Update nama jika dikirim
    if (name) {
      await db
        .update(user)
        .set({
          name: name.trim(),
          updatedAt: new Date(),
        })
        .where(eq(user.id, id));
    }

    // Reset kata sandi jika dikirim
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Kata sandi baru minimal 8 karakter.' },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(password);
      const existingAccount = await db
        .select()
        .from(account)
        .where(eq(account.userId, id))
        .limit(1);

      if (existingAccount.length > 0) {
        await db
          .update(account)
          .set({
            password: hashedPassword,
            accountId: id,
            updatedAt: new Date(),
          })
          .where(eq(account.userId, id));
      } else {
        await db.insert(account).values({
          id: crypto.randomUUID(),
          accountId: id,
          providerId: 'credential',
          userId: id,
          password: hashedPassword,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data administrator berhasil diperbarui.',
    });
  } catch (error) {
    console.error('[API:Admin:Users:PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal memperbarui data administrator' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Hapus akun administrator
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const currentAdmin = await verifyAdmin();
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    // Proteksi 1: Jangan hapus akun sendiri yang sedang login
    if (currentAdmin.id === id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.' },
        { status: 400 }
      );
    }

    // Proteksi 2: Pastikan tidak menghapus admin terakhir
    const allAdmins = await db.select().from(user);
    if (allAdmins.length <= 1) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus administrator terakhir di sistem.' },
        { status: 400 }
      );
    }

    const existing = await db.select().from(user).where(eq(user.id, id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Hapus akun dari account & user
    await db.delete(account).where(eq(account.userId, id));
    await db.delete(user).where(eq(user.id, id));

    return NextResponse.json({
      success: true,
      message: 'Akun administrator berhasil dihapus.',
    });
  } catch (error) {
    console.error('[API:Admin:Users:DELETE] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menghapus administrator' },
      { status: 500 }
    );
  }
}
