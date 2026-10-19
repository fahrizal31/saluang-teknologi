import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProjectInquiryForm } from '@/components/contact/ProjectInquiryForm';
import { getCompanyInfo } from '@/lib/data/company';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Hubungi Kami & Minta Penawaran Proyek Perangkat Lunak',
  description:
    'Kirim spesifikasi kebutuhan website, sistem informasi, atau aplikasi Android Anda. Dapatkan konsultasi teknis dan estimasi penawaran harga transparan dari Saluang Teknologi.',
  openGraph: {
    title: 'Kontak & Formulir Penawaran - Saluang Teknologi',
    description:
      'Hubungi tim pengembang Saluang Teknologi via formulir resmi atau WhatsApp untuk penawaran cepat.',
  },
};

export default async function ContactPage() {
  const companyData = await getCompanyInfo();
  const directWhatsappUrl = `https://wa.me/${companyData.phoneWhatsapp}?text=${encodeURIComponent(
    'Halo Saluang Teknologi, saya ingin berkonsultasi mengenai rencana proyek perangkat lunak baru.'
  )}`;

  return (
    <div className="py-12 sm:py-20 lg:py-24 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <Badge variant="yellow" size="md">
            Konsultasi &amp; Estimasi Proyek
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight">
            Mari Wujudkan Visi Digital Organisasi Anda
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/80 font-bold leading-relaxed">
            Sampaikan ide, kebutuhan sistem, atau tantangan bisnis Anda. Kami siap merancang solusi
            arsitektur perangkat lunak yang presisi dan berbiaya rasional.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Form (Wrapped in Suspense) */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="p-8 sm:p-12 rounded-3xl bg-saluang-cream border-2 border-saluang-dark text-center text-saluang-dark font-bold">
                  Memuat formulir penawaran...
                </div>
              }
            >
              <ProjectInquiryForm whatsappNumber={companyData.phoneWhatsapp} />
            </Suspense>
          </div>

          {/* Right Column: Contact Details, WhatsApp Fast-Track & Map */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* Direct WhatsApp Callout */}
            <div className="p-5 sm:p-8 bg-saluang-yellow border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center text-saluang-dark">
                  <MessageSquare className="w-6 h-6 text-emerald-600 fill-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-saluang-dark">Konsultasi WhatsApp Cepat</h3>
                  <p className="text-xs text-saluang-dark/80 font-bold">Chat langsung dengan tim kami</p>
                </div>
              </div>
              <p className="text-xs text-saluang-dark/85 font-bold leading-relaxed">
                Ingin berdiskusi santai atau butuh perkiraan cepat sebelum mengisi formulir lengkap? Tim
                kami siap merespons chat Anda.
              </p>
              <Button
                href={directWhatsappUrl}
                isExternal
                variant="coral"
                size="md"
                leftIcon={<MessageSquare className="w-4 h-4 text-white" />}
                className="w-full justify-center bg-saluang-coral text-white font-black text-xs"
              >
                Buka Chat WhatsApp Sekarang
              </Button>
            </div>

            {/* Office & Contact Info */}
            <div className="p-5 sm:p-8 bg-saluang-cream border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-md space-y-5 sm:space-y-6">
              <h3 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/15 pb-3">
                Informasi Kantor &amp; Layanan
              </h3>

              <div className="space-y-4 text-xs font-bold text-saluang-dark">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-saluang-coral shrink-0 mt-0.5" />
                  <div>
                    <span className="text-saluang-dark/70 font-semibold block text-[11px]">ALAMAT KANTOR:</span>
                    <span>
                      {companyData.address.street}, {companyData.address.city},{' '}
                      {companyData.address.province}, {companyData.address.country} (
                      {companyData.address.postalCode})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-saluang-coral shrink-0" />
                  <div>
                    <span className="text-saluang-dark/70 font-semibold block text-[11px]">EMAIL RESMI:</span>
                    <a
                      href={`mailto:${companyData.email}`}
                      className="text-saluang-coral underline hover:text-saluang-dark"
                    >
                      {companyData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-saluang-coral shrink-0" />
                  <div>
                    <span className="text-saluang-dark/70 font-semibold block text-[11px]">TELEPON / WHATSAPP:</span>
                    <a
                      href={`https://wa.me/${companyData.phoneWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-saluang-coral underline hover:text-saluang-dark"
                    >
                      {companyData.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-saluang-coral shrink-0 mt-0.5" />
                  <div>
                    <span className="text-saluang-dark/70 font-semibold block text-[11px]">JAM OPERASIONAL:</span>
                    <span>Senin &ndash; Jumat: 08.30 &ndash; 17.30 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="p-4 bg-saluang-cream border-2 border-saluang-dark rounded-4xl shadow-neo-md space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-saluang-dark flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-saluang-coral" />
                  Peta Lokasi Kantor
                </span>
                <span className="text-[10px] font-bold text-saluang-dark/60">Muara Teweh, Kalteng</span>
              </div>
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-saluang-sand border-2 border-saluang-dark flex items-center justify-center text-center p-4">
                <div className="relative z-10 space-y-1.5">
                  <div className="w-9 h-9 rounded-2xl bg-saluang-coral text-white border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center mx-auto">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="text-xs font-black text-saluang-dark">Studio Saluang Teknologi</div>
                  <div className="text-[11px] font-bold text-saluang-dark/75 max-w-xs mx-auto">
                    Muara Teweh, Kab. Barito Utara, Kalimantan Tengah
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
