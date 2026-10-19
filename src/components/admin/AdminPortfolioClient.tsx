'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Star,
  Image as ImageIcon,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { PortfolioProjectModel } from '@/lib/db/schema';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface AdminPortfolioClientProps {
  initialProjects: PortfolioProjectModel[];
}

export function AdminPortfolioClient({ initialProjects }: AdminPortfolioClientProps) {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<PortfolioProjectModel[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProjectModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    clientName: '',
    category: 'website',
    categoryLabel: 'Website Profesional',
    summary: '',
    problem: '',
    solution: '',
    imageUrl: '',
    featured: false,
    completionYear: new Date().getFullYear().toString(),
    liveUrl: '',
    displayOrder: 0,
    resultsInput: '',
    results: [] as string[],
    techStackInput: '',
    techStack: [] as string[],
  });

  const categories = [
    { value: 'website', label: 'Website Profesional' },
    { value: 'web-app', label: 'Web Application & SaaS' },
    { value: 'mobile-app', label: 'Aplikasi Android' },
    { value: 'custom-system', label: 'Software & Sistem Custom' },
  ];

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      clientName: '',
      category: 'website',
      categoryLabel: 'Website Profesional',
      summary: '',
      problem: '',
      solution: '',
      imageUrl: '',
      featured: false,
      completionYear: new Date().getFullYear().toString(),
      liveUrl: '',
      displayOrder: projectsList.length,
      resultsInput: '',
      results: [],
      techStackInput: '',
      techStack: [],
    });
    setEditingProject(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: PortfolioProjectModel) => {
    setEditingProject(project);
    setFormData({
      slug: project.slug,
      title: project.title,
      clientName: project.clientName,
      category: project.category,
      categoryLabel: project.categoryLabel,
      summary: project.summary,
      problem: project.problem,
      solution: project.solution,
      imageUrl: project.imageUrl,
      featured: Boolean(project.featured),
      completionYear: project.completionYear,
      liveUrl: project.liveUrl || '',
      displayOrder: project.displayOrder,
      resultsInput: '',
      results: Array.isArray(project.results) ? project.results : [],
      techStackInput: '',
      techStack: Array.isArray(project.techStack) ? project.techStack : [],
    });
    setIsModalOpen(true);
  };

  const handleAddChip = (field: 'results' | 'techStack', inputField: 'resultsInput' | 'techStackInput') => {
    const val = formData[inputField].trim();
    if (!val) return;
    if (!formData[field].includes(val)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], val],
        [inputField]: '',
      }));
    }
  };

  const handleRemoveChip = (field: 'results' | 'techStack', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      slug: formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      title: formData.title.trim(),
      clientName: formData.clientName.trim(),
      category: formData.category,
      categoryLabel: formData.categoryLabel,
      summary: formData.summary.trim(),
      problem: formData.problem.trim(),
      solution: formData.solution.trim(),
      imageUrl: formData.imageUrl.trim(),
      featured: formData.featured,
      completionYear: formData.completionYear.trim(),
      liveUrl: formData.liveUrl.trim() || null,
      displayOrder: Number(formData.displayOrder) || 0,
      results: formData.results,
      techStack: formData.techStack,
      testimonial: editingProject ? editingProject.testimonial : null,
    };

    try {
      const url = editingProject
        ? `/api/admin/portfolio/${editingProject.id}`
        : '/api/admin/portfolio';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan portofolio');
      }

      setFeedback({
        type: 'success',
        message: editingProject ? 'Proyek portofolio berhasil diperbarui!' : 'Proyek portofolio baru berhasil ditambahkan!',
      });
      setIsModalOpen(false);
      router.refresh();

      // Refresh list lokal
      const updatedRes = await fetch('/api/admin/portfolio');
      const updatedData = await updatedRes.json();
      if (updatedData.data) {
        setProjectsList(updatedData.data);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/portfolio/${deleteId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus');

      setProjectsList((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setFeedback({ type: 'success', message: 'Proyek portofolio berhasil dihapus.' });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus proyek' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Kalkulasi Pagination
  const totalItems = filteredProjects.length;
  const effectivePageSize = pageSize === -1 ? totalItems : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / (effectivePageSize || 1)));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + effectivePageSize, totalItems);
  const paginatedProjects = pageSize === -1 ? filteredProjects : filteredProjects.slice(startIndex, endIndex);

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
      {/* Top Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Portofolio & Studi Kasus
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
            Kelola karya, hasil terukur, dan proyek unggulan yang ditampilkan di galeri publik
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            href="/portofolio"
            isExternal
            leftIcon={<ExternalLink className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center"
          >
            Lihat Portofolio Publik
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center shrink-0"
          >
            Tambah Proyek Baru
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl border-2 flex items-center justify-between shadow-neo-sm ${
            feedback.type === 'success'
              ? 'bg-saluang-teal/20 border-saluang-teal text-saluang-dark'
              : 'bg-saluang-coral/20 border-saluang-coral text-saluang-dark'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-saluang-teal" />
            ) : (
              <AlertCircle className="w-4 h-4 text-saluang-coral" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 mb-6 border-2 border-saluang-dark shadow-neo-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-saluang-dark/50" />
              <input
                type="text"
                placeholder="Cari judul, klien, atau slug..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-lg border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-48 px-3 py-2 text-xs font-bold rounded-lg border-2 border-saluang-dark bg-white focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-bold text-saluang-dark/60">
            Menampilkan {totalItems > 0 ? startIndex + 1 : 0} - {endIndex} dari {totalItems} Proyek
          </span>
        </div>
      </GlassCard>

      {/* Projects Grid View */}
      {filteredProjects.length === 0 ? (
        <GlassCard className="p-12 text-center border-2 border-saluang-dark shadow-neo">
          <p className="text-sm font-bold text-saluang-dark/60">
            Belum ada proyek portofolio yang cocok dengan filter atau pencarian Anda.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => (
            <GlassCard
              key={project.id}
              className="border-2 border-saluang-dark shadow-neo flex flex-col p-0 overflow-hidden hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              {/* Thumbnail Header */}
              <div className="relative h-44 w-full bg-saluang-dark/10 border-b-2 border-saluang-dark overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-saluang-dark/40">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant="teal" size="sm">
                    {project.categoryLabel}
                  </Badge>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase rounded bg-saluang-yellow text-saluang-dark border border-saluang-dark shadow-neo-sm">
                      <Star className="w-3 h-3 fill-saluang-dark" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-saluang-cream/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-saluang-dark text-saluang-dark">
                  {project.completionYear}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-saluang-dark/60 mb-1">
                    <Building className="w-3.5 h-3.5" />
                    <span>{project.clientName}</span>
                  </div>
                  <h3 className="text-base font-black text-saluang-dark line-clamp-2 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-saluang-dark/70 mt-2 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Results preview */}
                  {Array.isArray(project.results) && project.results.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.results.slice(0, 2).map((res, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-saluang-teal/20 text-saluang-dark border border-saluang-teal/40"
                        >
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tech stack */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Array.isArray(project.techStack) &&
                      project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-saluang-sand border border-saluang-dark/20 text-saluang-dark/80"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3.5 border-t border-saluang-dark/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                    {/* Link ke Halaman Portofolio Publik */}
                    <a
                      href={`/portofolio#${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand shadow-neo-xs transition-all cursor-pointer min-w-0 flex-1 overflow-hidden"
                      title={`Buka Halaman Portofolio Publik: /portofolio#${project.slug}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-saluang-dark group-hover/btn:text-saluang-teal transition-colors shrink-0" />
                      <span className="text-[11px] font-mono font-bold text-saluang-dark/80 group-hover/btn:text-saluang-teal group-hover/btn:underline truncate">
                        #{project.slug}
                      </span>
                    </a>

                    {/* Jika ada URL live website eksternal yang valid (bukan '#') */}
                    {project.liveUrl && project.liveUrl !== '#' && project.liveUrl.startsWith('http') && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl border border-saluang-dark/40 bg-saluang-teal/15 hover:bg-saluang-teal hover:text-white text-saluang-dark text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap"
                        title={`Kunjungi Website Asli Klien: ${project.liveUrl}`}
                      >
                        <span>Live</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>

                  {/* Tombol Aksi Edit & Hapus */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(project)}
                      className="p-2 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-teal/20 text-saluang-dark shadow-neo-xs transition-colors cursor-pointer"
                      title="Edit Proyek"
                      aria-label="Edit Proyek"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(project.id)}
                      className="p-2 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-coral/20 text-saluang-coral shadow-neo-xs transition-colors cursor-pointer"
                      title="Hapus Proyek"
                      aria-label="Hapus Proyek"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Pagination Controls Bar */}
      {totalItems > 0 && totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-saluang-cream p-3.5 sm:p-4 rounded-2xl border-2 border-saluang-dark shadow-neo-sm">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-xs font-bold text-saluang-dark">
            <span className="text-saluang-dark/60">Tampilkan per halaman:</span>
            <div className="inline-flex items-center gap-1">
              {[6, 9, 12].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                    pageSize === size
                      ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-xs'
                      : 'bg-white hover:bg-saluang-sand border-saluang-dark/30 text-saluang-dark'
                  }`}
                >
                  {size}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPageSize(-1);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                  pageSize === -1
                    ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-xs'
                    : 'bg-white hover:bg-saluang-sand border-saluang-dark/30 text-saluang-dark'
                }`}
              >
                Semua
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="p-2 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-xs transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Pertama"
              aria-label="Halaman Pertama"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark text-xs font-black shadow-neo-xs transition-all flex items-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Sebelumnya"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  return Math.abs(p - validCurrentPage) <= 1 || p === 1 || p === totalPages;
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="px-1 text-xs font-bold text-saluang-dark/40">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-black border-2 transition-all cursor-pointer flex items-center justify-center ${
                          validCurrentPage === p
                            ? 'bg-saluang-teal text-white border-saluang-dark shadow-neo-xs scale-105'
                            : 'bg-white hover:bg-saluang-sand text-saluang-dark border-saluang-dark/40'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark text-xs font-black shadow-neo-xs transition-all flex items-center gap-1 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Selanjutnya"
              aria-label="Halaman Selanjutnya"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-2 rounded-xl border-2 border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-xs transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Terakhir"
              aria-label="Halaman Terakhir"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL FORM: CREATE / EDIT PROJECT */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-saluang-cream border-2 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-lg p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-xl border-2 border-saluang-dark hover:bg-saluang-sand transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-saluang-dark" />
            </button>

            <div className="mb-6">
              <Badge variant="teal" size="sm" className="mb-2">
                {editingProject ? 'Edit Portofolio' : 'Proyek Baru'}
              </Badge>
              <h3 className="text-xl font-black text-saluang-dark">
                {editingProject ? `Perbarui: ${editingProject.title}` : 'Tambah Studi Kasus Portofolio'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-saluang-dark">
              {/* Row 1: Title & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Judul Studi Kasus *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Portal E-Commerce Toko Minang"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Nama Klien / Perusahaan *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Contoh: PT Minang Jaya Sejahtera"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
              </div>

              {/* Row 2: Slug, Category & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="contoh: portal-ecommerce"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Kategori Layanan *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const sel = categories.find((c) => c.value === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        categoryLabel: sel ? sel.label : e.target.value,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tahun Selesai</label>
                  <input
                    type="text"
                    value={formData.completionYear}
                    onChange={(e) => setFormData({ ...formData, completionYear: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Row 3: Image Upload & Live URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ImageUploadField
                    label="Gambar Thumbnail Proyek"
                    required
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    folder="portfolio"
                    aspectRatio="video"
                    helperText="Pilih foto langsung dari komputer/HP atau gunakan tautan URL online."
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Live URL Demo (Opsional)</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://klien.com"
                      className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none font-semibold"
                    />
                  </div>
                  <div className="p-3 bg-saluang-sand/60 rounded-xl border border-saluang-dark/20 flex items-center justify-between">
                    <div>
                      <span className="block font-black text-saluang-dark">Tampilkan di Beranda (Featured)</span>
                      <span className="text-[11px] text-saluang-dark/60 font-medium">
                        Sorot proyek ini di carousel homepage
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 accent-saluang-teal rounded border-2 border-saluang-dark cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Summary */}
              <div>
                <label className="block mb-1">Ringkasan Proyek *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Ringkasan singkat tentang tujuan dan dampak proyek..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold leading-relaxed"
                />
              </div>

              {/* Row 5: Problem & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Tantangan Klien (Problem) *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Masalah yang dihadapi klien sebelum solusi diterapkan..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none font-semibold leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block mb-1">Solusi yang Diberikan *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Arsitektur, fitur, dan pendekatan rekayasa dari Saluang Teknologi..."
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none font-semibold leading-relaxed"
                  />
                </div>
              </div>

              {/* Row 6: Hasil Terukur (Results Chips) */}
              <div className="bg-saluang-sand/50 p-4 rounded-2xl border border-saluang-dark/20 space-y-2">
                <label className="block font-black">Hasil Terukur (Metrik Dampak)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.resultsInput}
                    onChange={(e) => setFormData({ ...formData, resultsInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChip('results', 'resultsInput');
                      }
                    }}
                    placeholder="Contoh: Efisiensi kerja naik 60%, Load time di bawah 1 detik..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-saluang-dark bg-white text-xs font-semibold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddChip('results', 'resultsInput')}
                  >
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.results.map((res, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-saluang-dark shadow-neo-sm"
                    >
                      <span>✓ {res}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip('results', idx)}
                        className="text-saluang-coral hover:opacity-80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 7: Tech Stack (Chips) */}
              <div className="bg-saluang-sand/50 p-4 rounded-2xl border border-saluang-dark/20 space-y-2">
                <label className="block font-black">Teknologi yang Digunakan (Tech Stack)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.techStackInput}
                    onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChip('techStack', 'techStackInput');
                      }
                    }}
                    placeholder="Contoh: Next.js, Flutter, TiDB..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-saluang-dark bg-white text-xs font-semibold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddChip('techStack', 'techStackInput')}
                  >
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-saluang-dark shadow-neo-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip('techStack', idx)}
                        className="text-saluang-coral hover:opacity-80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t-2 border-saluang-dark/10">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                >
                  {editingProject ? 'Simpan Perubahan' : 'Buat Portofolio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL CONFIRMATION: DELETE */}
      {/* ============================================================ */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-lg p-6">
            <h3 className="text-lg font-black text-saluang-dark mb-2">Hapus Proyek Ini?</h3>
            <p className="text-xs text-saluang-dark/70 mb-6">
              Tindakan ini akan menghapus studi kasus ini secara permanen dari basis data dan tidak lagi tampil di galeri portofolio.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
