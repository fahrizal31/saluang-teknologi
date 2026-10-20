import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

/**
 * Konfigurasi koneksi MySQL Database.
 * Mendukung TiDB Cloud, PlanetScale, dan MySQL standar.
 * Mengambil parameter dari DATABASE_URL atau variabel terpisah DB_HOST, DB_USER, dll.
 */
function getDbConnectionConfig(): mysql.PoolOptions {
  const databaseUrl = process.env.DATABASE_URL;

  let baseConfig: mysql.PoolOptions;

  // Jika DATABASE_URL tersedia dan valid
  if (databaseUrl && databaseUrl.startsWith('mysql://')) {
    try {
      const parsed = new URL(databaseUrl);
      baseConfig = {
        host: parsed.hostname || 'localhost',
        port: parseInt(parsed.port || '3306', 10),
        user: decodeURIComponent(parsed.username || 'root'),
        password: decodeURIComponent(parsed.password || ''),
        database: parsed.pathname.replace(/^\//, '') || 'saluang_db',
        timezone: 'Z',
      };
    } catch {
      // fallback jika URL gagal diparsing
      baseConfig = getFallbackConfig();
    }
  } else {
    baseConfig = getFallbackConfig();
  }

  // Konfigurasi SSL untuk TiDB Cloud dan penyedia cloud lainnya
  const requireSSL = process.env.DB_SSL === 'true';
  if (requireSSL) {
    let caContent: string | undefined;
    const caFile = process.env.DB_SSL_CA || 'isrgrootx1.pem';
    try {
      const fs = require('fs');
      const path = require('path');
      const resolvedPath = path.isAbsolute(caFile) ? caFile : path.join(process.cwd(), caFile);
      if (fs.existsSync(resolvedPath)) {
        caContent = fs.readFileSync(resolvedPath, 'utf-8');
      }
    } catch {
      // Abaikan jika fs tidak tersedia (misal di edge runtime)
    }

    baseConfig.ssl = {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
      ...(caContent ? { ca: caContent } : {}),
    };
  }

  // Optimasi pool untuk lingkungan serverless (Vercel)
  const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
  return {
    ...baseConfig,
    timezone: 'Z',
    waitForConnections: true,
    connectionLimit: isServerless ? 3 : 10,
    queueLimit: 0,
    enableKeepAlive: !isServerless,
    keepAliveInitialDelay: isServerless ? undefined : 10000,
  };
}

function getFallbackConfig(): mysql.PoolOptions {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'saluang_db',
    timezone: 'Z',
  };
}

const poolOptions = getDbConnectionConfig();

// Singleton connection pool across hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
  // eslint-disable-next-line no-var
  var _drizzleDb: MySql2Database<typeof schema> | undefined;
}

export const connectionPool =
  global._mysqlPool ||
  mysql.createPool(poolOptions);

if (process.env.NODE_ENV !== 'production') {
  global._mysqlPool = connectionPool;
}

export const db = global._drizzleDb || drizzle(connectionPool, { schema, mode: 'default' });

if (process.env.NODE_ENV !== 'production') {
  global._drizzleDb = db;
}

/**
 * Healthcheck database helper
 * Mengembalikan status konektivitas pool MySQL
 */
export async function checkDbHealth(): Promise<{ healthy: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const connection = await connectionPool.getConnection();
    await connection.ping();
    connection.release();
    return {
      healthy: true,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      healthy: false,
      error: err instanceof Error ? err.message : 'Unknown database error',
    };
  }
}

