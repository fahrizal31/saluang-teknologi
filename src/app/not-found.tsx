import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-saluang-sand">
      <div className="max-w-md w-full p-8 sm:p-10 text-center bg-saluang-cream border-2 border-saluang-dark rounded-4xl shadow-neo-xl space-y-6">
        <div className="text-6xl sm:text-7xl font-black text-saluang-coral font-mono tracking-tight drop-shadow-[3px_3px_0px_#3A1F3D]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-saluang-dark tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/80 font-bold leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan atau alamatnya keliru.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" variant="coral" size="md" leftIcon={<Home className="w-4 h-4" />} className="bg-saluang-coral text-white font-black">
            Kembali ke Beranda
          </Button>
          <Button href="/layanan" variant="secondary" size="md" className="bg-saluang-sand font-bold text-saluang-dark">
            Lihat Layanan
          </Button>
        </div>
      </div>
    </div>
  );
}
