'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { companyData } from '@/data/company';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const defaultMessage = encodeURIComponent(
    'Halo Saluang Teknologi, saya ingin berkonsultasi mengenai kebutuhan proyek website / perangkat lunak.'
  );

  const phone = whatsappNumber || companyData.phoneWhatsapp;
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end flex-col gap-2 group">
      {/* Tooltip Mini Popover on hover */}
      {showTooltip && (
        <div className="hidden sm:block bg-saluang-cream text-saluang-dark text-xs font-bold py-2 px-3.5 rounded-xl border-2 border-saluang-dark shadow-neo-sm max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-saluang-coral font-black">Konsultasi WhatsApp</p>
          <p className="text-saluang-dark/80 text-[11px] mt-0.5 font-medium">
            Tanya langsung ke tim perekayasa kami.
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Saluang Teknologi via WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-saluang-dark shadow-neo hover:shadow-neo-md transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-saluang-yellow"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
      </a>
    </div>
  );
};
