'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { BottomNav } from '@/components/layout/BottomNav';
import { CookieBanner } from '@/components/layout/CookieBanner';
import type { CompanyInfo } from '@/types/company';

interface PublicLayoutProps {
  children: React.ReactNode;
  companyInfo: CompanyInfo;
}

/**
 * Wrapper layout kondisional:
 * - Pada rute admin (/admin/*) dan login (/login), Navbar publik, Footer publik,
 *   Floating WhatsApp, BottomNav, dan CookieBanner TIDAK dirender sama sekali.
 * - Pada halaman publik, seluruh elemen tata letak publik dirender lengkap.
 */
export function PublicLayout({ children, companyInfo }: PublicLayoutProps) {
  const pathname = usePathname();
  const isAdminOrLogin = Boolean(pathname?.startsWith('/admin') || pathname?.startsWith('/login'));

  if (isAdminOrLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden pb-16 md:pb-0">{children}</main>
      <Footer companyData={companyInfo} />
      <FloatingWhatsApp whatsappNumber={companyInfo.phoneWhatsapp} />
      <BottomNav />
      <CookieBanner />
    </div>
  );
}
