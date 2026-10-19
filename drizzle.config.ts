import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

function getDbUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const user = process.env.DB_USER || 'saluang_user';
  const pass = process.env.DB_PASSWORD || 'saluang_db_password_local';
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '3306';
  const name = process.env.DB_NAME || 'saluang_db';
  return `mysql://${user}:${pass}@${host}:${port}/${name}`;
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: getDbUrl(),
  },
});
