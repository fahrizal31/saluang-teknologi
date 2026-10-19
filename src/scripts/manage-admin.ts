import * as dotenv from 'dotenv';
dotenv.config();

import { db, connectionPool } from '../lib/db';
import { user, account } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import crypto from 'crypto';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  try {
    switch (command) {
      case 'create': {
        const email = args[1]?.trim().toLowerCase();
        const password = args[2]?.trim();
        const name = args.slice(3).join(' ').trim() || 'Administrator Saluang';

        if (!email || !password) {
          console.error('\n❌ Format salah!');
          console.error('Penggunaan: npm run admin:create <email> <password> [nama]');
          console.error('Contoh:     npm run admin:create halo@saluangteknologi.com Rahasia2026! "Super Admin"\n');
          process.exit(1);
        }

        if (password.length < 8) {
          console.error('\n❌ Kata sandi harus minimal 8 karakter demi keamanan!\n');
          process.exit(1);
        }

        const existing = await db.select().from(user).where(eq(user.email, email)).limit(1);
        if (existing.length > 0) {
          console.error(`\n❌ Email "${email}" sudah terdaftar di database.`);
          console.error('Gunakan: npm run admin:reset-password <email> <password_baru> untuk mereset kata sandi.\n');
          process.exit(1);
        }

        console.log(`\n🔒 Mengenkripsi kata sandi menggunakan scrypt hash...`);
        const hashedPassword = await hashPassword(password);
        const userId = crypto.randomUUID();
        const accountId = crypto.randomUUID();

        // 1. Simpan ke tabel user
        await db.insert(user).values({
          id: userId,
          name: name,
          email: email,
          emailVerified: true,
          role: 'admin',
        });

        // 2. Simpan kata sandi terenkripsi ke tabel account
        await db.insert(account).values({
          id: accountId,
          accountId: userId,
          providerId: 'credential',
          userId: userId,
          password: hashedPassword,
        });

        console.log(`\n✅ Administrator baru berhasil dibuat dan disimpan di database!`);
        console.log(`   - ID Pengguna : ${userId}`);
        console.log(`   - Nama        : ${name}`);
        console.log(`   - Email       : ${email}`);
        console.log(`   - Status Hash : Terenkripsi aman di tabel 'account' (scrypt)`);
        console.log(`   - Keamanan    : Kredensial TIDAK disimpan di .env\n`);
        break;
      }

      case 'reset': {
        const email = args[1]?.trim().toLowerCase();
        const newPassword = args[2]?.trim();

        if (!email || !newPassword) {
          console.error('\n❌ Format salah!');
          console.error('Penggunaan: npm run admin:reset-password <email> <password_baru>');
          console.error('Contoh:     npm run admin:reset-password admin@saluangteknologi.com PasswordBaru2026!\n');
          process.exit(1);
        }

        if (newPassword.length < 8) {
          console.error('\n❌ Kata sandi baru harus minimal 8 karakter demi keamanan!\n');
          process.exit(1);
        }

        const existing = await db.select().from(user).where(eq(user.email, email)).limit(1);
        if (existing.length === 0) {
          console.error(`\n❌ Pengguna dengan email "${email}" tidak ditemukan di database.\n`);
          process.exit(1);
        }

        const targetUser = existing[0];
        console.log(`\n🔒 Mengenkripsi kata sandi baru untuk ${email}...`);
        const hashedNewPassword = await hashPassword(newPassword);

        // Periksa apakah record account sudah ada
        const existingAccount = await db.select().from(account).where(eq(account.userId, targetUser.id)).limit(1);

        if (existingAccount.length > 0) {
          await db
            .update(account)
            .set({
              password: hashedNewPassword,
              accountId: targetUser.id,
              updatedAt: new Date(),
            })
            .where(eq(account.userId, targetUser.id));
        } else {
          await db.insert(account).values({
            id: crypto.randomUUID(),
            accountId: targetUser.id,
            providerId: 'credential',
            userId: targetUser.id,
            password: hashedNewPassword,
          });
        }

        console.log(`\n✅ Kata sandi untuk ${email} berhasil direset dan dienkripsi ulang di database!\n`);
        break;
      }

      case 'list': {
        const users = await db.select().from(user);
        console.log('\n=== DAFTAR ADMINISTRATOR DI BASIS DATA ===');
        if (users.length === 0) {
          console.log('(Belum ada pengguna terdaftar di database)');
        } else {
          users.forEach((u, idx) => {
            console.log(
              `${idx + 1}. [${u.role.toUpperCase()}] ${u.name} <${u.email}> (ID: ${u.id}, Verified: ${u.emailVerified ? 'Ya' : 'Tidak'})`
            );
          });
        }
        console.log('Catatan: Seluruh kata sandi disimpan dalam bentuk hash terenkripsi di tabel account.\n');
        break;
      }

      default: {
        console.log(`
Pengelola Akun Administrator Saluang Teknologi (Database & Terenkripsi):
------------------------------------------------------------------------
Perintah yang tersedia:
  1. npm run admin:create <email> <password> [nama]
     -> Membuat akun administrator baru dengan kata sandi terenkripsi di database.
  2. npm run admin:reset-password <email> <password_baru>
     -> Mereset kata sandi akun admin di database dengan enkripsi scrypt baru.
  3. npm run admin:list
     -> Menampilkan daftar administrator yang ada di database.
`);
        break;
      }
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    process.exit(1);
  } finally {
    await connectionPool.end();
  }
}

main();
