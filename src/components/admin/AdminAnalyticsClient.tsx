'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Users,
  Eye,
  Globe,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  MapPin,
  Search,
  Copy,
  Check,
  TrendingUp,
  FileText,
  Radio,
  Compass,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

interface OnlineVisitor {
  sessionId: string;
  ipAddress: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  currentPath: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  pageviewCount: number;
  lastActiveAt: string;
  flag: string;
}

interface TopCountry {
  code: string;
  name: string;
  flag: string;
  count: number;
  percentage: number;
}

interface TopCity {
  city: string;
  countryName: string;
  count: number;
}

interface TopPage {
  path: string;
  count: number;
}

interface DeviceStat {
  deviceType: string;
  count: number;
}

interface RecentLog {
  id: string;
  sessionId: string;
  path: string;
  ipAddress: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  userAgent: string;
  createdAt: string;
  flag: string;
}

interface TrendItem {
  date: string;
  pageviews: number;
  uniqueVisitors: number;
}

interface AnalyticsData {
  period: string;
  onlineCount: number;
  onlineVisitors: OnlineVisitor[];
  kpis: {
    onlineCount: number;
    pageviewsToday: number;
    uniqueVisitorsToday: number;
    pageviewsPeriod: number;
    uniqueVisitorsPeriod: number;
    totalAllTimePageviews: number;
    totalAllTimeVisitors: number;
  };
  trend: TrendItem[];
  topCountries: TopCountry[];
  topCities: TopCity[];
  topPages: TopPage[];
  deviceStats: DeviceStat[];
  recentLogs: RecentLog[];
}

interface AdminAnalyticsClientProps {
  adminUser: {
    name: string;
    email: string;
  };
}

