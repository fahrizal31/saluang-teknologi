import { after } from 'node:test';
import './api/leads.test';
import './api/auth.test';
import './api/crud.test';
import { connectionPool } from '../src/lib/db';

// Tutup pool koneksi database setelah seluruh test suite selesai
after(async () => {
  try {
    await connectionPool.end();
  } catch {}
});
