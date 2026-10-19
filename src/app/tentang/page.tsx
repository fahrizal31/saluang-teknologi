import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getCompanyInfo } from '@/lib/data/company';
import { getTeamMembers } from '@/lib/data/team';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HomeCTA } from '@/components/home/HomeCTA';
import {
  Linkedin,
  Github,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami & Profil Tim Perekayasa Perangkat Lunak',
  description:
    'Mengenal visi, misi, nilai budaya kerja, dan tim profesional di balik Saluang Teknologi. Menghubungkan potensi lokal dengan inovasi digital modern.',
  openGraph: {
    title: 'Tentang Saluang Teknologi - Profil Perusahaan & Tim',
    description:
      'Perusahaan teknologi yang menghubungkan potensi lokal dengan inovasi modern melalui rekayasa software teruji.',
  },
};

export default async function AboutPage() {
  const [teamData, companyData] = await Promise.all([
    getTeamMembers(),
    getCompanyInfo(),
  ]);
  return (
    <div className="py-12 sm:py-20 lg:py-24 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-20">
          <Badge variant="coral" size="md">
            Mengenal Saluang Teknologi
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight">
            Menghubungkan Potensi Lokal dengan Inovasi Modern
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/80 font-bold leading-relaxed">
            Terinspirasi dari kelincahan ikan saluang dan jernihnya aliran sungai daerah kami,
            kami menciptakan solusi digital yang menggerakkan dan memajukan masyarakat.
          </p>
        </div>

        {/* Cerita Pendirian & Filosofi Ikan Saluang */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-16 sm:mb-24">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            <Badge variant="yellow" size="sm">
              Filosofi Lambang &amp; Makna Brand
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-saluang-dark tracking-tight leading-tight">
              Kelincahan Aliran Sungai &amp; Ketangguhan Rekayasa
            </h2>
            <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm lg:text-base text-saluang-dark/85 font-semibold leading-relaxed">
              <p>
                <strong>Ikan Saluang</strong> adalah simbol kelincahan, ketahanan, dan kemampuan navigasi
                di arus sungai yang deras. Dalam lambang resmi Saluang Teknologi, ikan saluang melompat di atas
                sungai berjalur sirkuit digital, berlatar pegunungan dan matahari terbit, dengan antena-antena
                konektivitas yang menjulang ke langit.
              </p>
              <p>
                Bagi kami, simbol ini adalah janji: menghadirkan perangkat lunak yang tidak hanya indah secara
                estetika, tetapi juga gesit, tangguh menghadapi lonjakan beban data, serta berakar kuat pada
                semangat kolaborasi lokal.
              </p>
            </div>

            {/* Visual Logo Resmi Saluang Teknologi */}
            <div className="p-2.5 sm:p-3 bg-saluang-cream rounded-3xl border-2 border-saluang-dark shadow-neo-sm inline-block">
              <div className="bg-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-saluang-dark/10 flex items-center justify-center">
                <Image
                  src="/images/saluang-logo.png"
                  alt="Logo Resmi Saluang Teknologi"
                  width={260}
                  height={108}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button href="/kontak" variant="coral" size="md" className="w-full sm:w-auto justify-center">
                Diskusikan Kebutuhan Anda
              </Button>
              <Button href="/portofolio" variant="secondary" size="md" className="w-full sm:w-auto justify-center">
                Lihat Portofolio Kami
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 bg-saluang-cream border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-lg space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-saluang-dark/15 pb-4">
                <Compass className="w-6 h-6 text-saluang-coral shrink-0" />
                <h3 className="text-lg font-black text-saluang-dark">Visi Perusahaan</h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-saluang-dark leading-relaxed italic">
                &ldquo;{companyData.vision}&rdquo;
              </p>

              <div className="pt-2 space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-saluang-coral">
                  Misi Utama Kami:
                </div>
                <div className="space-y-2.5">
                  {companyData.mission.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-saluang-dark">
                      <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profil Tim (Team Members) */}
        <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <Badge variant="teal" size="md">
              Para Perekayasa
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-saluang-dark tracking-tight">
              Talenta di Balik Setiap Baris Kode
            </h2>
            <p className="text-xs sm:text-sm text-saluang-dark/80 font-bold">
              Tim lintas disiplin yang memadukan keahlian arsitektur software, keamanan web, desain
              antarmuka, dan optimasi mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {teamData.map((member) => (
              <GlassCard
                key={member.id}
                variant="interactive"
                className="flex flex-col h-full overflow-hidden p-0"
              >
                {/* Photo Avatar */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden border-b-2 border-saluang-dark bg-slate-100">
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>

                {/* Bio & Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-saluang-dark">
                      {member.name}
                    </h3>
                    <div className="text-xs font-bold text-saluang-coral mt-0.5">
                      {member.role}
                    </div>
                    <p className="text-xs text-saluang-dark/80 font-medium mt-2.5 sm:mt-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="pt-4 border-t-2 border-saluang-dark/10 flex items-center gap-3">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn ${member.name}`}
                        className="text-saluang-dark hover:text-saluang-coral transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`GitHub ${member.name}`}
                        className="text-saluang-dark hover:text-saluang-coral transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <HomeCTA />
      </div>
    </div>
  );
}
