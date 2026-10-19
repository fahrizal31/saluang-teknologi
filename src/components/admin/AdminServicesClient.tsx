'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Code,
  Globe,
  Database,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { ServiceModel } from '@/lib/db/schema';

interface AdminServicesClientProps {
  initialServices: ServiceModel[];
}

export function AdminServicesClient({ initialServices }: AdminServicesClientProps) {
  const router = useRouter();
  const [servicesList, setServicesList] = useState<ServiceModel[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    shortTitle: '',
    subtitle: '',
    tagline: '',
    heroDescription: '',
    iconName: 'Globe',
    badge: 'Solusi Unggulan',
    accentColor: 'teal',
    displayOrder: 0,
    featuresInput: '',
    features: [] as string[],
    problemsInput: '',
    problemsSolved: [] as string[],
    techStackInput: '',
    techStack: [] as string[],
  });

  const availableIcons = ['Globe', 'Database', 'Smartphone', 'Cpu', 'Layers', 'Code'];
  const availableColors = ['teal', 'coral', 'yellow', 'purple', 'blue'];

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      shortTitle: '',
      subtitle: '',
      tagline: '',
      heroDescription: '',
      iconName: 'Globe',
      badge: 'Solusi Unggulan',
      accentColor: 'teal',
      displayOrder: servicesList.length,
      featuresInput: '',
      features: [],
      problemsInput: '',
      problemsSolved: [],
      techStackInput: '',
      techStack: [],
    });
    setEditingService(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceModel) => {
    setEditingService(service);
    setFormData({
      slug: service.slug,
      title: service.title,
      shortTitle: service.shortTitle,
      subtitle: service.subtitle,
      tagline: service.tagline,
      heroDescription: service.heroDescription,
      iconName: service.iconName,
      badge: service.badge,
      accentColor: service.accentColor,
      displayOrder: service.displayOrder,
      featuresInput: '',
      features: Array.isArray(service.features) ? service.features : [],
      problemsInput: '',
      problemsSolved: Array.isArray(service.problemsSolved) ? service.problemsSolved : [],
      techStackInput: '',
      techStack: Array.isArray(service.techStack) ? service.techStack : [],
    });
    setIsModalOpen(true);
  };

  const handleAddChip = (field: 'features' | 'problemsSolved' | 'techStack', inputField: 'featuresInput' | 'problemsInput' | 'techStackInput') => {
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

  const handleRemoveChip = (field: 'features' | 'problemsSolved' | 'techStack', index: number) => {
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
      shortTitle: formData.shortTitle.trim(),
      subtitle: formData.subtitle.trim(),
      tagline: formData.tagline.trim(),
      heroDescription: formData.heroDescription.trim(),
      iconName: formData.iconName,
      badge: formData.badge.trim(),
      accentColor: formData.accentColor,
      displayOrder: Number(formData.displayOrder) || 0,
      features: formData.features,
      problemsSolved: formData.problemsSolved,
      techStack: formData.techStack,
      deliverables: editingService ? editingService.deliverables : [],
      workflow: editingService ? editingService.workflow : [],
    };

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan layanan');
      }

      setFeedback({ type: 'success', message: editingService ? 'Layanan berhasil diperbarui!' : 'Layanan baru berhasil dibuat!' });
      setIsModalOpen(false);
      router.refresh();

      // Refresh list lokal
      const updatedRes = await fetch('/api/admin/services');
      const updatedData = await updatedRes.json();
      if (updatedData.data) {
        setServicesList(updatedData.data);
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
      const res = await fetch(`/api/admin/services/${deleteId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus');

      setServicesList((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
      setFeedback({ type: 'success', message: 'Layanan berhasil dihapus.' });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus layanan' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = servicesList.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
      {/* Top Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Katalog Layanan Digital
          </h1>
          <p className="text-xs md:text-sm text-saluang-dark/70 mt-1">
            Kelola paket solusi, fitur unggulan, dan alur kerja yang ditampilkan di halaman publik
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            href="/layanan"
            isExternal
            leftIcon={<ExternalLink className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center"
          >
            Lihat Layanan Publik
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center shrink-0"
          >
            Tambah Layanan Baru
          </Button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
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

      {/* Filter and Search */}
      <GlassCard className="p-4 mb-6 border-2 border-saluang-dark shadow-neo-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-saluang-dark/50" />
            <input
              type="text"
              placeholder="Cari nama layanan atau slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-lg border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
            />
          </div>
          <span className="text-xs font-bold text-saluang-dark/60">
            Menampilkan {filteredServices.length} dari {servicesList.length} Layanan
          </span>
        </div>
      </GlassCard>

      {/* ============================================================ */}
      {/* 1. MOBILE CARD VIEW (Khusus Layar Ponsel: block md:hidden) */}
      {/* ============================================================ */}
      <div className="block md:hidden space-y-3 mb-8">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center text-saluang-dark/60 font-semibold text-xs bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-sm">
            Belum ada data layanan yang sesuai pencarian.
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-4 bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-3 text-saluang-dark"
            >
              {/* Header: Icon, Title & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-saluang-dark text-saluang-cream flex items-center justify-center font-bold text-xs shrink-0 border border-saluang-dark">
                    {service.iconName === 'Smartphone' ? (
                      <Smartphone className="w-4 h-4 text-saluang-teal" />
                    ) : service.iconName === 'Database' ? (
                      <Database className="w-4 h-4 text-saluang-teal" />
                    ) : service.iconName === 'Cpu' ? (
                      <Cpu className="w-4 h-4 text-saluang-teal" />
                    ) : (
                      <Globe className="w-4 h-4 text-saluang-teal" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-saluang-dark leading-tight truncate">
                      {service.title}
                    </p>
                    <a
                      href={`/layanan/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-saluang-teal hover:underline font-mono mt-0.5 truncate inline-flex items-center gap-1 group/link"
                      title="Buka Halaman Layanan Publik"
                    >
                      <span>/layanan/{service.slug}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-saluang-dark/50 group-hover/link:text-saluang-teal shrink-0" />
                    </a>
                  </div>
                </div>

                <Badge variant="teal" size="sm" className="shrink-0 text-[10px]">
                  {service.badge}
                </Badge>
              </div>

              {/* Subtitle & Tagline */}
              <p className="text-xs text-saluang-dark/80 line-clamp-2 font-medium">
                {service.subtitle}
              </p>

              {/* Modules & Tech Stack */}
              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-saluang-dark/10">
                <span className="text-[10px] font-bold text-saluang-dark/60 mr-1">Stack:</span>
                {Array.isArray(service.techStack) &&
                  service.techStack.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-saluang-sand border border-saluang-dark/20"
                    >
                      {t}
                    </span>
                  ))}
                {Array.isArray(service.techStack) && service.techStack.length > 3 && (
                  <span className="text-[10px] text-saluang-dark/50 font-bold">
                    +{service.techStack.length - 3}
                  </span>
                )}
                <span className="ml-auto text-[10px] font-bold text-saluang-teal bg-saluang-teal/10 px-2 py-0.5 rounded border border-saluang-teal/30">
                  {Array.isArray(service.features) ? service.features.length : 0} modul
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-saluang-dark/10">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(service)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-saluang-sand hover:bg-saluang-teal hover:text-white text-saluang-dark font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Layanan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(service.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-saluang-coral hover:text-white text-saluang-coral font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP TABLE VIEW (Khusus Layar Desktop: hidden md:block) */}
      {/* ============================================================ */}
      <GlassCard className="hidden md:block border-2 border-saluang-dark shadow-neo overflow-hidden p-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-saluang-cream border-b-2 border-saluang-dark font-black text-saluang-dark">
                <th className="py-3 px-4 w-12 text-center">Urutan</th>
                <th className="py-3 px-4">Layanan</th>
                <th className="py-3 px-4">Slug & URL</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Fitur</th>
                <th className="py-3 px-4">Tech Stack</th>
                <th className="py-3 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-saluang-dark/10 font-medium">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-saluang-dark/60 font-semibold">
                    Belum ada data layanan yang sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-saluang-sand/30 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {service.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-saluang-dark text-saluang-cream flex items-center justify-center font-bold text-xs shrink-0">
                          {service.iconName === 'Smartphone' ? (
                            <Smartphone className="w-4 h-4 text-saluang-teal" />
                          ) : service.iconName === 'Database' ? (
                            <Database className="w-4 h-4 text-saluang-teal" />
                          ) : service.iconName === 'Cpu' ? (
                            <Cpu className="w-4 h-4 text-saluang-teal" />
                          ) : (
                            <Globe className="w-4 h-4 text-saluang-teal" />
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-saluang-dark">{service.title}</p>
                          <p className="text-[11px] text-saluang-dark/60">{service.shortTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <a
                        href={`/layanan/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-saluang-teal hover:underline group/link"
                        title="Buka Halaman Layanan Publik"
                      >
                        <span>/layanan/{service.slug}</span>
                        <ExternalLink className="w-3 h-3 text-saluang-dark/40 group-hover/link:text-saluang-teal" />
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="teal" size="sm">
                        {service.badge}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-saluang-dark/70">
                      {Array.isArray(service.features) ? service.features.length : 0} modul
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(service.techStack) &&
                          service.techStack.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-saluang-sand border border-saluang-dark/20"
                            >
                              {t}
                            </span>
                          ))}
                        {Array.isArray(service.techStack) && service.techStack.length > 3 && (
                          <span className="text-[10px] text-saluang-dark/50 font-bold">
                            +{service.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-teal/20 text-saluang-dark transition-colors shadow-neo-sm cursor-pointer"
                          title="Edit Layanan"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(service.id)}
                          className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-coral/20 text-saluang-coral transition-colors shadow-neo-sm cursor-pointer"
                          title="Hapus Layanan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ============================================================ */}
      {/* MODAL FORM: CREATE / EDIT SERVICE */}
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
                {editingService ? 'Edit Layanan' : 'Layanan Baru'}
              </Badge>
              <h3 className="text-xl font-black text-saluang-dark">
                {editingService ? `Perbarui: ${editingService.title}` : 'Buat Katalog Layanan Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-saluang-dark">
              {/* Row 1: Title & ShortTitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Judul Layanan Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Pembuatan Website Profesional"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Judul Singkat *</label>
                  <input
                    type="text"
                    required
                    value={formData.shortTitle}
                    onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                    placeholder="Contoh: Website Profil"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
              </div>

              {/* Row 2: Slug & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Slug URL (tanpa spasi) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="contoh: website-modern"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Badge Teks</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Populer / Enterprise"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
              </div>

              {/* Row 3: Subtitle & Tagline */}
              <div>
                <label className="block mb-1">Sub-judul / Tagline Singkat *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Website berkecepatan tinggi dengan optimasi SEO kelas dunia..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                />
              </div>

              {/* Row 4: Hero Description */}
              <div>
                <label className="block mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.heroDescription}
                  onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                  placeholder="Penjelasan detail tentang cakupan dan keunggulan solusi ini..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold leading-relaxed"
                />
              </div>

              {/* Row 5: Icon & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Pilihan Ikon</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Warna Aksen</label>
                  <select
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  >
                    {availableColors.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Fitur Unggulan (Chip Input) */}
              <div className="bg-saluang-sand/50 p-4 rounded-2xl border border-saluang-dark/20 space-y-2">
                <label className="block font-black">Daftar Fitur Unggulan</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.featuresInput}
                    onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChip('features', 'featuresInput');
                      }
                    }}
                    placeholder="Ketik fitur lalu tekan Enter atau tombol Tambah..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-saluang-dark bg-white text-xs font-semibold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddChip('features', 'featuresInput')}
                  >
                    Tambah
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-saluang-dark shadow-neo-sm"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChip('features', idx)}
                        className="text-saluang-coral hover:opacity-80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Row 7: Tech Stack (Chip Input) */}
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
                    placeholder="Contoh: Next.js, TypeScript, PostgreSQL..."
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
                  {editingService ? 'Simpan Perubahan' : 'Buat Layanan'}
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
            <h3 className="text-lg font-black text-saluang-dark mb-2">Hapus Layanan Ini?</h3>
            <p className="text-xs text-saluang-dark/70 mb-6">
              Tindakan ini akan menghapus layanan secara permanen dari basis data dan halaman publik tidak akan lagi menampilkan solusi ini.
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
