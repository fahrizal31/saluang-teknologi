import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedProjects } from '@/lib/data/portfolio';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const FeaturedProjects = async () => {
  const featured = (await getFeaturedProjects()).slice(0, 3);

  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-saluang-marigold relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-5 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-3 max-w-xl text-left">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-saluang-dark tracking-tight leading-tight">
              Proyek Pilihan &amp; Dampak Nyata
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-saluang-dark/85 font-semibold leading-relaxed">
              Setiap baris kode dirancang spesifik untuk memecahkan hambatan operasional dan memacu pertumbuhan bisnis klien.
            </p>
          </div>
          <div className="pt-2 md:pt-0">
            <Button
              href="/portofolio"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto justify-center bg-saluang-cream text-saluang-dark font-black shadow-neo hover:shadow-neo-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Semua Portofolio
            </Button>
          </div>
        </div>

        {/* 3 Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((project) => (
            <GlassCard
              key={project.id}
              variant="interactive"
              className="flex flex-col h-full overflow-hidden p-0 bg-saluang-cream border-2 border-saluang-dark shadow-neo hover:-translate-y-1 hover:shadow-neo-lg transition-all rounded-3xl"
            >
              {/* Image Thumbnail with Solid Border */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden border-b-2 border-saluang-dark bg-slate-100">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="yellow" size="sm">
                    {project.categoryLabel}
                  </Badge>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5 sm:space-y-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-saluang-coral uppercase tracking-wide">
                    {project.clientName}
                  </div>
                  <h3 className="text-xl font-black text-saluang-dark leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-saluang-dark/80 font-medium leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>

                  {/* Highlights/Results */}
                  <div className="pt-2 space-y-1.5">
                    {project.results.slice(0, 2).map((res, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-semibold text-saluang-dark">
                        <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Tags & Action */}
                <div className="pt-4 border-t-2 border-saluang-dark/10 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-saluang-sand border border-saluang-dark/30 font-bold text-saluang-dark"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/portofolio`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-saluang-dark hover:text-saluang-coral transition-colors"
                  >
                    <span>Rincian Solusi Proyek</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
