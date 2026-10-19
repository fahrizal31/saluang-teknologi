import React from 'react';
import type { Metadata } from 'next';
import { PortfolioClient } from './PortfolioClient';
import { Badge } from '@/components/ui/Badge';
import { HomeCTA } from '@/components/home/HomeCTA';
import { getPortfolioProjects } from '@/lib/data/portfolio';

export const metadata: Metadata = {
  title: 'Portofolio Proyek & Studi Kasus Solusi Digital',
  description:
    'Lihat hasil karya nyata Saluang Teknologi dalam pengembangan website, sistem informasi operasional, dan aplikasi Android berkinerja tinggi.',
  openGraph: {
    title: 'Portofolio Saluang Teknologi - Bukti Nyata Solusi Perangkat Lunak',
    description:
      'Studi kasus dan portofolio rekayasa software teruji untuk organisasi, instansi, dan UMKM.',
  },
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();

  return (
    <div className="py-16 sm:py-24 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <Badge variant="yellow" size="md">
            Rekam Jejak &amp; Bukti Kinerja
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-saluang-dark tracking-tight">
            Portofolio Proyek Terkurasi
          </h1>
          <p className="text-base sm:text-lg text-saluang-dark/80 font-bold leading-relaxed">
            Telusuri bagaimana kami membantu berbagai organisasi mengatasi kerumitan operasional
            melalui rekayasa perangkat lunak yang presisi dan tepat sasaran.
          </p>
        </div>

        {/* Interactive Filterable Projects Grid */}
        <PortfolioClient initialProjects={projects} />

        {/* Bottom CTA */}
        <div className="mt-20">
          <HomeCTA />
        </div>
      </div>
    </div>
  );
}
