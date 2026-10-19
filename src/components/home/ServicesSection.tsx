'use client';

import React from 'react';
import Link from 'next/link';
import { servicesData } from '@/data/services';
import { GlassCard } from '@/components/ui/GlassCard';
import { Globe, Database, Smartphone, Cpu, ArrowRight } from 'lucide-react';

import type { ServiceItem } from '@/types/service';

const iconMap = {
  Globe: Globe,
  Database: Database,
  Smartphone: Smartphone,
  Cpu: Cpu,
};

interface ServicesSectionProps {
  initialServices?: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  initialServices = servicesData,
}) => {
  const services = initialServices && initialServices.length > 0 ? initialServices : servicesData;

  return (
    <section className="bg-saluang-marigold py-12 sm:py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header: "How it works / 4 Pilar Layanan" */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-saluang-dark tracking-tight">
            Empat Layanan Unggulan Kami
          </h2>
          <p className="text-xs sm:text-base text-saluang-dark/80 font-bold">
            Pilih spesifikasi yang paling tepat untuk mengakselerasi kebutuhan bisnis Anda saat ini.
          </p>
        </div>

        {/* 4 Tactile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-24">
          {services.map((service, index) => {
            const Icon = iconMap[service.iconName];
            const badgeBgColors = [
              'bg-saluang-pink',
              'bg-saluang-mint',
              'bg-[#FDE178]',
              'bg-[#FFD1C9]',
            ];
            const badgeBg = badgeBgColors[index % badgeBgColors.length];

            return (
              <GlassCard
                key={service.id}
                variant="interactive"
                className="flex flex-col justify-between p-6 h-full bg-saluang-cream border-2 border-saluang-dark shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all"
              >
                <div className="space-y-5">
                  {/* Icon Box Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center ${badgeBg}`}
                    >
                      <Icon className="w-7 h-7 text-saluang-dark" />
                    </div>
                    <span className="font-mono font-black text-base text-saluang-dark/40">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-black text-saluang-dark tracking-tight">
                      {service.shortTitle}
                    </h3>
                    <p className="text-xs text-saluang-dark/80 mt-2 font-medium leading-relaxed line-clamp-3">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-saluang-sand border border-saluang-dark/40 font-bold text-saluang-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="pt-6 mt-4 border-t-2 border-saluang-dark/10 flex items-center justify-between">
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-saluang-dark hover:text-saluang-coral transition-colors"
                  >
                    <span>Detail Layanan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* ── 3-STEP WORKFLOW / BAGAIMANA KAMI BEKERJA (Sesuai Referensi Visual) ── */}
        <div className="pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-saluang-cream border-2 border-saluang-dark shadow-neo-sm text-xs font-black text-saluang-dark">
              <Zap className="w-4 h-4 fill-saluang-coral text-saluang-dark" />
              <span>Metodologi Rekayasa</span>
            </div> */}
            <h2 className="text-3xl sm:text-4xl font-black text-saluang-dark tracking-tight">
              Alur Kerja Transparan: 3 Langkah Nyata
            </h2>
            <p className="text-sm sm:text-base text-saluang-dark/80 font-bold">
              Dari pemetaan ide awal hingga sistem siap beroperasi penuh dan bergaransi resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Konsultasi & Blueprint',
                desc: 'Kami membedah proses bisnis Anda, memilih arsitektur teknologi paling tepat, dan menyusun estimasi biaya transparan tanpa komitmen.',
                badgeColor: 'bg-saluang-pink',
                accent: 'Kebutuhan Terpetakan',
              },
              {
                step: '02',
                title: 'Pengerjaan & Demo Berkala',
                desc: 'Pengembangan dengan sprint berkala. Anda dapat mencoba langsung sistem di lingkungan staging di setiap tahapan progress nyata.',
                badgeColor: 'bg-saluang-mint',
                accent: 'Uji Coba Langsung',
              },
              {
                step: '03',
                title: 'Rilis, Pelatihan & Garansi',
                desc: 'Deployment ke cloud/server aman, pelatihan operasional staf hingga mahir, serta garansi pemeliharaan dan perbaikan bug aktif.',
                badgeColor: 'bg-saluang-yellow',
                accent: 'Dukungan Berkelanjutan',
              },
            ].map((item) => (
              <GlassCard
                key={item.step}
                variant="interactive"
                className="p-7 flex flex-col justify-between bg-saluang-cream border-2 border-saluang-dark shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all rounded-3xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`w-12 h-12 rounded-2xl border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center font-mono font-black text-lg text-saluang-dark ${item.badgeColor}`}>
                      {item.step}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-saluang-sand border border-saluang-dark/30 text-saluang-dark">
                      {item.accent}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-saluang-dark tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-saluang-dark/80 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
