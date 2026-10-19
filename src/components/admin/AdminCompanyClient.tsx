'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Share2,
  Check,
  AlertCircle,
  Save,
  Plus,
  X,
  ExternalLink,
  Target,
  FileText,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import type { CompanySettingsModel } from '@/lib/db/schema';

interface AdminCompanyClientProps {
  initialSettings: CompanySettingsModel;
}

export function AdminCompanyClient({ initialSettings }: AdminCompanyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams?.get('tab') as 'profile' | 'vision' | 'contact' | 'address' | 'socials' | 'stats' | null;

  const [activeTab, setActiveTab] = useState<'profile' | 'vision' | 'contact' | 'address' | 'socials' | 'stats'>(
    requestedTab && ['profile', 'vision', 'contact', 'address', 'socials', 'stats'].includes(requestedTab)
      ? requestedTab
      : 'profile'
  );

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['profile', 'vision', 'contact', 'address', 'socials', 'stats'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: initialSettings.name || '',
    legalName: initialSettings.legalName || '',
    tagline: initialSettings.tagline || '',
    shortDescription: initialSettings.shortDescription || '',
    fullDescription: initialSettings.fullDescription || '',
    vision: initialSettings.vision || '',
    mission: Array.isArray(initialSettings.mission) ? initialSettings.mission : [],
    missionInput: '',
    phoneDisplay: initialSettings.phoneDisplay || '',
    phoneWhatsapp: initialSettings.phoneWhatsapp || '',
    email: initialSettings.email || '',
    addressStreet: initialSettings.addressStreet || '',
    addressCity: initialSettings.addressCity || '',
    addressProvince: initialSettings.addressProvince || '',
    addressCountry: initialSettings.addressCountry || 'Indonesia',
    addressPostalCode: initialSettings.addressPostalCode || '',
    socialLinkedin: initialSettings.socialLinkedin || '',
    socialInstagram: initialSettings.socialInstagram || '',
    socialGithub: initialSettings.socialGithub || '',
    stats: Array.isArray(initialSettings.stats) && initialSettings.stats.length > 0
      ? initialSettings.stats
      : [
          { label: 'Proyek Selesai', value: '25', suffix: '+' },
          { label: 'Kepuasan Klien', value: '98', suffix: '%' },
          { label: 'Waktu Uptime', value: '99.9', suffix: '%' },
          { label: 'Respon Pertanyaan', value: '< 24', suffix: ' Jam' },
        ],
  });

  const handleAddMission = () => {
    const val = formData.missionInput.trim();
    if (!val) return;
    if (!formData.mission.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        mission: [...prev.mission, val],
        missionInput: '',
      }));
    }
  };

  const handleRemoveMission = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      mission: prev.mission.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formData.name,
      legalName: formData.legalName,
      tagline: formData.tagline,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      vision: formData.vision,
      mission: formData.mission,
      phoneDisplay: formData.phoneDisplay,
      phoneWhatsapp: formData.phoneWhatsapp,
      email: formData.email,
      addressStreet: formData.addressStreet,
      addressCity: formData.addressCity,
      addressProvince: formData.addressProvince,
      addressCountry: formData.addressCountry,
      addressPostalCode: formData.addressPostalCode,
      socialLinkedin: formData.socialLinkedin,
      socialInstagram: formData.socialInstagram,
      socialGithub: formData.socialGithub,
      stats: formData.stats,
    };

    try {
      const res = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan pengaturan');
      }

      setFeedback({
        type: 'success',
        message: 'Pengaturan profil, kontak & statistik perusahaan berhasil diperbarui di database TiDB!',
      });
      router.refresh();
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Terjadi kesalahan saat menyimpan pengaturan',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Brand', icon: Building },
    { id: 'vision', label: 'Visi & Misi', icon: Target },
    { id: 'contact', label: 'Kontak & WA', icon: Phone },
    { id: 'address', label: 'Alamat Kantor', icon: MapPin },
    { id: 'socials', label: 'Media Sosial', icon: Share2 },
    { id: 'stats', label: 'Statistik Bisnis', icon: BarChart3 },
  ] as const;

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full pb-16">
      {/* Top Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Pengaturan Perusahaan & Kontak
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
            Ubah identitas perusahaan, nomor WhatsApp, email, dan alamat kantor tanpa menyentuh kode
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            href="/kontak"
            isExternal
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            className="w-full sm:w-auto justify-center"
          >
            Lihat Halaman Kontak
          </Button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`mb-6 p-3.5 sm:p-4 rounded-xl border-2 flex items-center justify-between shadow-neo-sm ${
            feedback.type === 'success'
              ? 'bg-saluang-teal/20 border-saluang-teal text-saluang-dark'
              : 'bg-saluang-coral/20 border-saluang-coral text-saluang-dark'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-saluang-teal shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-saluang-coral shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Nav Buttons - Horizontal Swipe on Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 shrink-0 transition-all shadow-neo-xs cursor-pointer ${
                active
                  ? 'bg-saluang-dark text-saluang-cream border-saluang-dark translate-x-0.5 translate-y-0.5'
                  : 'bg-saluang-cream text-saluang-dark border-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <GlassCard className="p-4 sm:p-6 md:p-8 border-2 border-saluang-dark shadow-neo space-y-6 text-xs font-bold text-saluang-dark">
          {/* TAB 1: PROFIL BRAND */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/10 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-saluang-teal" />
                <span>Identitas & Profil Brand</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nama Brand Umum *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
                <div>
                  <label className="block mb-1">Nama Legal Entitas Usaha *</label>
                  <input
                    type="text"
                    required
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Tagline Utama Perusahaan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div>
                <label className="block mb-1">Deskripsi Singkat (Footer & Meta Tag)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 leading-relaxed"
                />
              </div>

              <div>
                <label className="block mb-1">Deskripsi Lengkap (Halaman Tentang Kami)</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: VISI & MISI */}
          {activeTab === 'vision' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/10 pb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-saluang-teal" />
                <span>Visi & Misi Strategis</span>
              </h2>

              <div>
                <label className="block mb-1">Pernyataan Visi Perusahaan *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 leading-relaxed"
                />
              </div>

              <div className="bg-saluang-sand/50 p-4 rounded-2xl border border-saluang-dark/20 space-y-3">
                <label className="block font-black">Poin-Poin Misi Perusahaan</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.missionInput}
                    onChange={(e) => setFormData({ ...formData, missionInput: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMission();
                      }
                    }}
                    placeholder="Tulis butir misi baru lalu tekan Tambah..."
                    className="flex-1 px-3 py-2 rounded-xl border border-saluang-dark bg-white text-xs font-semibold"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMission}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Tambah
                  </Button>
                </div>

                <div className="space-y-2 pt-2">
                  {formData.mission.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-3 bg-white rounded-xl border border-saluang-dark shadow-neo-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-saluang-dark text-saluang-cream flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-semibold text-xs text-saluang-dark leading-relaxed">
                          {item}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMission(idx)}
                        className="p-1 rounded text-saluang-coral hover:bg-saluang-coral/10 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KONTAK & WHATSAPP */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/10 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-saluang-teal" />
                  <span>Saluran Komunikasi & Kontak Resmi</span>
                </span>
                <span className="text-[11px] font-bold text-saluang-teal bg-saluang-teal/10 px-2.5 py-0.5 rounded-full border border-saluang-teal/30">
                  Sinkron Otomatis ke Seluruh Situs
                </span>
              </h2>

              {/* Alert Tips */}
              <div className="p-3.5 rounded-xl bg-saluang-sand/80 border-2 border-saluang-dark/20 text-xs font-semibold text-saluang-dark space-y-1">
                <p className="font-black text-saluang-coral flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  Perubahan Langsung Aktif di Seluruh Website:
                </p>
                <p className="text-[11px] text-saluang-dark/80 leading-relaxed">
                  Mengubah nomor WhatsApp dan Email di tab ini akan langsung memperbarui tombol <strong>Floating WhatsApp</strong> (pojok kanan bawah), tombol CTA Beranda, tombol konsultasi WhatsApp di Detail Layanan, Footer situs, dan Halaman Kontak.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Nomor WhatsApp Resmi (Format: 62812xxx) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneWhatsapp}
                    onChange={(e) => setFormData({ ...formData, phoneWhatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="Contoh: 6281234567890"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                  <span className="text-[10px] text-saluang-dark/60 mt-1 block">
                    Gunakan kode negara 62 tanpa tanda + atau spasi (contoh: <code>6281234567890</code>).
                  </span>
                </div>
                <div>
                  <label className="block mb-1">Nomor Telepon Tampilan Publik *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneDisplay}
                    onChange={(e) => setFormData({ ...formData, phoneDisplay: e.target.value })}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                  <span className="text-[10px] text-saluang-dark/60 mt-1 block">
                    Teks nomor telepon yang ditampilkan di teks footer & header.
                  </span>
                </div>
              </div>

              <div>
                <label className="block mb-1">Alamat Email Resmi Perusahaan *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="kontak@saluangteknologi.com"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
                <span className="text-[10px] text-saluang-dark/60 mt-1 block">
                  Email yang tercantum di halaman kontak dan footer website.
                </span>
              </div>

              {/* Live WhatsApp Test Box */}
              <div className="p-4 rounded-2xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-saluang-dark/60">
                    Pratinjau Tautan WhatsApp
                  </span>
                  <p className="font-mono text-xs font-black text-saluang-coral break-all">
                    https://wa.me/{formData.phoneWhatsapp || '628...'}
                  </p>
                </div>
                {formData.phoneWhatsapp && (
                  <a
                    href={`https://wa.me/${formData.phoneWhatsapp}?text=${encodeURIComponent('Halo Saluang Teknologi, tes pesan dari panel admin.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border-2 border-saluang-dark shadow-neo-xs transition-all active:translate-x-0.5 active:translate-y-0.5 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Uji Buka Chat WA</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ALAMAT KANTOR */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/10 pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-saluang-teal" />
                <span>Alamat Kantor Operasional</span>
              </h2>

              <div>
                <label className="block mb-1">Nama Jalan & Nomor Gedung *</label>
                <input
                  type="text"
                  required
                  value={formData.addressStreet}
                  onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                  placeholder="Jl. Pendreh No. 1"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Kota / Kabupaten *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressCity}
                    onChange={(e) => setFormData({ ...formData, addressCity: e.target.value })}
                    placeholder="Muara Teweh"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
                <div>
                  <label className="block mb-1">Provinsi *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressProvince}
                    onChange={(e) => setFormData({ ...formData, addressProvince: e.target.value })}
                    placeholder="Kalimantan Tengah"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Negara *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressCountry}
                    onChange={(e) => setFormData({ ...formData, addressCountry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
                <div>
                  <label className="block mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.addressPostalCode}
                    onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                    placeholder="73811"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA SOSIAL */}
          {activeTab === 'socials' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-saluang-dark border-b-2 border-saluang-dark/10 pb-2 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-saluang-teal" />
                <span>Tautan Profil Media Sosial</span>
              </h2>

              <div>
                <label className="block mb-1">LinkedIn Company URL</label>
                <input
                  type="url"
                  value={formData.socialLinkedin}
                  onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/saluang-teknologi"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div>
                <label className="block mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.socialInstagram}
                  onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                  placeholder="https://instagram.com/saluangteknologi"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div>
                <label className="block mb-1">GitHub Organization URL</label>
                <input
                  type="url"
                  value={formData.socialGithub}
                  onChange={(e) => setFormData({ ...formData, socialGithub: e.target.value })}
                  placeholder="https://github.com/saluang-teknologi"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>
            </div>
          )}

          {/* TAB 6: STATISTIK BISNIS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="border-b-2 border-saluang-dark/10 pb-2 flex items-center justify-between">
                <h2 className="text-base font-black text-saluang-dark flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-saluang-teal" />
                  <span>Statistik & Metrik Bisnis Utama</span>
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      stats: [...prev.stats, { label: 'Metrik Baru', value: '100', suffix: '+' }],
                    }));
                  }}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Tambah Metrik
                </Button>
              </div>

              <p className="text-[11px] text-saluang-dark/70 font-medium">
                Metrik ini ditampilkan di banner keunggulan beranda (Homepage) untuk membangun kredibilitas dan kepercayaan calon klien.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {formData.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-saluang-sand border border-saluang-dark/30">
                        Metrik #{idx + 1}
                      </span>
                      {formData.stats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              stats: prev.stats.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1 rounded text-saluang-coral hover:bg-saluang-coral/10"
                          title="Hapus metrik"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 text-[11px]">Label Metrik *</label>
                      <input
                        type="text"
                        required
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...formData.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setFormData({ ...formData, stats: updated });
                        }}
                        placeholder="Contoh: Proyek Selesai"
                        className="w-full px-3 py-2 rounded-xl border border-saluang-dark bg-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block mb-1 text-[11px]">Nilai / Angka *</label>
                        <input
                          type="text"
                          required
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...formData.stats];
                            updated[idx] = { ...updated[idx], value: e.target.value };
                            setFormData({ ...formData, stats: updated });
                          }}
                          placeholder="25"
                          className="w-full px-3 py-2 rounded-xl border border-saluang-dark bg-white font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px]">Akhiran / Satuan</label>
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={(e) => {
                            const updated = [...formData.stats];
                            updated[idx] = { ...updated[idx], suffix: e.target.value };
                            setFormData({ ...formData, stats: updated });
                          }}
                          placeholder="+, %, Jam"
                          className="w-full px-3 py-2 rounded-xl border border-saluang-dark bg-white font-mono font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                        />
                      </div>
                    </div>

                    {/* Live Preview of Stat */}
                    <div className="pt-2 border-t border-saluang-dark/10 text-center bg-saluang-cream/50 rounded-xl p-2">
                      <div className="text-xl font-black font-mono text-saluang-dark">
                        {stat.value || '0'}
                        <span className="text-saluang-coral">{stat.suffix || ''}</span>
                      </div>
                      <div className="text-[10px] uppercase font-bold text-saluang-dark/70 tracking-wider">
                        {stat.label || 'Label'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t-2 border-saluang-dark/10 flex items-center justify-between">
            <span className="text-[11px] text-saluang-dark/50 font-bold">
              Data tersimpan langsung ke basis data TiDB Cloud
            </span>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Perubahan
            </Button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
