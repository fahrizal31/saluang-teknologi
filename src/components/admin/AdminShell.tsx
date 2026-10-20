'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { AdminIdleTimeout } from './AdminIdleTimeout';
import {
  Inbox,
  Briefcase,
  FolderGit2,
  Users,
  Settings,
  Phone,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutGrid,
  Activity,
} from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
  adminUser: {
    name: string;
    email: string;
  };
  sessionLastActiveAt?: number;
}

interface NavItem {
  label: string;
  shortLabel?: string;
  href: string;
  icon: React.ElementType;
}

const STORAGE_COLLAPSED_KEY = 'saluang_admin_sidebar_collapsed';

export function AdminShell({ children, adminUser, sessionLastActiveAt }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab');

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // Baca preferensi collapsed sidebar dari localStorage pada mount klien
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLAPSED_KEY);
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    } catch {}
  }, []);

  // Tutup drawer mobile saat terjadi perubahan rute
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Shortcut keyboard Ctrl+B / Cmd+B untuk toggle sidebar (seperti IDE & modern dashboard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebarCollapse = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_COLLAPSED_KEY, String(next));
      } catch (err) {
        console.warn('Could not save sidebar preference', err);
      }
      return next;
    });
  };

  const navItems: NavItem[] = [
    {
      label: 'Permintaan Proyek',
      shortLabel: 'Leads',
      href: '/admin/leads',
      icon: Inbox,
    },
    {
      label: 'Statistik Pengunjung',
      shortLabel: 'Statistik',
      href: '/admin/analytics',
      icon: Activity,
    },
    {
      label: 'Katalog Layanan',
      shortLabel: 'Layanan',
      href: '/admin/layanan',
      icon: Briefcase,
    },
    {
      label: 'Portofolio Proyek',
      shortLabel: 'Portofolio',
      href: '/admin/portofolio',
      icon: FolderGit2,
    },
    {
      label: 'Anggota Tim',
      shortLabel: 'Tim',
      href: '/admin/tim',
      icon: Users,
    },
    {
      label: 'Kontak & WhatsApp',
      shortLabel: 'Kontak',
      href: '/admin/pengaturan?tab=contact',
      icon: Phone,
    },
    {
      label: 'Pengaturan Perusahaan',
      shortLabel: 'Pengaturan',
      href: '/admin/pengaturan',
      icon: Settings,
    },
    {
      label: 'Kelola Administrator',
      shortLabel: 'Admin',
      href: '/admin/users',
      icon: ShieldCheck,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin/leads') {
      return pathname === '/admin/leads' || pathname === '/admin';
    }
    if (href === '/admin/pengaturan?tab=contact') {
      return pathname === '/admin/pengaturan' && currentTab === 'contact';
    }
    if (href === '/admin/pengaturan') {
      return pathname === '/admin/pengaturan' && currentTab !== 'contact';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden bg-saluang-sand text-saluang-dark flex flex-col md:flex-row">
      {/* Deteksi Otomatis: Logout jika tidak ada aktivitas selama 1 jam */}
      <AdminIdleTimeout sessionLastActiveAt={sessionLastActiveAt} />

      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR (Bisa Diperkecil / Collapsible, Tetap Diam) */}
      {/* ============================================================ */}
      <aside
        style={{
          width: isCollapsed ? '80px' : undefined,
          minWidth: isCollapsed ? '80px' : undefined,
          maxWidth: isCollapsed ? '80px' : undefined,
        }}
        className={`hidden md:flex flex-col bg-saluang-cream border-r-2 border-saluang-dark h-full shrink-0 z-30 select-none overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed
            ? 'w-20 min-w-[5rem] max-w-[5rem]'
            : 'w-64 lg:w-72 min-w-[16rem] lg:min-w-[18rem]'
        }`}
      >
        {/* Top Header / Branding & Collapse Button */}
        {isCollapsed ? (
          <div className="p-3 border-b-2 border-saluang-dark flex flex-col items-center justify-center gap-2.5 shrink-0">
            <Link
              href="/admin/leads"
              className="w-10 h-10 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-sm border-2 border-saluang-dark shadow-neo-sm hover:scale-105 transition-transform"
              title="Saluang Teknologi - Panel Admin"
            >
              ST
            </Link>
            <button
              id="admin-sidebar-expand-top-btn"
              type="button"
              onClick={(e) => toggleSidebarCollapse(e)}
              className="w-8 h-8 rounded-xl border-2 border-saluang-dark bg-saluang-sand hover:bg-saluang-teal hover:text-white text-saluang-dark flex items-center justify-center transition-all shadow-neo-xs cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              title="Buka Sidebar (Ctrl+B)"
              aria-label="Buka Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 lg:p-5 border-b-2 border-saluang-dark flex items-center justify-between gap-2 shrink-0">
            <Link href="/admin/leads" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-xs border-2 border-saluang-dark shadow-neo-xs shrink-0 group-hover:scale-105 transition-transform">
                ST
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="font-black text-base tracking-tight text-saluang-dark truncate leading-tight">
                  Saluang<span className="text-saluang-teal">.</span>Teknologi
                </span>
                <span className="text-[10px] font-bold text-saluang-dark/60 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-saluang-teal shrink-0" />
                  <span className="truncate">Panel Admin</span>
                </span>
              </div>
            </Link>
            <button
              id="admin-sidebar-collapse-top-btn"
              type="button"
              onClick={(e) => toggleSidebarCollapse(e)}
              className="w-8 h-8 rounded-xl border-2 border-saluang-dark bg-saluang-sand/80 hover:bg-saluang-teal hover:text-white text-saluang-dark flex items-center justify-center transition-all shadow-neo-xs shrink-0 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              title="Ciutkan Sidebar (Ctrl+B)"
              aria-label="Ciutkan Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Database Status */}
        <div
          className={`border-b-2 border-saluang-dark bg-saluang-sand/40 shrink-0 ${
            isCollapsed
              ? 'p-2.5 flex items-center justify-center'
              : 'px-4 lg:px-5 py-2.5 flex items-center justify-between text-xs font-semibold'
          }`}
          title="Status Koneksi: TiDB Cloud Live (MySQL)"
        >
          {isCollapsed ? (
            <div className="relative flex items-center justify-center p-1 rounded-lg hover:bg-saluang-sand transition-colors">
              <Database className="w-4 h-4 text-saluang-teal" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-saluang-teal animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-saluang-dark/80">
                <Database className="w-3.5 h-3.5 text-saluang-teal shrink-0" />
                <span className="text-xs font-bold truncate">TiDB Cloud</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-saluang-teal bg-saluang-teal/10 px-2 py-0.5 rounded-full border border-saluang-teal/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-saluang-teal animate-pulse" />
                Live
              </span>
            </>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav
          className={`flex-1 overflow-y-auto space-y-1.5 ${
            isCollapsed ? 'px-2 py-4' : 'px-3 lg:px-4 py-4'
          }`}
        >
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-saluang-dark/50 mb-2">
              Menu Manajemen
            </p>
          )}

          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            if (isCollapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`group relative flex items-center justify-center w-full h-11 rounded-xl border-2 transition-all ${
                    active
                      ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-sm scale-105'
                      : 'bg-saluang-cream text-saluang-dark border-transparent hover:border-saluang-dark hover:bg-saluang-sand/80'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active ? 'text-saluang-teal' : 'text-saluang-dark/75 group-hover:text-saluang-dark'
                    }`}
                  />
                  {active && (
                    <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-saluang-teal" />
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-bold border-2 transition-all ${
                  active
                    ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-sm translate-x-1'
                    : 'bg-saluang-cream text-saluang-dark border-transparent hover:border-saluang-dark hover:bg-saluang-sand/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active ? 'text-saluang-teal' : 'text-saluang-dark/70 group-hover:text-saluang-dark'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 text-saluang-teal shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Bottom Action */}
        <div
          className={`border-t-2 border-saluang-dark bg-saluang-cream/95 shrink-0 ${
            isCollapsed ? 'p-2.5 flex flex-col items-center gap-2' : 'p-3.5 lg:p-4 space-y-2.5'
          }`}
        >
          {isCollapsed ? (
            <>
              {/* External Link */}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Lihat Website Publik"
                className="w-10 h-10 rounded-xl border-2 border-saluang-dark/30 hover:border-saluang-dark bg-saluang-sand/60 hover:bg-saluang-sand flex items-center justify-center text-saluang-dark transition-colors shadow-neo-xs"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>

              {/* Admin Avatar */}
              <div
                className="w-10 h-10 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-sm border-2 border-saluang-dark shadow-neo-xs cursor-default"
                title={`${adminUser.name} (${adminUser.email})`}
              >
                {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Keluar dari Panel Admin"
                className="w-10 h-10 rounded-xl bg-saluang-coral text-white border-2 border-saluang-dark shadow-neo-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {/* External Link to Public Website */}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-1.5 rounded-xl text-xs font-bold text-saluang-dark/80 hover:text-saluang-dark hover:bg-saluang-sand border border-saluang-dark/25 transition-all"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Lihat Website Publik</span>
                </div>
                <span className="text-[10px] text-saluang-dark/50 font-mono">↗</span>
              </Link>

              {/* Admin Profile Card */}
              <div className="p-2.5 bg-saluang-sand rounded-xl border-2 border-saluang-dark shadow-neo-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-xs border border-saluang-dark shrink-0">
                    {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-saluang-dark truncate leading-tight">
                      {adminUser.name}
                    </p>
                    <p className="text-[10px] text-saluang-dark/70 truncate font-mono mt-0.5">
                      {adminUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-saluang-cream bg-saluang-coral border-2 border-saluang-dark shadow-neo-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? 'Mengeluarkan...' : 'Keluar'}</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE TOP HEADER (Mobile-First sticky bar) */}
      {/* ============================================================ */}
      <header className="md:hidden bg-saluang-cream border-b-2 border-saluang-dark sticky top-0 z-40 px-3.5 py-2.5 flex items-center justify-between shadow-neo-xs shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-xl border-2 border-saluang-dark bg-saluang-sand hover:bg-saluang-cream shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Buka Menu Admin"
          >
            <Menu className="w-5 h-5 text-saluang-dark" />
          </button>

          <Link href="/admin/leads" className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-xs border border-saluang-dark">
              ST
            </span>
            <span className="font-black text-base tracking-tight text-saluang-dark">
              Saluang<span className="text-saluang-teal">.</span>Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Live */}
          <span className="inline-flex items-center gap-1 text-[10px] font-black text-saluang-teal bg-saluang-teal/10 px-2 py-0.5 rounded-full border border-saluang-teal/30">
            <span className="w-1.5 h-1.5 rounded-full bg-saluang-teal animate-pulse" />
            Live
          </span>

          {/* User Avatar Circle */}
          <div
            onClick={() => setMobileDrawerOpen(true)}
            className="w-8 h-8 rounded-lg bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-xs border border-saluang-dark cursor-pointer shadow-neo-xs"
            title={adminUser.name}
          >
            {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 3. MOBILE SLIDE-OVER DRAWER (Layar Sentuh Penuh, Modern) */}
      {/* ============================================================ */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-saluang-dark/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu Navigasi Administrator"
            className="relative w-72 max-w-[85vw] bg-saluang-cream border-r-2 border-saluang-dark flex flex-col h-full z-10 shadow-neo-xl animate-in slide-in-from-left duration-300"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b-2 border-saluang-dark flex items-center justify-between bg-saluang-sand/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-xs border border-saluang-dark">
                  ST
                </div>
                <div>
                  <h3 className="font-black text-sm text-saluang-dark leading-tight">
                    Saluang<span className="text-saluang-teal">.</span>Admin
                  </h3>
                  <p className="text-[10px] font-bold text-saluang-dark/60">Portal Manajemen</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl border-2 border-saluang-dark bg-saluang-cream hover:bg-saluang-coral hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Card on Mobile */}
            <div className="p-3 border-b-2 border-saluang-dark bg-saluang-sand/30 shrink-0">
              <div className="p-2.5 bg-saluang-cream rounded-xl border-2 border-saluang-dark shadow-neo-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-black text-sm shrink-0 border border-saluang-dark">
                  {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-saluang-dark truncate">{adminUser.name}</p>
                  <p className="text-[10px] text-saluang-dark/60 font-mono truncate">{adminUser.email}</p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              <p className="px-2 text-[10px] font-black uppercase tracking-wider text-saluang-dark/50 mb-1.5">
                Navigasi Menu
              </p>

              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold border-2 transition-all active:scale-[0.98] ${
                      active
                        ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-xs translate-x-1'
                        : 'bg-saluang-cream text-saluang-dark border-transparent hover:border-saluang-dark hover:bg-saluang-sand'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? 'text-saluang-teal' : 'text-saluang-dark/70'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight className="w-3.5 h-3.5 text-saluang-teal" />}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="p-3 border-t-2 border-saluang-dark bg-saluang-cream space-y-2 shrink-0">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-saluang-dark hover:bg-saluang-sand border-2 border-saluang-dark/20 transition-all"
              >
                <span>Lihat Website Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-saluang-coral border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? 'Mengeluarkan...' : 'Keluar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. MAIN CONTENT AREA (Scroll Independen, Anti-Overflow) */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* ============================================================ */}
      {/* 5. MOBILE BOTTOM ACTION BAR (Mobile-First Quick Access) */}
      {/* ============================================================ */}
      <nav
        aria-label="Navigasi Cepat Admin Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-saluang-cream/95 backdrop-blur-md border-t-2 border-saluang-dark shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)]"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {/* Tab 1: Leads */}
          <Link
            href="/admin/leads"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-black transition-all ${
              pathname === '/admin/leads' || pathname === '/admin'
                ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                : 'text-saluang-dark/70 hover:text-saluang-dark hover:bg-saluang-sand/60'
            }`}
          >
            <Inbox className="w-4 h-4 mb-0.5" />
            <span className="truncate">Leads</span>
          </Link>

          {/* Tab 2: Layanan */}
          <Link
            href="/admin/layanan"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-black transition-all ${
              pathname.startsWith('/admin/layanan')
                ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                : 'text-saluang-dark/70 hover:text-saluang-dark hover:bg-saluang-sand/60'
            }`}
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span className="truncate">Layanan</span>
          </Link>

          {/* Tab 3: Portofolio */}
          <Link
            href="/admin/portofolio"
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-black transition-all ${
              pathname.startsWith('/admin/portofolio')
                ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs'
                : 'text-saluang-dark/70 hover:text-saluang-dark hover:bg-saluang-sand/60'
            }`}
          >
            <FolderGit2 className="w-4 h-4 mb-0.5" />
            <span className="truncate">Porto</span>
          </Link>

          {/* Tab 4: Drawer Trigger (Menu Lengkap) */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[10px] font-black text-saluang-dark/70 hover:text-saluang-dark hover:bg-saluang-sand/60 transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 mb-0.5 text-saluang-coral" />
            <span className="truncate">Lainnya</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
