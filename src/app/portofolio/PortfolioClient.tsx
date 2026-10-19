'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '@/data/portfolio';
import { PortfolioProject, ServiceCategory } from '@/types/portfolio';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  X,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const categories: { label: string; value: 'all' | ServiceCategory }[] = [
  { label: 'Semua Proyek', value: 'all' },
  { label: 'Website Profesional', value: 'website' },
  { label: 'Sistem Informasi', value: 'sistem-informasi' },
  { label: 'Aplikasi Android', value: 'aplikasi-android' },
  { label: 'Software Lainnya', value: 'software-lainnya' },
];

interface PortfolioClientProps {
  initialProjects?: PortfolioProject[];
}

export const PortfolioClient: React.FC<PortfolioClientProps> = ({
  initialProjects = portfolioData,
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const PROJECTS_PER_PAGE = 6;
  const projects = initialProjects && initialProjects.length > 0 ? initialProjects : portfolioData;

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const totalProjects = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / PROJECTS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PROJECTS_PER_PAGE, totalProjects);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleCategorySelect = (catValue: 'all' | ServiceCategory) => {
    setSelectedCategory(catValue);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('portfolio-grid-top');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCloseModal = () => {
    setActiveModalProject(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Auto-buka rincian proyek jika URL memuat hash spesifik (misal: /portofolio#sim-klinik-sehat-mandiri)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashCheck = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const matched = projects.find((p) => p.slug === hash || p.id === hash);
      if (matched) {
        setSelectedCategory('all');
        const matchedIndex = projects.findIndex((p) => p.slug === hash || p.id === hash);
        if (matchedIndex !== -1) {
          const targetPage = Math.floor(matchedIndex / PROJECTS_PER_PAGE) + 1;
          setCurrentPage(targetPage);
        }
        setActiveModalProject(matched);
        setTimeout(() => {
          const el = document.getElementById(matched.slug);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [projects]);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (activeModalProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeModalProject]);

  return (
    <>
      <div id="portfolio-grid-top" className="scroll-mt-24" />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => handleCategorySelect(cat.value)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm font-extrabold border-2 border-saluang-dark transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-dark ${
                isActive
                  ? 'bg-saluang-coral text-white shadow-neo active:shadow-neo-sm'
                  : 'bg-saluang-cream text-saluang-dark hover:bg-saluang-yellow/30 shadow-neo-sm'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Projects Grid with AnimatePresence */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence>
          {paginatedProjects.map((project) => (
            <motion.div
              key={project.id}
              id={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <GlassCard
                variant="interactive"
                className="flex flex-col h-full overflow-hidden p-0"
                onClick={() => {
                  setActiveModalProject(project);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', `#${project.slug}`);
                  }
                }}
              >
                {/* Project Image */}
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
                  <div className="absolute top-4 right-4 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-saluang-cream text-saluang-dark border-2 border-saluang-dark shadow-neo-sm">
                    {project.completionYear}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-saluang-coral uppercase tracking-wide">
                      {project.clientName}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-saluang-dark leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-saluang-dark/80 font-medium leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech stack & action */}
                  <div className="pt-4 border-t-2 border-saluang-dark/10 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-saluang-sand border border-saluang-dark/30 font-bold text-saluang-dark"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-saluang-sand border border-saluang-dark/30 font-bold text-saluang-dark">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-black text-saluang-dark hover:text-saluang-coral">
                      <span>Rincian Solusi Proyek</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls on Public Portfolio */}
      {totalPages > 1 && (
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 bg-saluang-cream p-4 sm:p-5 rounded-3xl border-2 border-saluang-dark shadow-neo">
          <p className="text-xs sm:text-sm font-bold text-saluang-dark">
            Menampilkan <span className="font-black text-saluang-coral">{startIndex + 1} - {endIndex}</span> dari{' '}
            <span className="font-black text-saluang-teal">{totalProjects}</span> proyek unggulan
          </p>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={validCurrentPage <= 1}
              className="p-2 sm:p-2.5 rounded-2xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-xs transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Pertama"
              aria-label="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage <= 1}
              className="px-3 sm:px-4 py-2 rounded-2xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark text-xs font-black shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-xs sm:text-sm font-black border-2 border-saluang-dark transition-all cursor-pointer flex items-center justify-center ${
                    validCurrentPage === page
                      ? 'bg-saluang-coral text-white shadow-neo scale-105'
                      : 'bg-white hover:bg-saluang-yellow/50 text-saluang-dark shadow-neo-xs'
                  }`}
                  aria-label={`Halaman ${page}`}
                  aria-current={validCurrentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage >= totalPages}
              className="px-3 sm:px-4 py-2 rounded-2xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark text-xs font-black shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Halaman Selanjutnya"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(totalPages)}
              disabled={validCurrentPage >= totalPages}
              className="p-2 sm:p-2.5 rounded-2xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-xs transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Terakhir"
              aria-label="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Project Detail Modal rendered via Portal to document.body */}
      {mounted && activeModalProject && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-saluang-dark/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl sm:rounded-4xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Modal Fixed Header */}
            <div className="p-4 sm:p-6 border-b-2 border-saluang-dark/15 bg-saluang-cream flex items-start justify-between shrink-0 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5 pr-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge variant="yellow" size="sm">
                    {activeModalProject.categoryLabel}
                  </Badge>
                  <span className="text-[11px] sm:text-xs font-bold text-saluang-dark/70 font-mono">
                    Tahun {activeModalProject.completionYear}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-saluang-coral uppercase tracking-wide">
                    &bull; {activeModalProject.clientName}
                  </span>
                </div>
                <h2
                  id="modal-project-title"
                  className="text-lg sm:text-2xl lg:text-3xl font-black text-saluang-dark tracking-tight leading-snug"
                >
                  {activeModalProject.title}
                </h2>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                aria-label="Tutup rincian proyek"
                className="shrink-0 p-2 sm:p-2.5 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm text-saluang-dark hover:bg-saluang-coral hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Modal Scrollable Body */}
            <div className="p-4 sm:p-7 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
              {/* Cover Image in Modal */}
              <div className="relative h-44 sm:h-64 lg:h-72 w-full rounded-2xl overflow-hidden border-2 border-saluang-dark bg-slate-100 shrink-0">
                <Image
                  src={activeModalProject.imageUrl}
                  alt={activeModalProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                <div className="p-4 sm:p-5 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm space-y-1.5 sm:space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-saluang-coral">
                    Tantangan Klien:
                  </div>
                  <p className="text-xs sm:text-sm text-saluang-dark/85 font-medium leading-relaxed">
                    {activeModalProject.problem}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm space-y-1.5 sm:space-y-2">
                  <div className="text-xs font-black uppercase tracking-wider text-saluang-teal">
                    Solusi Saluang Teknologi:
                  </div>
                  <p className="text-xs sm:text-sm text-saluang-dark/85 font-medium leading-relaxed">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              {/* Measurable Results */}
              <div className="p-4 sm:p-5 rounded-2xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-sm space-y-2.5 sm:space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-saluang-dark">
                  Hasil Terukur:
                </div>
                <div className="space-y-2">
                  {activeModalProject.results.map((res, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-saluang-dark">
                      <CheckCircle2 className="w-4 h-4 text-saluang-teal shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {activeModalProject.testimonial && (
                <div className="p-4 sm:p-5 rounded-2xl bg-saluang-pink border-2 border-saluang-dark shadow-neo-sm space-y-2">
                  <Quote className="w-5 h-5 text-saluang-coral opacity-80" />
                  <p className="text-xs sm:text-sm italic font-bold text-saluang-dark leading-relaxed">
                    &ldquo;{activeModalProject.testimonial.quote}&rdquo;
                  </p>
                  <div className="text-xs font-black text-saluang-dark pt-1">
                    {activeModalProject.testimonial.author} &bull;{' '}
                    <span className="text-saluang-dark/70 font-semibold">{activeModalProject.testimonial.role}</span>
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-saluang-dark">
                  Teknologi yang Diterapkan:
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {activeModalProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-lg bg-saluang-sand border-2 border-saluang-dark text-saluang-dark font-mono font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Modal Fixed Footer */}
            <div className="p-3.5 sm:p-5 border-t-2 border-saluang-dark/15 bg-saluang-cream flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto justify-center font-bold text-saluang-dark hover:bg-saluang-sand"
                >
                  Tutup
                </Button>

                {activeModalProject.liveUrl &&
                  activeModalProject.liveUrl !== '#' &&
                  activeModalProject.liveUrl.startsWith('http') && (
                    <Button
                      href={activeModalProject.liveUrl}
                      isExternal
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto justify-center font-bold"
                    >
                      Buka Website Klien ↗
                    </Button>
                  )}
              </div>

              <Button
                href={`/kontak?layanan=${activeModalProject.category}`}
                variant="coral"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto justify-center bg-saluang-coral text-white font-black shadow-neo hover:shadow-neo-md"
              >
                Konsultasikan Proyek Serupa
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
