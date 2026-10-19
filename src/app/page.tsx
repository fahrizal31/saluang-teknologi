import React from 'react';
import { HeroDiorama } from '@/components/home/HeroDiorama';
import { ServicesSection } from '@/components/home/ServicesSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HomeCTA } from '@/components/home/HomeCTA';
import { getServices } from '@/lib/data/services';
import { getCompanyInfo } from '@/lib/data/company';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [services, companyInfo] = await Promise.all([
    getServices(),
    getCompanyInfo(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero dengan Warna Pink, Tipografi Super, dan Ilustrasi Robot Isometrik */}
      <HeroDiorama whatsappNumber={companyInfo.phoneWhatsapp} />

      {/* 2. Bagian Fitur Kuning & 4 Kartu Layanan Tactile (Sesuai Referensi Visual) */}
      <ServicesSection initialServices={services} />

      {/* 3. Proyek Pilihan (3 Proyek Unggulan Sesuai PRD) */}
      <FeaturedProjects />

      {/* 4. Nilai Tambah & Alasan Memilih Saluang Teknologi */}
      <WhyChooseUs stats={companyInfo.stats} />

      {/* 5. Ajakan Bertindak (CTA) Utama */}
      <HomeCTA whatsappNumber={companyInfo.phoneWhatsapp} />
    </div>
  );
}
