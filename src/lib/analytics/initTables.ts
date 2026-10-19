import { connectionPool } from '../db';

let initialized = false;

/**
 * Memastikan tabel `visitor_sessions` dan `visitor_pageviews` beserta indeksnya
 * sudah ada di database (TiDB Cloud / MySQL) secara aman (idempotent).
 */
export async function ensureAnalyticsTables(): Promise<void> {
  if (initialized) return;

  try {
    const conn = await connectionPool.getConnection();

    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`visitor_sessions\` (
          \`session_id\` varchar(64) NOT NULL,
          \`ip_address\` varchar(64) NOT NULL,
          \`country_code\` varchar(10) DEFAULT 'ID',
          \`country_name\` varchar(100) DEFAULT 'Indonesia',
          \`city\` varchar(100) DEFAULT NULL,
          \`current_path\` varchar(255) NOT NULL DEFAULT '/',
          \`device_type\` varchar(20) NOT NULL DEFAULT 'desktop',
          \`browser\` varchar(50) DEFAULT NULL,
          \`os\` varchar(50) DEFAULT NULL,
          \`pageview_count\` int NOT NULL DEFAULT 1,
          \`first_seen_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`last_active_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`session_id\`),
          KEY \`idx_visitor_last_active\` (\`last_active_at\`),
          KEY \`idx_visitor_ip\` (\`ip_address\`),
          KEY \`idx_visitor_country\` (\`country_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS \`visitor_pageviews\` (
          \`id\` varchar(64) NOT NULL,
          \`session_id\` varchar(64) NOT NULL,
          \`path\` varchar(255) NOT NULL,
          \`ip_address\` varchar(64) NOT NULL,
          \`country_code\` varchar(10) DEFAULT NULL,
          \`country_name\` varchar(100) DEFAULT NULL,
          \`city\` varchar(100) DEFAULT NULL,
          \`referrer\` text DEFAULT NULL,
          \`user_agent\` text DEFAULT NULL,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_pv_created_at\` (\`created_at\`),
          KEY \`idx_pv_session\` (\`session_id\`),
          KEY \`idx_pv_path\` (\`path\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      initialized = true;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('[Analytics] Gagal menginisialisasi tabel analitik:', err);
  }
}
