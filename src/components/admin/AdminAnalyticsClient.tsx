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
  ArrowUpRight,
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
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-saluang-surface/40 p-4 md:p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-saluang-primary/20 border border-saluang-primary/30 flex items-center justify-center text-saluang-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Statistik & Pengunjung Online
              </h1>
              <p className="text-xs md:text-sm text-gray-400">
                Pantau pengunjung live, tayangan halaman, persebaran IP, dan asal negara secara real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Periode & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Periode Tabs */}
          <div className="inline-flex p-1 bg-saluang-dark/60 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                period === 'today'
                  ? 'bg-saluang-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                period === '7d'
                  ? 'bg-saluang-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                period === '30d'
                  ? 'bg-saluang-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                period === 'all'
                  ? 'bg-saluang-primary text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Semua
            </button>
          </div>

          {/* Toggle Auto-Refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-300'
            }`}
            title="Auto-refresh otomatis setiap 15 detik"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'
              }`}
            />
            {autoRefresh ? 'Live (15s)' : 'Live Mati'}
          </button>

          {/* Tombol Manual Refresh */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all disabled:opacity-50"
            title="Segarkan data sekarang"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-saluang-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Live Active Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-saluang-surface/80 to-saluang-surface/40 p-5 md:p-6 shadow-lg shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="w-4 h-4 rounded-full bg-emerald-400 relative border-2 border-saluang-dark shadow-md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-extrabold text-white">
                  {data?.onlineCount ?? 0}
                </span>
                <span className="text-lg md:text-xl font-semibold text-emerald-400">
                  Pengunjung Sedang Online
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Terdeteksi aktif browsing website Saluang Teknologi dalam 3 menit terakhir.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 bg-saluang-dark/60 px-4 py-2.5 rounded-xl border border-white/5">
            <Clock className="w-3.5 h-3.5 text-saluang-primary" />
            <span>Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')} WIB</span>
          </div>
        </div>
      </div>

      {/* 3. Grid 4 Kartu KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Online Now */}
        <GlassCard className="p-5 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
              Online Sekarang
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {data?.onlineCount ?? 0}
            </span>
            <p className="text-xs text-gray-400 mt-1">Sesi aktif real-time</p>
          </div>
        </GlassCard>

        {/* KPI 2: Unique Visitors */}
        <GlassCard className="p-5 border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
              Pengunjung Unik
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {data?.kpis.uniqueVisitorsPeriod ?? 0}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Hari ini:{' '}
              <span className="text-blue-400 font-semibold">
                {data?.kpis.uniqueVisitorsToday ?? 0}
              </span>{' '}
              IP unik
            </p>
          </div>
        </GlassCard>

        {/* KPI 3: Total Pageviews */}
        <GlassCard className="p-5 border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
              Tayangan Halaman
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {data?.kpis.pageviewsPeriod ?? 0}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Hari ini:{' '}
              <span className="text-purple-400 font-semibold">
                {data?.kpis.pageviewsToday ?? 0}
              </span>{' '}
              tayangan
            </p>
          </div>
        </GlassCard>

        {/* KPI 4: Top Country */}
        <GlassCard className="p-5 border-amber-500/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Negara Teratas
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {data?.topCountries?.[0]?.flag || '🇮🇩'}
              </span>
              <span className="text-xl font-bold text-white truncate">
                {data?.topCountries?.[0]?.name || 'Indonesia'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {data?.topCountries?.[0]
                ? `${data.topCountries[0].percentage}% dari total trafik`
                : 'Belum ada data'}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* 4. Tabel Sesi Pengunjung Online Sekarang */}
      <GlassCard className="p-5 border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Detail Pengunjung Online Saat Ini ({data?.onlineVisitors?.length || 0})
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            Pembaruan otomatis tiap 15 detik
          </span>
        </div>

        {data?.onlineVisitors && data.onlineVisitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-saluang-dark/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Lokasi / Negara</th>
                  <th className="py-2.5 px-3">Halaman yang Dibuka</th>
                  <th className="py-2.5 px-3">Perangkat & Browser</th>
                  <th className="py-2.5 px-3 text-right">Tayangan</th>
                  <th className="py-2.5 px-3 text-right">Aktif Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {data.onlineVisitors.map((visitor) => (
                  <tr key={visitor.sessionId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Online
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-white flex items-center gap-1.5">
                      <span>{visitor.ipAddress}</span>
                      <button
                        onClick={() => copyToClipboard(visitor.ipAddress)}
                        className="text-gray-500 hover:text-gray-300 transition-colors"
                        title="Salin IP"
                      >
                        {copiedIp === visitor.ipAddress ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{visitor.flag}</span>
                        <div>
                          <p className="text-white font-medium">
                            {visitor.city ? `${visitor.city}, ` : ''}
                            {visitor.countryName}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase">{visitor.countryCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 rounded-md bg-white/5 text-saluang-primary font-mono text-[11px] border border-white/5">
                        {visitor.currentPath}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        {visitor.deviceType === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-blue-400" />}
                        {visitor.deviceType === 'tablet' && <Tablet className="w-3.5 h-3.5 text-purple-400" />}
                        {visitor.deviceType === 'desktop' && <Monitor className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>
                          {visitor.browser || 'Browser'} • {visitor.os || 'OS'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-white">
                      {visitor.pageviewCount}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-400">
                      {formatTimeAgo(visitor.lastActiveAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 px-4 bg-saluang-dark/40 rounded-xl border border-white/5">
            <Compass className="w-8 h-8 text-gray-500 mx-auto mb-2 animate-spin" style={{ animationDuration: '6s' }} />
            <p className="text-sm font-medium text-gray-300">
              Belum ada pengunjung yang aktif saat ini
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Saat ada pengunjung membuka website publik Saluang Teknologi, status online dan halamannya akan otomatis muncul di sini secara real-time.
            </p>
          </div>
        )}
      </GlassCard>

      {/* 5. Grafik Tren Kunjungan Harian */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-saluang-primary" />
              Tren Kunjungan Harian
            </h2>
            <p className="text-xs text-gray-400">
              Perbandingan total tayangan halaman (*pageviews*) dan pengunjung unik per hari.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-purple-500" />
              <span className="text-gray-300">Tayangan Halaman</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-gray-300">Pengunjung Unik</span>
            </div>
          </div>
        </div>

        {data?.trend && data.trend.length > 0 ? (
          <div className="w-full pt-4">
            <div className="h-56 flex items-end gap-2 md:gap-4 border-b border-white/10 pb-2">
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
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-saluang-dark/95 border border-white/10 rounded-lg p-2 text-[10px] text-white shadow-xl z-20 whitespace-nowrap">
                      <p className="font-semibold text-gray-300">{formattedDate}</p>
                      <p className="text-purple-400">Tayangan: {item.pageviews}</p>
                      <p className="text-blue-400">Unik: {item.uniqueVisitors}</p>
                    </div>

                    {/* Bar Columns */}
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${pvHeight}%` }}
                        className="w-1/2 bg-purple-500/80 hover:bg-purple-400 rounded-t-sm transition-all"
                        title={`Tayangan: ${item.pageviews}`}
                      />
                      <div
                        style={{ height: `${uvHeight}%` }}
                        className="w-1/2 bg-blue-500/80 hover:bg-blue-400 rounded-t-sm transition-all"
                        title={`Pengunjung Unik: ${item.uniqueVisitors}`}
                      />
                    </div>

                    <span className="text-[10px] text-gray-500 mt-2 truncate max-w-full">
                      {formattedDate}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 text-xs">
            Belum ada data kunjungan untuk rentang waktu yang dipilih.
          </div>
        )}
      </GlassCard>

      {/* 6. Dua Kolom: Geografis (Negara/Kota) & Halaman Terpopuler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Distribusi Negara & Kota */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Distribusi Negara & Kota Asal
            </h2>
            <span className="text-xs text-gray-400">Top Wilayah</span>
          </div>

          <div className="space-y-3">
            {data?.topCountries && data.topCountries.length > 0 ? (
              data.topCountries.map((country) => (
                <div key={country.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium text-white">{country.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase">({country.code})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-white">{country.count}</span>
                      <span className="text-gray-500 ml-1">({country.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(5, country.percentage))}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-saluang-primary rounded-full"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">Belum ada data negara.</p>
            )}
          </div>

          {/* Kota Teratas */}
          {data?.topCities && data.topCities.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
                Kota Pengunjung Paling Aktif
              </span>
              <div className="flex flex-wrap gap-2">
                {data.topCities.map((city, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300"
                  >
                    <MapPin className="w-3 h-3 text-saluang-primary" />
                    <span className="font-medium text-white">{city.city}</span>
                    <span className="text-[10px] text-gray-500">({city.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Kolom Kanan: Halaman Terpopuler & Perangkat */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Halaman Terpopuler
            </h2>
            <span className="text-xs text-gray-400">Paling Sering Dilihat</span>
          </div>

          <div className="space-y-3">
            {data?.topPages && data.topPages.length > 0 ? (
              data.topPages.map((page, idx) => {
                const maxPageCount = data.topPages[0]?.count || 1;
                const pagePct = Math.round((page.count / maxPageCount) * 100);

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-gray-300 truncate max-w-[280px]">
                        {page.path}
                      </span>
                      <span className="font-semibold text-white ml-2">
                        {page.count} views
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pagePct}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-500 py-4 text-center">Belum ada data halaman.</p>
            )}
          </div>

          {/* Breakdown Perangkat */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">
              Jenis Perangkat
            </span>
            <div className="grid grid-cols-3 gap-2">
              {['desktop', 'mobile', 'tablet'].map((type) => {
                const found = data?.deviceStats?.find((d) => d.deviceType === type);
                const count = found ? found.count : 0;
                const pct = totalDeviceCount > 0 ? Math.round((count / totalDeviceCount) * 100) : 0;

                return (
                  <div
                    key={type}
                    className="p-3 rounded-xl bg-saluang-dark/60 border border-white/5 text-center"
                  >
                    <div className="flex justify-center mb-1 text-saluang-primary">
                      {type === 'desktop' && <Monitor className="w-4 h-4" />}
                      {type === 'mobile' && <Smartphone className="w-4 h-4" />}
                      {type === 'tablet' && <Tablet className="w-4 h-4" />}
                    </div>
                    <p className="text-xs capitalize font-medium text-white">{type}</p>
                    <p className="text-[11px] text-gray-400">{count} ({pct}%)</p>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 7. Riwayat Kunjungan Terkini (Recent 50 Pageviews Log) */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Log Riwayat Kunjungan Pengunjung (50 Terakhir)
            </h2>
            <p className="text-xs text-gray-400">
              Daftar kunjungan dari berbagai alamat IP dan negara secara kronologis.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari IP, lokasi, halaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-saluang-dark/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-saluang-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-saluang-dark/60 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5">
              <tr>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Lokasi / Negara</th>
                <th className="py-2.5 px-3">Halaman yang Dilihat</th>
                <th className="py-2.5 px-3">User-Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-gray-400">
                      {formatTimeAgo(log.createdAt)}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{log.ipAddress}</span>
                        <button
                          onClick={() => copyToClipboard(log.ipAddress)}
                          className="text-gray-500 hover:text-gray-300 transition-colors"
                          title="Salin IP"
                        >
                          {copiedIp === log.ipAddress ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{log.flag}</span>
                        <div>
                          <span className="text-white font-medium">
                            {log.city ? `${log.city}, ` : ''}
                            {log.countryName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-saluang-primary font-mono text-[11px] border border-white/5">
                        {log.path}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-[220px] truncate text-gray-500 text-[11px]" title={log.userAgent}>
                      {log.userAgent || 'Tidak diketahui'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
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