export function AdminAnalyticsClient({ adminUser }: AdminAnalyticsClientProps) {
  const [period, setPeriod] = useState<string>('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.data) {
          setData(json.data);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error('Gagal memuat analitik:', err);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  }, [period]);

  // Load awal dan saat filter periode berubah
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Interval auto-refresh setiap 15 detik
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAnalytics]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date().getTime();
      const past = new Date(dateStr).getTime();
      const diffSec = Math.floor((now - past) / 1000);

      if (diffSec < 15) return 'Baru saja';
      if (diffSec < 60) return `${diffSec} detik lalu`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} menit lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} jam lalu`;
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filter tabel log riwayat berdasarkan pencarian
  const filteredLogs = useMemo(() => {
    if (!data?.recentLogs) return [];
    if (!searchQuery.trim()) return data.recentLogs;

    const query = searchQuery.toLowerCase();
    return data.recentLogs.filter(
      (log) =>
        log.ipAddress.toLowerCase().includes(query) ||
        log.path.toLowerCase().includes(query) ||
        log.countryName.toLowerCase().includes(query) ||
        (log.city && log.city.toLowerCase().includes(query))
    );
  }, [data?.recentLogs, searchQuery]);

  const maxTrendValue = useMemo(() => {
    if (!data?.trend || data.trend.length === 0) return 10;
    return Math.max(...data.trend.map((t) => Math.max(t.pageviews, t.uniqueVisitors, 5)));
  }, [data?.trend]);

  const totalDeviceCount = useMemo(() => {
    if (!data?.deviceStats) return 0;
    return data.deviceStats.reduce((acc, curr) => acc + curr.count, 0);
  }, [data?.deviceStats]);

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16 space-y-6">
      {/* 1. Header Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-saluang-teal text-white flex items-center justify-center border-2 border-saluang-dark shadow-neo-sm shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
                Statistik & Pengunjung Online
              </h1>
              <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
                Pantau pengunjung live, tayangan halaman, persebaran IP, dan asal negara secara real-time
              </p>
            </div>
          </div>
        </div>

        {/* Filter Periode & Refresh Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Periode Tabs */}
          <div className="inline-flex p-1 bg-saluang-cream rounded-xl border-2 border-saluang-dark shadow-neo-sm text-xs">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                period === 'today'
                  ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                  : 'text-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                period === '7d'
                  ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                  : 'text-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                period === '30d'
                  ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                  : 'text-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                period === 'all'
                  ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                  : 'text-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Toggle Auto-Refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border-2 border-saluang-dark text-xs font-black flex items-center gap-1.5 shadow-neo-sm cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
              autoRefresh
                ? 'bg-saluang-teal text-white'
                : 'bg-white text-saluang-dark/60 hover:bg-saluang-sand'
            }`}
            title="Auto-refresh otomatis setiap 15 detik"
          >
            <span
              className={`w-2 h-2 rounded-full border border-saluang-dark ${
                autoRefresh ? 'bg-white animate-ping' : 'bg-gray-400'
              }`}
            />
            {autoRefresh ? 'Live (15s)' : 'Live Mati'}
          </button>

          {/* Tombol Manual Refresh */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white hover:bg-saluang-sand border-2 border-saluang-dark text-saluang-dark shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
            title="Segarkan data sekarang"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-saluang-coral' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Live Active Banner */}
      <div className="bg-saluang-mint/25 border-2 border-saluang-dark shadow-neo rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-5 h-5 rounded-full bg-saluang-teal animate-ping absolute opacity-75" />
            <span className="w-4 h-4 rounded-full bg-saluang-teal border-2 border-saluang-dark relative shadow-neo-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-4xl font-black text-saluang-dark">
                {data?.onlineCount ?? 0}
              </span>
              <span className="text-lg sm:text-2xl font-black text-saluang-dark">
                Pengunjung Sedang Online
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-saluang-dark/70 mt-0.5">
              Terdeteksi aktif browsing website Saluang Teknologi dalam 3 menit terakhir
            </p>
          </div>
        </div>

        <div className="bg-white px-3.5 py-2 rounded-xl border-2 border-saluang-dark font-bold text-xs text-saluang-dark shadow-neo-xs flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Clock className="w-3.5 h-3.5 text-saluang-coral shrink-0" />
          <span>Update: {lastUpdated.toLocaleTimeString('id-ID')} WIB</span>
        </div>
      </div>

      {/* 3. Grid 4 Kartu KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Online Now */}
        <GlassCard className="p-3.5 sm:p-5 border-2 border-saluang-dark shadow-neo bg-saluang-cream rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black text-saluang-teal uppercase tracking-wider">
              Online Sekarang
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-saluang-teal text-white flex items-center justify-center border-2 border-saluang-dark shadow-neo-xs shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-saluang-dark tracking-tight">
              {data?.onlineCount ?? 0}
            </span>
            <p className="text-[11px] sm:text-xs font-semibold text-saluang-dark/60 mt-0.5">Sesi aktif real-time</p>
          </div>
        </GlassCard>

        {/* KPI 2: Unique Visitors */}
        <GlassCard className="p-3.5 sm:p-5 border-2 border-saluang-dark shadow-neo bg-saluang-cream rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black text-saluang-dark/70 uppercase tracking-wider">
              Pengunjung Unik
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-saluang-yellow text-saluang-dark flex items-center justify-center border-2 border-saluang-dark shadow-neo-xs shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-saluang-dark tracking-tight">
              {data?.kpis.uniqueVisitorsPeriod ?? 0}
            </span>
            <p className="text-[11px] sm:text-xs font-semibold text-saluang-dark/60 mt-0.5">
              Hari ini:{' '}
              <span className="text-saluang-dark font-black">
                {data?.kpis.uniqueVisitorsToday ?? 0}
              </span>{' '}
              IP unik
            </p>
          </div>
        </GlassCard>

        {/* KPI 3: Total Pageviews */}
        <GlassCard className="p-3.5 sm:p-5 border-2 border-saluang-dark shadow-neo bg-saluang-cream rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black text-saluang-dark/70 uppercase tracking-wider">
              Tayangan Halaman
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-saluang-coral text-white flex items-center justify-center border-2 border-saluang-dark shadow-neo-xs shrink-0">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-3xl font-black text-saluang-dark tracking-tight">
              {data?.kpis.pageviewsPeriod ?? 0}
            </span>
            <p className="text-[11px] sm:text-xs font-semibold text-saluang-dark/60 mt-0.5">
              Hari ini:{' '}
              <span className="text-saluang-dark font-black">
                {data?.kpis.pageviewsToday ?? 0}
              </span>{' '}
              tayangan
            </p>
          </div>
        </GlassCard>

        {/* KPI 4: Top Country */}
        <GlassCard className="p-3.5 sm:p-5 border-2 border-saluang-dark shadow-neo bg-saluang-cream rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black text-saluang-dark/70 uppercase tracking-wider">
              Negara Teratas
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-saluang-mint text-saluang-dark flex items-center justify-center border-2 border-saluang-dark shadow-neo-xs shrink-0">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl shrink-0">
                {data?.topCountries?.[0]?.flag || '🇮🇩'}
              </span>
              <span className="text-lg sm:text-xl font-black text-saluang-dark truncate">
                {data?.topCountries?.[0]?.name || 'Indonesia'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-saluang-dark/60 mt-0.5">
              {data?.topCountries?.[0]
                ? `${data.topCountries[0].percentage}% dari total trafik`
                : 'Belum ada data'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* 4. Tabel Sesi Pengunjung Online Sekarang */}
      <GlassCard className="border-2 border-saluang-dark shadow-neo overflow-hidden p-0 bg-white rounded-2xl">
        <div className="bg-saluang-cream border-b-2 border-saluang-dark px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-saluang-teal animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-saluang-dark">
              Detail Pengunjung Online Saat Ini ({data?.onlineVisitors?.length || 0})
            </h2>
          </div>
          <span className="text-xs font-bold text-saluang-dark/60">
            Pembaruan otomatis tiap 15 detik
          </span>
        </div>

        {data?.onlineVisitors && data.onlineVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-saluang-sand border-b-2 border-saluang-dark text-saluang-dark font-black text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Lokasi / Negara</th>
                  <th className="py-3 px-4">Halaman yang Dibuka</th>
                  <th className="py-3 px-4">Perangkat & Browser</th>
                  <th className="py-3 px-4 text-right">Tayangan</th>
                  <th className="py-3 px-4 text-right">Aktif Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-saluang-dark/10 font-medium text-saluang-dark">
                {data.onlineVisitors.map((visitor) => (
                  <tr key={visitor.sessionId} className="hover:bg-saluang-sand/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="teal" size="sm" className="font-black gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        Online
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-saluang-dark whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{visitor.ipAddress}</span>
                        <button
                          onClick={() => copyToClipboard(visitor.ipAddress)}
                          className="p-1 rounded text-saluang-dark/50 hover:text-saluang-dark transition-colors cursor-pointer"
                          title="Salin IP"
                        >
                          {copiedIp === visitor.ipAddress ? (
                            <Check className="w-3.5 h-3.5 text-saluang-teal" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{visitor.flag}</span>
                        <div>
                          <p className="font-bold text-saluang-dark">
                            {visitor.city ? `${visitor.city}, ` : ''}
                            {visitor.countryName}
                          </p>
                          <p className="text-[10px] font-bold text-saluang-dark/50 uppercase">{visitor.countryCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-saluang-sand border border-saluang-dark/30 font-mono font-bold text-saluang-dark text-[11px] shadow-neo-xs inline-block">
                        {visitor.currentPath}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-saluang-dark font-semibold">
                        {visitor.deviceType === 'mobile' && <Smartphone className="w-4 h-4 text-saluang-coral" />}
                        {visitor.deviceType === 'tablet' && <Tablet className="w-4 h-4 text-saluang-yellow" />}
                        {visitor.deviceType === 'desktop' && <Monitor className="w-4 h-4 text-saluang-teal" />}
                        <span>
                          {visitor.browser || 'Browser'} • {visitor.os || 'OS'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-saluang-dark text-sm">
                      {visitor.pageviewCount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-saluang-dark/60 whitespace-nowrap">
                      {formatTimeAgo(visitor.lastActiveAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-saluang-cream/50">
            <Compass className="w-8 h-8 text-saluang-dark/40 mx-auto mb-2 animate-spin" style={{ animationDuration: '6s' }} />
            <p className="text-sm font-black text-saluang-dark">
              Belum ada pengunjung yang aktif saat ini
            </p>
            <p className="text-xs font-semibold text-saluang-dark/60 mt-1 max-w-md mx-auto">
              Saat ada pengunjung membuka website publik Saluang Teknologi, status online dan halamannya akan otomatis muncul di sini secara real-time.
            </p>
          </div>
        )}
      </GlassCard>

      {/* 5. Grafik Tren Kunjungan Harian */}
      <GlassCard className="border-2 border-saluang-dark shadow-neo p-4 sm:p-6 bg-white rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-saluang-dark flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-saluang-teal" />
              Tren Kunjungan Harian
            </h2>
            <p className="text-xs font-semibold text-saluang-dark/70 mt-0.5">
              Perbandingan total tayangan halaman (*pageviews*) dan pengunjung unik per hari
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-saluang-coral text-white border-2 border-saluang-dark shadow-neo-xs font-black text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              Tayangan Halaman
            </span>
            <span className="px-2.5 py-1 rounded-md bg-saluang-teal text-white border-2 border-saluang-dark shadow-neo-xs font-black text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              Pengunjung Unik
            </span>
          </div>
        </div>

        {data?.trend && data.trend.length > 0 ? (
          <div className="w-full pt-4">
            <div className="h-60 flex items-end gap-2 md:gap-4 border-b-2 border-saluang-dark pb-2">
              {data.trend.map((item, index) => {
                const pvHeight = Math.max(8, Math.round((item.pageviews / maxTrendValue) * 100));
                const uvHeight = Math.max(8, Math.round((item.uniqueVisitors / maxTrendValue) * 100));

                const formattedDate = new Date(item.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                });

                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip Hover */}
                    <div className="absolute -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-saluang-cream border-2 border-saluang-dark rounded-xl p-2.5 text-xs text-saluang-dark shadow-neo z-20 whitespace-nowrap font-bold">
                      <p className="font-black text-saluang-dark border-b border-saluang-dark/20 pb-1 mb-1">{formattedDate}</p>
                      <p className="text-saluang-coral">Tayangan: {item.pageviews}</p>
                      <p className="text-saluang-teal">Unik: {item.uniqueVisitors}</p>
                    </div>

                    {/* Bar Columns */}
                    <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${pvHeight}%` }}
                        className="w-1/2 bg-saluang-coral border-2 border-saluang-dark rounded-t-md hover:opacity-85 shadow-neo-xs transition-all"
                        title={`Tayangan: ${item.pageviews}`}
                      />
                      <div
                        style={{ height: `${uvHeight}%` }}
                        className="w-1/2 bg-saluang-teal border-2 border-saluang-dark rounded-t-md hover:opacity-85 shadow-neo-xs transition-all"
                        title={`Pengunjung Unik: ${item.uniqueVisitors}`}
                      />
                    </div>

                    <span className="text-[10px] sm:text-xs font-bold text-saluang-dark/70 mt-2 truncate max-w-full">
                      {formattedDate}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-saluang-dark/60 font-semibold text-xs">
            Belum ada data kunjungan untuk rentang waktu yang dipilih.
          </div>
        )}
      </GlassCard>

      {/* 6. Dua Kolom: Geografis (Negara/Kota) & Halaman Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Distribusi Negara & Kota */}
        <GlassCard className="border-2 border-saluang-dark shadow-neo p-4 sm:p-5 bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-saluang-dark/10">
            <h2 className="text-sm sm:text-base font-black text-saluang-dark flex items-center gap-2">
              <Globe className="w-4 h-4 text-saluang-yellow" />
              Distribusi Negara & Kota Asal
            </h2>
            <Badge variant="yellow" size="sm" className="font-bold">Top Wilayah</Badge>
          </div>

          <div className="space-y-3.5">
            {data?.topCountries && data.topCountries.length > 0 ? (
              data.topCountries.map((country) => (
                <div key={country.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-black text-saluang-dark">{country.name}</span>
                      <span className="text-[10px] font-bold text-saluang-dark/50 uppercase">({country.code})</span>
                    </div>
                    <div className="text-right font-black text-saluang-dark">
                      <span>{country.count}</span>
                      <span className="text-saluang-dark/60 ml-1">({country.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-saluang-sand border-2 border-saluang-dark rounded-full overflow-hidden p-0.5 shadow-neo-xs">
                    <div
                      style={{ width: `${Math.min(100, Math.max(5, country.percentage))}%` }}
                      className="h-full bg-saluang-teal rounded-full border-r border-saluang-dark"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-semibold text-saluang-dark/60 py-4 text-center">Belum ada data negara.</p>
            )}
          </div>

          {/* Kota Teratas */}
          {data?.topCities && data.topCities.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-saluang-dark/10">
              <span className="text-[11px] font-black text-saluang-dark/70 uppercase tracking-wider block mb-2.5">
                Kota Pengunjung Paling Aktif
              </span>
              <div className="flex flex-wrap gap-2">
                {data.topCities.map((city, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-saluang-cream border-2 border-saluang-dark text-xs font-bold text-saluang-dark shadow-neo-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-saluang-coral shrink-0" />
                    <span className="font-black">{city.city}</span>
                    <span className="text-[10px] font-bold text-saluang-dark/50">({city.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Kolom Kanan: Halaman Terpopuler & Perangkat */}
        <GlassCard className="border-2 border-saluang-dark shadow-neo p-4 sm:p-5 bg-white rounded-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-saluang-dark/10">
            <h2 className="text-sm sm:text-base font-black text-saluang-dark flex items-center gap-2">
              <FileText className="w-4 h-4 text-saluang-coral" />
              Halaman Terpopuler
            </h2>
            <Badge variant="coral" size="sm" className="font-bold">Top Views</Badge>
          </div>

          <div className="space-y-3.5">
            {data?.topPages && data.topPages.length > 0 ? (
              data.topPages.map((page, idx) => {
                const maxPageCount = data.topPages[0]?.count || 1;
                const pagePct = Math.round((page.count / maxPageCount) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-black text-saluang-dark truncate max-w-[280px]">
                        {page.path}
                      </span>
                      <span className="font-black text-saluang-dark ml-2">
                        {page.count} views
                      </span>
                    </div>
                    <div className="w-full h-3 bg-saluang-sand border-2 border-saluang-dark rounded-full overflow-hidden p-0.5 shadow-neo-xs">
                      <div
                        style={{ width: `${pagePct}%` }}
                        className="h-full bg-saluang-yellow rounded-full border-r border-saluang-dark"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs font-semibold text-saluang-dark/60 py-4 text-center">Belum ada data halaman.</p>
            )}
          </div>

          {/* Breakdown Perangkat */}
          <div className="mt-6 pt-4 border-t-2 border-saluang-dark/10">
            <span className="text-[11px] font-black text-saluang-dark/70 uppercase tracking-wider block mb-2.5">
              Jenis Perangkat Pengunjung
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['desktop', 'mobile', 'tablet'].map((type) => {
                const found = data?.deviceStats?.find((d) => d.deviceType === type);
                const count = found ? found.count : 0;
                const pct = totalDeviceCount > 0 ? Math.round((count / totalDeviceCount) * 100) : 0;

                return (
                  <div
                    key={type}
                    className="p-3 rounded-xl bg-saluang-cream border-2 border-saluang-dark text-center shadow-neo-xs"
                  >
                    <div className="flex justify-center mb-1 text-saluang-dark">
                      {type === 'desktop' && <Monitor className="w-4 h-4 text-saluang-teal" />}
                      {type === 'mobile' && <Smartphone className="w-4 h-4 text-saluang-coral" />}
                      {type === 'tablet' && <Tablet className="w-4 h-4 text-saluang-yellow" />}
                    </div>
                    <p className="text-xs capitalize font-black text-saluang-dark">{type}</p>
                    <p className="text-[11px] font-bold text-saluang-dark/60">{count} ({pct}%)</p>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 7. Riwayat Kunjungan Terkini (Recent 50 Pageviews Log) */}
      <GlassCard className="border-2 border-saluang-dark shadow-neo overflow-hidden p-0 bg-white rounded-2xl mb-6">
        <div className="bg-saluang-cream border-b-2 border-saluang-dark px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-saluang-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-saluang-teal" />
              Log Riwayat Kunjungan Pengunjung (50 Terakhir)
            </h2>
            <p className="text-xs font-semibold text-saluang-dark/70 mt-0.5">
              Daftar kunjungan dari berbagai alamat IP dan negara secara kronologis
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-saluang-dark/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari IP, lokasi, halaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-saluang-dark rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-saluang-dark placeholder-saluang-dark/40 focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 shadow-neo-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-saluang-sand border-b-2 border-saluang-dark font-black text-saluang-dark text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Lokasi / Negara</th>
                <th className="py-3 px-4">Halaman yang Dilihat</th>
                <th className="py-3 px-4">User-Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-saluang-dark/10 font-medium text-saluang-dark">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-saluang-sand/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-saluang-dark/60">
                      {formatTimeAgo(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-saluang-dark whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{log.ipAddress}</span>
                        <button
                          onClick={() => copyToClipboard(log.ipAddress)}
                          className="p-1 rounded text-saluang-dark/50 hover:text-saluang-dark transition-colors cursor-pointer"
                          title="Salin IP"
                        >
                          {copiedIp === log.ipAddress ? (
                            <Check className="w-3.5 h-3.5 text-saluang-teal" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0">{log.flag}</span>
                        <div>
                          <span className="font-bold text-saluang-dark">
                            {log.city ? `${log.city}, ` : ''}
                            {log.countryName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-saluang-sand border border-saluang-dark/30 font-mono font-bold text-saluang-dark text-[11px] shadow-neo-xs inline-block">
                        {log.path}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px] truncate text-saluang-dark/60 font-semibold text-[11px]" title={log.userAgent}>
                      {log.userAgent || 'Tidak diketahui'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-saluang-dark/60 font-semibold text-xs bg-saluang-cream/40">
                    {searchQuery ? 'Tidak ada data log yang cocok dengan pencarian.' : 'Belum ada log kunjungan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
