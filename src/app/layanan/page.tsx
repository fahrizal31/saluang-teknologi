import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/lib/data/services';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Globe, Database, Smartphone, Cpu, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Layanan Pengembangan Software & Solusi Digital',
  description:
    'Jelajahi empat pilar layanan Saluang Teknologi: Website Profesional, Sistem Informasi Kustom, Aplikasi Android, dan Rekayasa Software Khusus.',
  openGraph: {
    title: 'Layanan Rekayasa Perangkat Lunak - Saluang Teknologi',
    description:
      'Solusi pengembangan website, sistem informasi, dan aplikasi mobile yang disesuaikan dengan kebutuhan bisnis Anda.',
  },
};

const iconMap = {
  Globe: Globe,
  Database: Database,
  Smartphone: Smartphone,
  Cpu: Cpu,
};

export default async function ServicesPage() {
  const servicesData = await getServices();
  return (
    <div className="py-12 sm:py-20 lg:py-24 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-20">
          <Badge variant="coral" size="md">
            Solusi Rekayasa Digital
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight">
            Empat Pilar Layanan untuk Mengakselerasi Organisasi Anda
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/80 font-bold leading-relaxed">
            Kami mengombinasikan keahlian arsitektur perangkat lunak dengan pemahaman bisnis konkret
            untuk membangun produk digital yang andal dan mudah dirawat.
          </p>
        </div>

        {/* Services Deep Dive List */}
        <div className="space-y-8 sm:space-y-12">
          {servicesData.map((service, idx) => {
            const Icon = iconMap[service.iconName];
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={service.id}
                className="p-5 sm:p-8 lg:p-12 bg-saluang-cream border-2 border-saluang-dark shadow-neo-lg rounded-3xl sm:rounded-4xl"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isReversed ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left Column: Info & Problems Solved */}
                  <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-saluang-yellow border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center text-saluang-dark">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <Badge variant="teal" size="sm">
                        {service.badge}
                      </Badge>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-saluang-dark tracking-tight">
                        {service.title}
                      </h2>
                      <p className="text-xs sm:text-sm lg:text-base text-saluang-dark/80 font-medium mt-2 leading-relaxed">
                        {service.heroDescription}
                      </p>
                    </div>

                    {/* Problems Solved Highlights */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-black uppercase tracking-wider text-saluang-coral">
                        Masalah yang Kami Selesaikan:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                        {service.problemsSolved.map((prob, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs font-semibold text-saluang-dark">
                            <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0 mt-0.5" />
                            <span>{prob}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <Button
                        href={`/layanan/${service.slug}`}
                        variant="coral"
                        size="md"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto justify-center bg-saluang-coral text-white font-black"
                      >
                        Pelajari Alur &amp; Spesifikasi
                      </Button>
                      <Button
                        href={`/kontak?layanan=${service.slug}`}
                        variant="secondary"
                        size="md"
                        className="w-full sm:w-auto justify-center font-bold text-saluang-dark bg-saluang-sand"
                      >
                        Minta Penawaran
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Workflow Preview & Tech Stack */}
                  <div className="lg:col-span-5 bg-saluang-sand p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 border-saluang-dark shadow-neo-sm space-y-5 sm:space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-saluang-dark/15 pb-4">
                      <span className="text-xs uppercase font-black tracking-wider text-saluang-dark flex items-center gap-2">
                        <Layers className="w-4 h-4 text-saluang-coral" />
                        Alur Kerja Standar
                      </span>
                      <span className="text-xs font-mono font-bold text-saluang-coral">4 Tahap Utama</span>
                    </div>

                    <div className="space-y-3.5">
                      {service.workflow.map((step) => (
                        <div key={step.step} className="flex items-start gap-3 text-xs font-semibold">
                          <span className="w-6 h-6 rounded-xl bg-saluang-yellow text-saluang-dark border-2 border-saluang-dark shadow-[1.5px_1.5px_0px_#3A1F3D] flex items-center justify-center font-mono font-black shrink-0 mt-0.5">
                            {step.step}
                          </span>
                          <div className="flex-1">
                            <span className="font-black text-saluang-dark block">{step.title}</span>
                            <span className="text-saluang-dark/75 text-[11px] font-medium">{step.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t-2 border-saluang-dark/15">
                      <div className="text-[11px] uppercase font-black text-saluang-dark/70 mb-2">
                        Teknologi Utama:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-saluang-cream text-saluang-dark border border-saluang-dark/30 font-mono font-bold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
