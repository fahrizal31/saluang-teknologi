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

    // Titik awal hari ini dalam WIB (UTC+7) dikonversikan ke UTC untuk perbandingan database yang akurat
    const wibTodayStartSql =
      "DATE_SUB(DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 7 HOUR), '%Y-%m-%d 00:00:00'), INTERVAL 7 HOUR)";

    let dateCondition = `\`created_at\` >= DATE_SUB(${wibTodayStartSql}, INTERVAL 6 DAY)`;
    let sessionDateCondition = `\`last_active_at\` >= DATE_SUB(${wibTodayStartSql}, INTERVAL 6 DAY)`;

    if (period === 'today') {
      dateCondition = `\`created_at\` >= ${wibTodayStartSql}`;
      sessionDateCondition = `\`last_active_at\` >= ${wibTodayStartSql}`;
    } else if (period === '30d') {
      dateCondition = `\`created_at\` >= DATE_SUB(${wibTodayStartSql}, INTERVAL 29 DAY)`;
      sessionDateCondition = `\`last_active_at\` >= DATE_SUB(${wibTodayStartSql}, INTERVAL 29 DAY)`;
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

      // 3. KPI Hari Ini (Today) dihitung berdasarkan kalender WIB
      const [todayRows]: any = await conn.query(
        `SELECT 
          COUNT(*) as pageviews,
          COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
        FROM \`visitor_pageviews\`
        WHERE \`created_at\` >= ${wibTodayStartSql}`
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

      // 6. Grafik Tren Kunjungan Harian (Daily/Hourly Trend dalam WIB)
      const trend: { date: string; pageviews: number; uniqueVisitors: number }[] = [];

      if (period === 'today') {
        // Tren per jam untuk Hari Ini (00:00 - 23:00 WIB)
        const [hourlyRows]: any = await conn.query(
          `SELECT 
            DATE_FORMAT(DATE_ADD(\`created_at\`,\ INTERVAL 7 HOUR), '%H:00') as hourLabel,
            COUNT(*) as pageviews,
            COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
          FROM \`visitor_pageviews\`
          WHERE ${dateCondition}
          GROUP BY hourLabel
          ORDER BY hourLabel ASC`
        );

        const hourlyMap = new Map<string, { pageviews: number; uniqueVisitors: number }>();
        for (const row of hourlyRows) {
          hourlyMap.set(row.hourLabel, {
            pageviews: Number(row.pageviews),
            uniqueVisitors: Number(row.uniqueVisitors),
          });
        }

        const currentHourWib = new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCHours();
        const maxHour = Math.max(currentHourWib, 11);
        for (let h = 0; h <= maxHour; h++) {
          const hourStr = `${String(h).padStart(2, '0')}:00`;
          const existing = hourlyMap.get(hourStr) || { pageviews: 0, uniqueVisitors: 0 };
          trend.push({
            date: hourStr,
            pageviews: existing.pageviews,
            uniqueVisitors: existing.uniqueVisitors,
          });
        }
      } else {
        // Tren Harian (7 Hari, 30 Hari, atau Semua) dikelompokkan tanggal WIB
        const [trendRows]: any = await conn.query(
          `SELECT 
            DATE_FORMAT(DATE_ADD(\`created_at\`, INTERVAL 7 HOUR), '%Y-%m-%d') as date,
            COUNT(*) as pageviews,
            COUNT(DISTINCT \`ip_address\`) as uniqueVisitors
          FROM \`visitor_pageviews\`
          WHERE ${dateCondition}
          GROUP BY date
          ORDER BY date ASC`
        );

        const trendMap = new Map<string, { pageviews: number; uniqueVisitors: number }>();
        for (const row of trendRows) {
          trendMap.set(row.date, {
            pageviews: Number(row.pageviews),
            uniqueVisitors: Number(row.uniqueVisitors),
          });
        }

        if (period === '7d' || period === '30d') {
          const numDays = period === '7d' ? 7 : 30;
          const nowWibMs = Date.now() + 7 * 60 * 60 * 1000;
          for (let i = numDays - 1; i >= 0; i--) {
            const dayTime = new Date(nowWibMs - i * 24 * 60 * 60 * 1000);
            const dateStr = dayTime.toISOString().slice(0, 10);
            const existing = trendMap.get(dateStr) || { pageviews: 0, uniqueVisitors: 0 };
            trend.push({
              date: dateStr,
              pageviews: existing.pageviews,
              uniqueVisitors: existing.uniqueVisitors,
            });
          }
        } else {
          // 'all': gunakan semua tanggal yang ada
          for (const row of trendRows) {
            trend.push({
              date: row.date,
              pageviews: Number(row.pageviews),
              uniqueVisitors: Number(row.uniqueVisitors),
            });
          }
        }
      }

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
          trend,
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
