import { NextRequest, NextResponse } from 'next/server';
import { connectionPool } from '@/lib/db';
import { ensureAnalyticsTables } from '@/lib/analytics/initTables';
import { isBotUserAgent, parseUserAgent } from '@/lib/analytics/detector';
import { getCountryName } from '@/lib/analytics/countryData';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    // 1. Abaikan Bot & Web Crawler
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json({ ok: true, ignored: 'bot' });
    }

    // 2. Abaikan jika request berasal dari admin yang sedang login
    const hasAdminSession = Boolean(
      request.cookies.get('better-auth.session_token') ||
      request.cookies.get('__Secure-better-auth.session_token')
    );
    if (hasAdminSession) {
      return NextResponse.json({ ok: true, ignored: 'admin' });
    }

    // 3. Baca payload dari klien
    let body: {
      sessionId?: string;
      path?: string;
      isHeartbeat?: boolean;
      referrer?: string;
    } = {};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const sessionId = (body.sessionId || '').trim();
    if (!sessionId || sessionId.length > 64) {
      return NextResponse.json({ ok: false, error: 'Invalid sessionId' }, { status: 400 });
    }

    const currentPath = (body.path || '/').slice(0, 255);
    const isHeartbeat = Boolean(body.isHeartbeat);
    const referrer = (body.referrer || request.headers.get('referer') || '').slice(0, 500);

    // 4. Deteksi IP dan Geolocation Vercel
    const ipAddress = getClientIp(request);
    const rawCountryCode = (request.headers.get('x-vercel-ip-country') || '').toUpperCase().trim();
    const rawCity = request.headers.get('x-vercel-ip-city') || '';

    const countryCode = rawCountryCode && rawCountryCode !== 'UNKNOWN' ? rawCountryCode : 'ID';
    const countryName = getCountryName(countryCode);
    let city = rawCity ? decodeURIComponent(rawCity).slice(0, 100) : (countryCode === 'ID' && ipAddress === '127.0.0.1' ? 'Lokal' : null);

    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // 5. Pastikan tabel analitik sudah ada
    await ensureAnalyticsTables();

    const conn = await connectionPool.getConnection();
    try {
      // 6. Upsert Session Pengunjung
      const pvIncrement = isHeartbeat ? 0 : 1;
      await conn.query(
        `INSERT INTO \`visitor_sessions\` (
          \`session_id\`, \`ip_address\`, \`country_code\`, \`country_name\`, \`city\`,
          \`current_path\`, \`device_type\`, \`browser\`, \`os\`, \`pageview_count\`,
          \`first_seen_at\`, \`last_active_at\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          \`last_active_at\` = NOW(),
          \`current_path\` = VALUES(\`current_path\`),
          \`pageview_count\` = \`pageview_count\` + ?`,
        [
          sessionId,
          ipAddress,
          countryCode,
          countryName,
          city,
          currentPath,
          deviceType,
          browser,
          os,
          pvIncrement,
          pvIncrement,
        ]
      );

      // 7. Jika ini adalah kunjungan halaman baru (bukan sekedar heartbeat), catat ke log riwayat
      if (!isHeartbeat) {
        const pvId = `pv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await conn.query(
          `INSERT INTO \`visitor_pageviews\` (
            \`id\`, \`session_id\`, \`path\`, \`ip_address\`, \`country_code\`,
            \`country_name\`, \`city\`, \`referrer\`, \`user_agent\`, \`created_at\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            pvId,
            sessionId,
            currentPath,
            ipAddress,
            countryCode,
            countryName,
            city,
            referrer || null,
            userAgent.slice(0, 500) || null,
          ]
        );
      }

      return NextResponse.json({ ok: true });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in /api/track:', error);
    return NextResponse.json({ ok: false, error: 'Internal tracking error' }, { status: 500 });
  }
}
