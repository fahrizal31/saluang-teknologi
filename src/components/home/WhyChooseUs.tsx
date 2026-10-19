import React from 'react';
import { companyData } from '@/data/company';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Handshake, Target, Zap, Sparkles } from 'lucide-react';

interface WhyChooseUsProps {
  stats?: { label: string; value: string; suffix?: string }[];
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ stats }) => {
  const displayStats = stats && stats.length > 0 ? stats : companyData.stats;
  const iconMap: Record<string, React.ElementType> = {
    ShieldCheck: ShieldCheck,
    Handshake: Handshake,
    Target: Target,
    Zap: Zap,
  };

  const badgeBgs = [
    'bg-saluang-teal text-white',
    'bg-saluang-coral text-white',
    'bg-saluang-yellow text-saluang-dark',
    'bg-saluang-mint text-saluang-dark',
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-saluang-marigold relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight leading-tight">
            Prinsip Rekayasa Perangkat Lunak Saluang Teknologi
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/85 font-semibold leading-relaxed">
            Kami bukan sekadar menulis kode, kami merancang solusi teknologi yang kokoh, terukur, dan menghormati anggaran Anda.
          </p>
        </div>

        {/* 4 Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {companyData.values.map((val, idx) => {
            const Icon = iconMap[val.icon] || Sparkles;
            const badgeBg = badgeBgs[idx % badgeBgs.length];

            return (
              <GlassCard
                key={val.title}
                variant="interactive"
                className="p-5 sm:p-7 flex flex-col justify-between bg-saluang-cream border-2 border-saluang-dark shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all rounded-3xl"
              >
                <div>
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 border-saluang-dark shadow-neo-sm flex items-center justify-center mb-4 sm:mb-5 ${badgeBg}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-saluang-dark mb-1.5 sm:mb-2 tracking-tight">{val.title}</h3>
                  <p className="text-xs sm:text-sm text-saluang-dark/80 font-medium leading-relaxed">{val.description}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Metrics Banner */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-8 lg:p-10 rounded-3xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center md:divide-x-2 md:divide-saluang-dark/20">
            {displayStats.map((stat) => (
              <div key={stat.label} className="p-2 sm:p-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-saluang-dark font-mono tracking-tight">
                  {stat.value}
                  <span className="text-saluang-coral">{stat.suffix}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-saluang-dark/80 mt-1 sm:mt-2 font-bold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
