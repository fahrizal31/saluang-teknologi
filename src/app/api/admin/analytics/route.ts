import { NextRequest, NextResponse } from 'next/server';
import { connectionPool } from '@/lib/db';
import { ensureAnalyticsTables } from '@/lib/analytics/initTables';
import { getFlagEmoji } from '@/lib/analytics/countryData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Verifikasi Session Admin
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ||
      request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie?.value) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Pastikan tabel analitik sudah ada
    await ensureAnalyticsTables();

    // 3. Baca filter periode
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    let dateCondition = '`created_at` >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    let sessionDateCondition = '`last_active_at` >= DATE_SUB(NOW(), INTERVAL 7 DAY)';

    if (period === 'today') {
      dateCondition = '`created_at` >= CURDATE()';
      sessionDateCondition = '`last_active_at` >= CURDATE()';
    } else if (period === '30d') {
      dateCondition = '`created_at` >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
      sessionDateCondition = '`last_active_at` >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    } else if (period === 'all') {
      dateCondition = '1=1';
      sessionDateCondition = '1=1';
    }

    const conn = await connectionPool.getConnection();
    try {
      // 1. Jumlah Pengunjung Online (Aktif dalam 3 menit terakhir)
      const [onlineRows]: any = await conn.query(
        `SELECT COUNT(*) as count FROM \`visitor_sessions\` WHERE \`last_active_at\` >= DATE_SUB(NOW(), INTERVAL 3 MINUTE)`
      );
      const onlineCount = Number(onlineRows[0]?.count || 0);

      // 2. Daftar Pengunjung Online Saat Ini
      const [onlineVisitorsRows]: any = await conn.query(
        `SELECT 
          \`session_id\` as sessionId,
          \`ip_address\` as ipAddress,
          \`country_code\` as countryCode,
          \`country_name\` as countryName,
          \`city\`,
          \`current_path\` as currentPath,
          \`device_type\` as deviceType,
          \`browser\`,
          \`os\`,
          \`pageview_count\` as pageviewCount,
          \`last_active_at\` as lastActiveAt
        FROM \`visitor_sessions\`
        WHERE \`last_active_at\` >= DATE_SUB(NOW(), INTERVAL 3 MINUTE)
        ORDER BY \`last_active_at\` DESC
        LIMIT 20`
      );

      // 3. KPI Hari Ini (Today)
      const [todayRows]: any = await conn.query(
        `SELECT 
          COUNT(*) as pageviews,
          COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
        FROM \`visitor_pageviews\`
        WHERE \`created_at\` >= CURDATE()`
      );
      const pageviewsToday = Number(todayRows[0]?.pageviews || 0);
      const uniqueVisitorsToday = Number(todayRows[0]?.uniqueVisitors || 0);

      // 4. KPI Periode Terpilih
      const [periodRows]: any = await conn.query(
        `SELECT 
          COUNT(*) as pageviews,
          COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
        FROM \`visitor_pageviews\`
        WHERE ${dateCondition}`
      );
      const pageviewsPeriod = Number(periodRows[0]?.pageviews || 0);
      const uniqueVisitorsPeriod = Number(periodRows[0]?.uniqueVisitors || 0);

      // 5. Total Sepanjang Waktu
      const [allTimeRows]: any = await conn.query(
        `SELECT 
          COUNT(*) as totalPageviews,
          COUNT(DISTINCT \`ip_address\`) as totalUniqueVisitors
        FROM \`visitor_pageviews\``
      );
      const totalAllTimePageviews = Number(allTimeRows[0]?.totalPageviews || 0);
      const totalAllTimeVisitors = Number(allTimeRows[0]?.totalUniqueVisitors || 0);

      // 6. Grafik Tren Kunjungan Harian (Daily Trend)
      const [trendRows]: any = await conn.query(
        `SELECT 
          DATE_FORMAT(\`created_at\`, '%Y-%m-%d') as date,
          COUNT(*) as pageviews,
          COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
        FROM \`visitor_pageviews\`
        WHERE ${dateCondition}
        GROUP BY DATE_FORMAT(\`created_at\`, '%Y-%m-%d')
        ORDER BY date ASC`
      );

      // 7. Distribusi Negara Teratas (Top Countries)
      const [countryRows]: any = await conn.query(
        `SELECT 
          COALESCE(\`country_code\`, 'ID') as countryCode,
          COALESCE(\`country_name\`, 'Indonesia') as countryName,
          COUNT(*) as count
        FROM \`visitor_pageviews\`
        WHERE ${dateCondition}
        GROUP BY countryCode, countryName
        ORDER BY count DESC
        LIMIT 10`
      );

      const topCountries = countryRows.map((r: any) => ({
        code: r.countryCode,
        name: r.countryName,
        flag: getFlagEmoji(r.countryCode),
        count: Number(r.count),
        percentage: pageviewsPeriod > 0 ? Math.round((Number(r.count) / pageviewsPeriod) * 100) : 0,
      }));

      // 8. Kota Asal Teratas (Top Cities)
      const [cityRows]: any = await conn.query(
        `SELECT 
          \`city\`,
          COALESCE(\`country_name\`, 'Indonesia') as countryName,
          COUNT(*) as count
        FROM \`visitor_pageviews\`
        WHERE ${dateCondition} AND \`city\` IS NOT NULL AND \`city\` != ''
        GROUP BY \`city\`, countryName
        ORDER BY count DESC
        LIMIT 10`
      );

      // 9. Halaman Terpopuler (Top Pages)
      const [pageRows]: any = await conn.query(
        `SELECT 
          \`path\`,
          COUNT(*) as count
        FROM \`visitor_pageviews\`
        WHERE ${dateCondition}
        GROUP BY \`path\`
        ORDER BY count DESC
        LIMIT 10`
      );

      // 10. Perangkat (Device Types)
      const [deviceRows]: any = await conn.query(
        `SELECT 
          \`device_type\` as deviceType,
          COUNT(*) as count
        FROM \`visitor_sessions\`
        WHERE ${sessionDateCondition}
        GROUP BY \`device_type\``
      );

      // 11. Log 50 Kunjungan Terakhir (Recent Logs)
      const [recentLogRows]: any = await conn.query(
        `SELECT 
          \`id\`,
          \`session_id\` as sessionId,
          \`path\`,
          \`ip_address\` as ipAddress,
          \`country_code\` as countryCode,
          \`country_name\` as countryName,
          \`city\`,
          \`user_agent\` as userAgent,
          \`created_at\` as createdAt
        FROM \`visitor_pageviews\`
        ORDER BY \`created_at\` DESC
        LIMIT 50`
      );

      const formattedOnlineVisitors = onlineVisitorsRows.map((v: any) => ({
        ...v,
        flag: getFlagEmoji(v.countryCode),
      }));

      const formattedRecentLogs = recentLogRows.map((log: any) => ({
        ...log,
        flag: getFlagEmoji(log.countryCode),
      }));

      return NextResponse.json({
        ok: true,
        data: {
          period,
          onlineCount,
          onlineVisitors: formattedOnlineVisitors,
          kpis: {
            onlineCount,
            pageviewsToday,
            uniqueVisitorsToday,
            pageviewsPeriod,
            uniqueVisitorsPeriod,
            totalAllTimePageviews,
            totalAllTimeVisitors,
          },
          trend: trendRows.map((t: any) => ({
            date: t.date,
            pageviews: Number(t.pageviews),
            uniqueVisitors: Number(t.uniqueVisitors),
          })),
          topCountries,
          topCities: cityRows.map((c: any) => ({
            city: c.city,
            countryName: c.countryName,
            count: Number(c.count),
          })),
          topPages: pageRows.map((p: any) => ({
            path: p.path,
            count: Number(p.count),
          })),
          deviceStats: deviceRows.map((d: any) => ({
            deviceType: d.deviceType,
            count: Number(d.count),
          })),
          recentLogs: formattedRecentLogs,
        },
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in /api/admin/analytics:', error);
    return NextResponse.json(
      { ok: false, error: 'Gagal mengambil data statistik pengunjung' },
      { status: 500 }
    );
  }
}
