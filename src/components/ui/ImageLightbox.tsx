'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, ZoomIn } from 'lucide-react';

export interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  showExternalLink?: boolean;
}

export function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
  title,
  subtitle,
  showExternalLink = false,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup dengan tombol Escape & cegah scroll body saat popup aktif
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !src) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Pratinjau Gambar Asli'}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-saluang-dark/85 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-saluang-cream border-2 sm:border-3 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-xl overflow-hidden animate-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b-2 border-saluang-dark bg-saluang-sand/60 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 flex-1">
            {subtitle && (
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-saluang-coral truncate">
                {subtitle}
              </p>
            )}
            <h3 className="text-sm sm:text-base font-black text-saluang-dark truncate leading-tight">
              {title || alt || 'Gambar Asli Proyek'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Tombol Buka Tab Baru (Hanya tampil jika showExternalLink bernilai true) */}
            {showExternalLink && (
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark text-xs font-bold shadow-neo-xs transition-all"
                title="Buka file gambar asli di tab baru"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tab Baru</span>
              </a>
            )}

            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl border-2 border-saluang-dark bg-saluang-cream hover:bg-saluang-coral hover:text-white text-saluang-dark shadow-neo-xs transition-colors cursor-pointer"
              title="Tutup (Esc)"
              aria-label="Tutup pratinjau gambar"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Image Content Area */}
        <div className="relative flex-1 p-2 sm:p-4 bg-saluang-dark/5 flex items-center justify-center overflow-auto min-h-[220px]">
          <img
            src={src}
            alt={alt}
            className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-xl border border-saluang-dark/20 shadow-neo-sm transition-transform"
          />
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2.5 border-t border-saluang-dark/15 bg-saluang-sand/30 flex items-center justify-between text-[11px] font-bold text-saluang-dark/70 shrink-0">
          <span className="truncate max-w-[70%]">
            💡 Klik di luar gambar atau tekan <kbd className="px-1.5 py-0.5 rounded border border-saluang-dark/40 bg-white font-mono text-[10px]">Esc</kbd> untuk menutup
          </span>
          <span className="text-[10px] font-mono text-saluang-dark/50 shrink-0">
            Resolusi Asli
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
