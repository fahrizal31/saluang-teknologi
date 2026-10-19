'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navItems, companyData } from '@/data/company';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronDown, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Close services dropdown on page navigation
  useEffect(() => {
    setServicesDropdownOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-saluang-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* Logo Brand Resmi Saluang Teknologi */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-yellow rounded-xl p-1 transition-transform hover:scale-[1.02]"
            aria-label="Saluang Teknologi Beranda"
          >
            <Image
              src="/images/saluang-logo-white-text.png"
              alt="Saluang Teknologi"
              width={180}
              height={75}
              className="h-8 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Navigasi Utama">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                      aria-expanded={servicesDropdownOpen}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-yellow',
                        isActiveLink(item.href)
                          ? 'text-saluang-yellow bg-white/10'
                          : 'text-slate-200 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          servicesDropdownOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Services Dropdown */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 pt-2 w-80 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="p-2.5 rounded-2xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-md text-saluang-dark space-y-1">
                          <Link
                            href="/layanan"
                            className="block p-2.5 rounded-xl hover:bg-saluang-yellow/20 text-xs font-black text-saluang-dark border-b border-saluang-dark/10 transition-colors"
                          >
                            Semua Layanan →
                          </Link>
                          {item.children.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block p-2.5 rounded-xl hover:bg-saluang-pink transition-colors group/item"
                            >
                              <div className="text-sm font-bold text-saluang-dark group-hover/item:text-saluang-coral flex items-center justify-between">
                                <span>{sub.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-saluang-coral" />
                              </div>
                              <p className="text-xs text-saluang-dark/70 line-clamp-1 mt-0.5 font-medium">
                                {sub.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-bold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-yellow',
                    isActiveLink(item.href)
                      ? 'text-saluang-yellow bg-white/10'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA: "Minta Penawaran" */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href="/kontak"
              variant="coral"
              size="sm"
              className="bg-saluang-coral text-white font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Minta Penawaran
            </Button>
          </div>

          {/* Mobile Right CTA Button (Navigasi utama berada di Bottom Navigation Bar) */}
          <div className="flex md:hidden items-center">
            <Button
              href="/kontak"
              variant="coral"
              size="sm"
              className="bg-saluang-coral text-white font-black text-xs px-3.5 py-1.5 shadow-neo-sm hover:shadow-neo transition-all rounded-xl"
            >
              Minta Penawaran
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
