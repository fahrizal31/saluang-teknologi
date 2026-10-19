'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  Briefcase,
  Users,
  MessageSquare,
  Globe,
  Database,
  Smartphone,
  Cpu,
  ArrowRight,
  X,
  ChevronUp,
} from 'lucide-react';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  hasDropUp?: boolean;
}

const navTabs: BottomNavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Layanan', href: '/layanan', icon: Layers, hasDropUp: true },
  { label: 'Portofolio', href: '/portofolio', icon: Briefcase },
  { label: 'Tentang', href: '/tentang', icon: Users },
  { label: 'Kontak', href: '/kontak', icon: MessageSquare },
];

const servicesSubMenu = [
  {
    label: 'Website Profesional',
    href: '/layanan/website',
    desc: 'Landing page modern & portal web cepat',
    icon: Globe,
    badgeBg: 'bg-saluang-pink text-saluang-dark',
  },
  {
    label: 'Sistem Informasi',
    href: '/layanan/sistem-informasi',
    desc: 'Manajemen operasional & otomasi data',
    icon: Database,
    badgeBg: 'bg-saluang-mint text-saluang-dark',
  },
  {
    label: 'Aplikasi Android',
    href: '/layanan/aplikasi-android',
    desc: 'Aplikasi mobile gesit untuk smartphone',
    icon: Smartphone,
    badgeBg: 'bg-[#FDE178] text-saluang-dark',
  },
  {
    label: 'Software Lainnya',
    href: '/layanan/software-lainnya',
    desc: 'Integrasi API & sistem arsitektur kustom',
    icon: Cpu,
    badgeBg: 'bg-[#FFD1C9] text-saluang-dark',
  },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const [servicesDropUpOpen, setServicesDropUpOpen] = useState(false);

  // Close drop-up on navigation
  useEffect(() => {
    setServicesDropUpOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay when drop-up is open */}
      {servicesDropUpOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup menu layanan"
          className="fixed inset-0 bg-saluang-dark/65 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setServicesDropUpOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') setServicesDropUpOpen(false);
          }}
        />
      )}

      {/* Drop-Up Menu Sheet */}
      {servicesDropUpOpen && (
        <div
          role="dialog"
          aria-label="Pilihan Sub-Menu Layanan"
          className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+4.25rem)] left-3 right-3 sm:left-auto sm:right-auto sm:max-w-sm sm:w-full z-50 md:hidden bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-xl p-4 animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 text-saluang-dark"
        >
          {/* Header with Title and Close button */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-saluang-dark/15 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-saluang-yellow border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center">
                <Layers className="w-4 h-4 text-saluang-dark" />
              </div>
              <div>
                <span className="text-xs font-black text-saluang-dark block leading-none">
                  Pilihan Layanan Rekayasa
                </span>
                <span className="text-[10px] text-saluang-dark/70 font-semibold">
                  Pilih spesifikasi kebutuhan Anda
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setServicesDropUpOpen(false)}
              className="p-1.5 rounded-xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm text-saluang-dark hover:bg-saluang-coral hover:text-white transition-colors cursor-pointer"
              aria-label="Tutup menu layanan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-menu items list */}
          <div className="space-y-2">
            {servicesSubMenu.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = pathname === sub.href;

              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setServicesDropUpOpen(false)}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                    isSubActive
                      ? 'bg-saluang-yellow/30 border-saluang-coral shadow-neo-sm'
                      : 'bg-saluang-sand/70 hover:bg-saluang-sand border-saluang-dark/20 hover:border-saluang-dark'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center shrink-0 ${sub.badgeBg}`}
                  >
                    <SubIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-saluang-dark truncate">
                        {sub.label}
                      </span>
                      {isSubActive && (
                        <span className="text-[9px] font-black text-saluang-coral bg-saluang-coral/10 px-1.5 py-0.5 rounded border border-saluang-coral/30 shrink-0">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-saluang-dark/75 font-medium truncate">
                      {sub.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-saluang-dark/50 shrink-0" />
                </Link>
              );
            })}
          </div>

          {/* Overview link at bottom */}
          <div className="pt-3 mt-3 border-t-2 border-saluang-dark/10 text-center">
            <Link
              href="/layanan"
              onClick={() => setServicesDropUpOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-saluang-dark hover:text-saluang-coral transition-colors py-2 px-3 w-full rounded-2xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-sm hover:shadow-neo"
            >
              <span>Ikhtisar 4 Pilar Layanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav
        aria-label="Navigasi Seluler Bawah"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-saluang-dark/95 backdrop-blur-md border-t-2 border-saluang-dark shadow-[0_-4px_20px_rgba(0,0,0,0.25)] transition-transform duration-300 pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)] pt-1.5 px-2"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            const isLayananTab = tab.hasDropUp;

            if (isLayananTab) {
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => setServicesDropUpOpen(!servicesDropUpOpen)}
                  aria-expanded={servicesDropUpOpen}
                  aria-haspopup="dialog"
                  className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-yellow cursor-pointer ${
                    active || servicesDropUpOpen
                      ? 'text-saluang-yellow'
                      : 'text-slate-300 hover:text-white active:scale-95'
                  }`}
                >
                  {/* Icon Container with subtle active pill */}
                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-colors ${
                      active || servicesDropUpOpen
                        ? 'bg-saluang-yellow/15 border border-saluang-yellow/30'
                        : ''
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                    {/* Small upward indicator arrow showing it opens drop-up */}
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-saluang-coral border border-saluang-dark flex items-center justify-center text-[8px] text-white font-bold">
                      <ChevronUp className={`w-2.5 h-2.5 transition-transform ${servicesDropUpOpen ? 'rotate-180' : ''}`} />
                    </span>
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] mt-0.5 tracking-tight font-bold ${
                      active || servicesDropUpOpen ? 'font-black text-saluang-yellow' : 'text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-yellow ${
                  active
                    ? 'text-saluang-yellow'
                    : 'text-slate-300 hover:text-white active:scale-95'
                }`}
              >
                {/* Icon Container with subtle active pill */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-colors ${
                    active
                      ? 'bg-saluang-yellow/15 border border-saluang-yellow/30'
                      : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-saluang-coral animate-pulse" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] mt-0.5 tracking-tight font-bold ${
                    active ? 'font-black text-saluang-yellow' : 'text-slate-300'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
