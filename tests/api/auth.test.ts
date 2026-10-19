import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { auth } from '../../src/lib/auth';

describe('Better Auth Authentication Test Suite', () => {
  // Kredensial akun admin yang tersimpan dan terenkripsi di database MySQL
  const testAdminEmail = 'admin@saluangteknologi.com';
  const testAdminPassword = 'AdminSaluang2026!';

  it('1. Sukses: Admin dapat login dengan kredensial yang valid', async () => {
    const result = await auth.api.signInEmail({
      body: {
        email: testAdminEmail,
        password: testAdminPassword,
      },
    });

    assert.ok(result, 'Respons login harus ada');
    assert.ok(result.user, 'Objek user harus ada');
    assert.equal(result.user.email, testAdminEmail);
    assert.equal(result.user.role, 'admin');
  });

  it('2. Gagal: Login ditolak jika kata sandi salah', async () => {
    try {
      await auth.api.signInEmail({
        body: {
          email: testAdminEmail,
          password: 'PasswordSalahTotal123!',
        },
      });
      assert.fail('Harus memicu error otentikasi');
    } catch (error: any) {
      assert.ok(error, 'Error harus dilempar untuk kredensial tidak valid');
    }
  });

  it('3. Gagal: Login ditolak untuk email yang tidak terdaftar', async () => {
    try {
      await auth.api.signInEmail({
        body: {
          email: 'bukan.admin@saluangteknologi.com',
          password: 'PasswordAcak123!',
        },
      });
      assert.fail('Harus memicu error otentikasi');
    } catch (error: any) {
      assert.ok(error, 'Error harus dilempar untuk email tidak terdaftar');
    }
  });
});
