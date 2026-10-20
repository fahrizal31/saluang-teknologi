import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { user, session, account, verification } from './db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'mysql',
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000',
  trustedOrigins: [
    'http://localhost:3000',
    'https://saluang-teknologi.my.id',
    'https://www.saluang-teknologi.my.id',
    'https://saluang-teknologi.vercel.app',
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET || 'saluang_teknologi_better_auth_secret_dev_32char_key',
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'admin',
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60, // 1 jam (3600 detik) masa berlaku sesi
    updateAge: 60 * 5, // perbarui masa berlaku sesi setiap 5 menit jika ada aktivitas
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 menit
    },
  },
});
