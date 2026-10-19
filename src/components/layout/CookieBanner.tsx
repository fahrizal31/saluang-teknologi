'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'saluang_cookie_consent';

export const CookieBanner: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      return;
    }
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [pathname]);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setIsVisible(false);
  };

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return null;
  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Persetujuan Cookie"
      className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-saluang-cream border-2 border-saluang-dark shadow-neo-lg p-5 rounded-3xl text-saluang-dark">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-2xl bg-saluang-yellow border-2 border-saluang-dark shadow-neo-sm text-saluang-dark shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-black text-saluang-dark">Privasi &amp; Penggunaan Cookie</h4>
            <p className="text-xs text-saluang-dark/80 font-medium leading-relaxed">
              Kami menggunakan cookie untuk menganalisis statistik trafik dan memastikan pengalaman navigasi yang optimal. Baca{' '}
              <Link
                href="/kebijakan-privasi"
                className="text-saluang-coral underline font-bold"
              >
                Kebijakan Privasi
              </Link>{' '}
              kami.
            </p>
          </div>
          <button
            onClick={handleDecline}
            aria-label="Tutup banner cookie"
            className="text-saluang-dark hover:text-saluang-coral p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t-2 border-saluang-dark/10">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="text-xs text-saluang-dark/80 font-bold"
          >
            Tolak
          </Button>
          <Button
            type="button"
            variant="yellow"
            size="sm"
            onClick={handleAccept}
            className="text-xs py-1.5 px-4 font-black"
          >
            Setujui
          </Button>
        </div>
      </div>
    </div>
  );
};
