import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceBySlug, getServices } from '@/lib/data/services';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Globe,
  Database,
  Smartphone,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { companyData } from '@/data/company';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const allServices = await getServices();
  return allServices.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: 'Layanan Tidak Ditemukan' };

  return {
    title: `${service.shortTitle} - Solusi & Alur Pengembangan`,
    description: service.subtitle,
    openGraph: {
      title: `${service.title} | Saluang Teknologi`,
      description: service.subtitle,
    },
  };
}

const iconMap = {
  Globe: Globe,
  Database: Database,
  Smartphone: Smartphone,
  Cpu: Cpu,
};

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.iconName];

  return (
    <div className="py-12 sm:py-20 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-saluang-dark/70 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-saluang-coral transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-saluang-dark/40" />
          <Link href="/layanan" className="hover:text-saluang-coral transition-colors">
            Layanan
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-saluang-dark/40" />
          <span className="text-saluang-coral">{service.shortTitle}</span>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl space-y-6 text-left">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-saluang-yellow border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center text-saluang-dark">
              <Icon className="w-6 h-6" />
            </div>
            <Badge variant="coral" size="md">
              {service.badge}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight leading-tight">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-saluang-dark/85 leading-relaxed font-bold">
            {service.heroDescription}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              href={`/kontak?layanan=${service.slug}`}
              variant="coral"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto justify-center bg-saluang-coral text-white font-black"
            >
              Konsultasikan Proyek {service.shortTitle}
            </Button>
            <Button
              href={`https://wa.me/${companyData.phoneWhatsapp}?text=${encodeURIComponent(
                `Halo Saluang Teknologi, saya ingin berdiskusi mengenai layanan ${service.shortTitle}.`
              )}`}
              isExternal
              variant="secondary"
              size="lg"
              leftIcon={<MessageSquare className="w-5 h-5 text-emerald-600" />}
              className="w-full sm:w-auto justify-center bg-saluang-cream text-saluang-dark font-black"
            >
              Tanya via WhatsApp
            </Button>
          </div>
        </div>

        {/* Grid: Masalah yang Diselesaikan & Hasil Kerja (Deliverables) */}
        <div className="mt-12 sm:mt-20 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Masalah yang Diselesaikan */}
          <div className="p-5 sm:p-8 lg:p-10 bg-saluang-cream border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-md">
            <h2 className="text-xl font-black text-saluang-dark mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-saluang-coral" />
              Tantangan Bisnis yang Kami Atasi
            </h2>
            <p className="text-xs text-saluang-dark/70 font-bold mb-6">
              Hambatan umum yang sering dialami klien sebelum bermitra dengan Saluang Teknologi:
            </p>

            <div className="space-y-4">
              {service.problemsSolved.map((prob, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm text-xs font-semibold text-saluang-dark"
                >
                  <span className="text-saluang-coral font-black font-mono shrink-0">✕</span>
                  <span className="leading-relaxed">{prob}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yang Anda Dapatkan (Deliverables) */}
          <div className="p-5 sm:p-8 lg:p-10 bg-saluang-cream border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-md">
            <h2 className="text-xl font-black text-saluang-dark mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-saluang-teal" />
              Hasil Kerja &amp; Garansi yang Anda Terima
            </h2>
            <p className="text-xs text-saluang-dark/70 font-bold mb-6">
              Standar serah terima proyek profesional yang menjadi hak penuh Anda:
            </p>

            <div className="space-y-4">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm space-y-1"
                >
                  <div className="flex items-center gap-2 text-sm font-black text-saluang-dark">
                    <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="text-xs text-saluang-dark/75 font-medium pl-6">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alur Kerja & Metodologi Pengerjaan (Workflow) */}
        <div className="mt-16 sm:mt-24 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="yellow" size="md">
              Metodologi Transparan
            </Badge>
            <h2 className="text-3xl font-black text-saluang-dark tracking-tight">
              Alur Pengerjaan dari Konsep Hingga Rilis
            </h2>
            <p className="text-sm font-bold text-saluang-dark/80">
              Setiap tahapan memiliki target keluaran yang jelas dan melibatkan persetujuan berkala dari Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.workflow.map((step) => (
              <div
                key={step.step}
                className="p-6 bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-saluang-yellow text-saluang-dark border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center font-mono font-black text-sm">
                      0{step.step}
                    </span>
                    {step.duration && (
                      <span className="text-[11px] font-mono font-bold text-saluang-coral flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-saluang-dark">{step.title}</h3>
                  <p className="text-xs text-saluang-dark/80 font-medium leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack Teknologi */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-4xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-lg text-center space-y-6">
          <h2 className="text-2xl font-black text-saluang-dark">
            Teknologi &amp; Alat Bantu yang Kami Gunakan
          </h2>
          <p className="text-xs sm:text-sm text-saluang-dark/80 font-bold max-w-xl mx-auto">
            Kami hanya memilih ekosistem teknologi modern dengan dokumentasi kuat, komunitas global
            aktif, dan performa tinggi untuk menjamin masa depan sistem Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-saluang-sand border-2 border-saluang-dark text-saluang-dark font-mono font-bold shadow-neo-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Conversion CTA */}
        <div className="mt-14 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 p-5 sm:p-7 rounded-3xl bg-saluang-yellow border-2 border-saluang-dark shadow-neo-lg w-full sm:w-auto">
            <span className="text-sm font-black text-saluang-dark text-center">
              Punya spesifikasi khusus untuk {service.shortTitle}?
            </span>
            <Button
              href={`/kontak?layanan=${service.slug}`}
              variant="coral"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto justify-center bg-saluang-coral text-white font-black"
            >
              Minta Penawaran Kustom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
