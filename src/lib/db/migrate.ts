import * as dotenv from 'dotenv';
dotenv.config();

import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connectionPool } from './index';

async function runMigration() {
  console.log('[Migration] Menjalankan migrasi database Drizzle...');
  const startTime = Date.now();

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Migration] ✓ Seluruh migrasi database berhasil diaplikasikan (${duration}s)!`);
  } catch (error) {
    console.error('[Migration] ✗ Terjadi kesalahan saat migrasi:', error);
    process.exit(1);
  } finally {
    await connectionPool.end();
  }
}

runMigration();
