import React from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { companyData } from '@/data/company';
import { ArrowRight, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomeCTAProps {
  whatsappNumber?: string;
}

export const HomeCTA: React.FC<HomeCTAProps> = ({ whatsappNumber }) => {
  return (
    <section className="pt-14 sm:pt-20 lg:pt-28 bg-saluang-marigold relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 lg:p-14 rounded-3xl sm:rounded-4xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-xl text-center space-y-5 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight leading-tight max-w-2xl mx-auto">
            Siap Membangun Sistem Digital yang Menggerakkan Bisnis Anda?
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/85 font-semibold max-w-xl mx-auto leading-relaxed">
            Diskusikan ide dan tantangan operasional Anda bersama tim Saluang Teknologi. Kami siapkan
            analisis arsitektur terbaik dan estimasi biaya yang transparan.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              href="/kontak"
              variant="coral"
              size="lg"
              className="w-full sm:w-auto justify-center bg-saluang-coral text-white font-black text-sm sm:text-base shadow-neo hover:shadow-neo-md"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Minta Penawaran Sekarang
            </Button>
            <Button
              href={`https://wa.me/${whatsappNumber || companyData.phoneWhatsapp}`}
              isExternal
              variant="secondary"
              size="lg"
              leftIcon={<MessageSquare className="w-5 h-5 text-emerald-600" />}
              className="w-full sm:w-auto justify-center bg-saluang-cream text-saluang-dark font-black text-sm sm:text-base shadow-neo hover:shadow-neo-md"
            >
              Konsultasi WhatsApp
            </Button>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm font-bold text-saluang-dark">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0" />
              Respon Cepat &lt; 24 Jam
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0" />
              Konsultasi Awal Gratis
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0" />
              Perjanjian Kerahasiaan (NDA)
            </span>
          </div>
        </div>
      </div>

      {/* Wavy transition flowing into the dark footer */}
      <div className="w-full overflow-hidden leading-none relative -mb-1 mt-16 sm:mt-24 pointer-events-none">
        <svg
          viewBox="0 0 1200 80"
          preserveAspectRatio="none"
          className="block w-full h-10 sm:h-14 text-saluang-dark fill-current"
          aria-hidden="true"
        >
          <path d="M0,20 C200,80 400,0 600,50 C800,100 1000,10 1200,45 L1200,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};
