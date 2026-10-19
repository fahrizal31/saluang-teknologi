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
  Send,
  Bot,
  Power,
  RefreshCw,
  Copy,
  Trash2,
  Users,
  User,
  HelpCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { CompanySettingsModel } from '@/lib/db/schema';

export interface TelegramRecipientItem {
  id: string;
  label: string;
}

export function parseInitialRecipients(raw: string | null | undefined): TelegramRecipientItem[] {
  if (!raw || !raw.trim()) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item && (typeof item === 'string' || typeof item?.id === 'string'))
          .map((item, idx) => {
            if (typeof item === 'string') {
              return { id: item.trim(), label: `Penerima ${idx + 1}` };
            }
            return {
              id: String(item.id).trim(),
              label: item.label ? String(item.label).trim() : `Penerima ${idx + 1}`,
            };
          });
      }
    } catch {
      // fallback
    }
  }
  return trimmed
    .split(/[\s,;]+/)
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id, idx) => ({
      id,
      label: idx === 0 ? 'Admin Utama' : `Penerima ${idx + 1}`,
    }));
}

interface AdminCompanyClientProps {
  initialSettings: CompanySettingsModel;
}

export function AdminCompanyClient({ initialSettings }: AdminCompanyClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams?.get('tab') as 'profile' | 'vision' | 'contact' | 'address' | 'socials' | 'stats' | 'telegram' | null;

  const [activeTab, setActiveTab] = useState<'profile' | 'vision' | 'contact' | 'address' | 'socials' | 'stats' | 'telegram'>(
    requestedTab && ['profile', 'vision', 'contact', 'address', 'socials', 'stats', 'telegram'].includes(requestedTab)
      ? requestedTab
      : 'profile'
  );

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['profile', 'vision', 'contact', 'address', 'socials', 'stats', 'telegram'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [testingTargetId, setTestingTargetId] = useState<string | null>(null);
  const [telegramTestFeedback, setTelegramTestFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    details?: Array<{ chatId: string; ok: boolean; error?: string }>;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Telegram Bot Management States
  const [recipients, setRecipients] = useState<TelegramRecipientItem[]>(() => {
    return parseInitialRecipients((initialSettings as any).telegramChatId);
  });
  const [newChatId, setNewChatId] = useState('');
  const [newChatLabel, setNewChatLabel] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real-time Bot Inspector State
  const [botInfo, setBotInfo] = useState<{
    id: number;
    firstName: string;
    username: string;
    link: string;
    canJoinGroups?: boolean;
  } | null>(null);
  const [isCheckingBot, setIsCheckingBot] = useState(false);
  const [botCheckFeedback, setBotCheckFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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
    telegramBotToken: (initialSettings as any).telegramBotToken || '',
    telegramChatId: (initialSettings as any).telegramChatId || '',
    telegramEnabled: (initialSettings as any).telegramEnabled ?? true,
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

  const handleCheckBot = async (tokenToCheck?: string) => {
    const token = (tokenToCheck || formData.telegramBotToken || '').trim();
    if (!token) {
      setBotCheckFeedback({
        type: 'error',
        message: 'Token Bot Telegram belum diisi. Masukkan token bot terlebih dahulu.',
      });
      return;
    }

    setIsCheckingBot(true);
    setBotCheckFeedback(null);
    try {
      const res = await fetch('/api/admin/telegram/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || 'Gagal memeriksa bot Telegram');
      }
      setBotInfo(result.bot);
      setBotCheckFeedback({
        type: 'success',
        message: `Koneksi Bot Valid! Terhubung ke @${result.bot.username} (${result.bot.firstName}).`,
      });
    } catch (err: any) {
      setBotInfo(null);
      setBotCheckFeedback({
        type: 'error',
        message: err.message || 'Token tidak valid atau bot tidak ditemukan di Telegram.',
      });
    } finally {
      setIsCheckingBot(false);
    }
  };

  const handleAddRecipient = () => {
    const trimmedId = newChatId.trim();
    if (!trimmedId) return;

    if (recipients.some((r) => r.id === trimmedId)) {
      setTelegramTestFeedback({
        type: 'error',
        message: `ID ${trimmedId} sudah ada di dalam daftar penerima.`,
      });
      return;
    }

    const updated = [
      ...recipients,
      {
        id: trimmedId,
        label: newChatLabel.trim() || (trimmedId.startsWith('-') ? 'Grup Telegram' : 'Admin Akun'),
      },
    ];

    setRecipients(updated);
    setFormData((prev) => ({
      ...prev,
      telegramChatId: JSON.stringify(updated),
    }));
    setNewChatId('');
    setNewChatLabel('');
  };

  const handleRemoveRecipient = (idToRemove: string) => {
    const updated = recipients.filter((r) => r.id !== idToRemove);
    setRecipients(updated);
    setFormData((prev) => ({
      ...prev,
      telegramChatId: updated.length > 0 ? JSON.stringify(updated) : '',
    }));
  };

  const handleCopy = (text: string, idKey?: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (idKey) {
        setCopiedId(idKey);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  // Auto check bot on mount if token exists
  useEffect(() => {
    if (initialSettings.telegramBotToken) {
      handleCheckBot(initialSettings.telegramBotToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
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
      telegramBotToken: formData.telegramBotToken,
      telegramChatId: formData.telegramChatId,
      telegramEnabled: formData.telegramEnabled,
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
        message: 'Pengaturan profil, kontak, media sosial & Telegram bot berhasil diperbarui di database TiDB!',
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

  const handleTestTelegram = async (targetId?: string) => {
    setIsTestingTelegram(true);
    setTestingTargetId(targetId || null);
    setTelegramTestFeedback(null);
    try {
      const res = await fetch('/api/admin/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: formData.telegramBotToken,
          chatId: targetId || formData.telegramChatId,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || 'Gagal mengirim pesan tes');
      }
      setTelegramTestFeedback({
        type: 'success',
        message: result.message || 'Pesan tes berhasil dikirim! Silakan periksa aplikasi Telegram Anda.',
        details: result.results,
      });
    } catch (err: any) {
      setTelegramTestFeedback({
        type: 'error',
        message: err.message || 'Terjadi kesalahan saat menguji notifikasi Telegram.',
      });
    } finally {
      setIsTestingTelegram(false);
      setTestingTargetId(null);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Brand', icon: Building },
    { id: 'vision', label: 'Visi & Misi', icon: Target },
    { id: 'contact', label: 'Kontak & WA', icon: Phone },
    { id: 'address', label: 'Alamat Kantor', icon: MapPin },
    { id: 'socials', label: 'Media Sosial', icon: Share2 },
    { id: 'stats', label: 'Statistik Bisnis', icon: BarChart3 },
    { id: 'telegram', label: 'Telegram Bot', icon: Bot },
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

          {/* TAB 7: TELEGRAM BOT MANAGEMENT */}
          {activeTab === 'telegram' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Quick Save */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b-2 border-saluang-dark/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-saluang-teal/20 border-2 border-saluang-dark rounded-2xl text-saluang-dark shadow-neo-sm">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-saluang-dark">
                      Manajemen Token & ID Bot Telegram
                    </h3>
                    <p className="text-xs text-saluang-dark/70 mt-0.5">
                      Kelola token bot pengirim, daftar penerima permohonan proyek, dan saklar notifikasi otomatis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => handleSubmit()}
                    isLoading={isSubmitting}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    Simpan Pengaturan
                  </Button>
                </div>
              </div>

              {/* Master Switch Card */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-saluang-dark shadow-neo-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-3 rounded-2xl border-2 border-saluang-dark shrink-0 transition-colors ${
                      formData.telegramEnabled
                        ? 'bg-saluang-teal text-saluang-dark'
                        : 'bg-saluang-coral/20 text-saluang-coral'
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm text-saluang-dark">
                        Status Pengiriman Notifikasi Telegram
                      </span>
                      <span
                        className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border border-saluang-dark ${
                          formData.telegramEnabled
                            ? 'bg-saluang-teal/30 text-saluang-dark'
                            : 'bg-saluang-coral/20 text-saluang-coral'
                        }`}
                      >
                        {formData.telegramEnabled ? '🟢 Aktif' : '🔴 Nonaktif'}
                      </span>
                    </div>
                    <p className="text-xs text-saluang-dark/70 mt-1 leading-relaxed">
                      {formData.telegramEnabled
                        ? 'Bot aktif mengirimkan rincian permohonan proyek baru ke seluruh Chat ID terdaftar secara instan.'
                        : 'Notifikasi Telegram dihentikan sementara. Data permohonan klien tetap tersimpan aman di basis data.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      telegramEnabled: !prev.telegramEnabled,
                    }))
                  }
                  className={`px-4 py-2.5 rounded-xl border-2 border-saluang-dark font-black text-xs transition-all shadow-neo-sm shrink-0 flex items-center gap-2 ${
                    formData.telegramEnabled
                      ? 'bg-saluang-coral/20 hover:bg-saluang-coral hover:text-white text-saluang-dark'
                      : 'bg-saluang-teal hover:opacity-90 text-saluang-dark'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {formData.telegramEnabled ? 'Matikan Notifikasi' : 'Aktifkan Notifikasi'}
                </button>
              </div>

              {/* SECTION 1: KREDENSIAL BOT */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-saluang-dark/10">
                  <div>
                    <h4 className="text-sm font-black text-saluang-dark flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-saluang-teal" />
                      1. Token Rahasia Bot (@BotFather)
                    </h4>
                    <p className="text-[11px] text-saluang-dark/60 mt-0.5">
                      Token otentikasi bot yang didapatkan saat Anda membuat bot di Telegram melalui @BotFather
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckBot()}
                    isLoading={isCheckingBot}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    className="shrink-0"
                  >
                    Periksa Status Token
                  </Button>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={formData.telegramBotToken}
                      onChange={(e) =>
                        setFormData({ ...formData, telegramBotToken: e.target.value })
                      }
                      placeholder="Contoh: 8817701248:AAEtvoTTsZzIZby7VTR1MpQEW-ais23NgVc"
                      className="w-full pl-4 pr-24 py-2.5 rounded-xl border-2 border-saluang-dark bg-white font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal shadow-neo-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="p-1.5 rounded-lg text-saluang-dark/60 hover:text-saluang-dark hover:bg-saluang-sand/50"
                        title={showToken ? 'Sembunyikan token' : 'Lihat token'}
                      >
                        {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {formData.telegramBotToken && (
                        <button
                          type="button"
                          onClick={() => handleCopy(formData.telegramBotToken, 'token')}
                          className="p-1.5 rounded-lg text-saluang-dark/60 hover:text-saluang-dark hover:bg-saluang-sand/50"
                          title="Salin token"
                        >
                          {copiedId === 'token' ? (
                            <Check className="w-3.5 h-3.5 text-saluang-teal" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bot Check Feedback */}
                {botCheckFeedback && (
                  <div
                    className={`p-3 rounded-xl border-2 flex items-center justify-between text-xs font-bold ${
                      botCheckFeedback.type === 'success'
                        ? 'bg-saluang-teal/20 border-saluang-teal text-saluang-dark'
                        : 'bg-saluang-coral/20 border-saluang-coral text-saluang-dark'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {botCheckFeedback.type === 'success' ? (
                        <Check className="w-4 h-4 text-saluang-teal shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-saluang-coral shrink-0" />
                      )}
                      <span>{botCheckFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBotCheckFeedback(null)}
                      className="p-1 hover:opacity-70"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bot Verified Card */}
                {botInfo && (
                  <div className="p-4 bg-saluang-teal/10 rounded-2xl border-2 border-saluang-teal/50 shadow-neo-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-saluang-teal/30 border-2 border-saluang-dark flex items-center justify-center font-black text-saluang-dark text-sm shrink-0">
                        🤖
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-saluang-dark">
                            {botInfo.firstName}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-saluang-dark/70">
                            @{botInfo.username}
                          </span>
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-saluang-teal text-saluang-dark border border-saluang-dark">
                            Online
                          </span>
                        </div>
                        <p className="text-[11px] text-saluang-dark/60 mt-0.5 font-mono">
                          Bot ID: #{botInfo.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        href={botInfo.link}
                        isExternal
                        leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        className="bg-white"
                      >
                        Buka di Telegram
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(botInfo.link)}
                        leftIcon={
                          copiedLink ? (
                            <Check className="w-3.5 h-3.5 text-saluang-teal" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {copiedLink ? 'Link Tersalin!' : 'Salin Link'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: DAFTAR CHAT ID PENERIMA NOTIFIKASI */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-saluang-dark/10">
                  <div>
                    <h4 className="text-sm font-black text-saluang-dark flex items-center gap-2">
                      <Users className="w-4 h-4 text-saluang-teal" />
                      2. Daftar Penerima Notifikasi (Chat ID / Group ID)
                    </h4>
                    <p className="text-[11px] text-saluang-dark/60 mt-0.5">
                      Bisa diisi Chat ID akun pribadi atau ID grup/channel admin (mendukung banyak penerima sekaligus)
                    </p>
                  </div>
                  {recipients.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleTestTelegram()}
                      isLoading={isTestingTelegram && !testingTargetId}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      className="shrink-0"
                    >
                      Uji Kirim ke Semua Penerima ({recipients.length})
                    </Button>
                  )}
                </div>

                {/* Recipient Cards / Table */}
                {recipients.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border-2 border-dashed border-saluang-dark/30 bg-saluang-cream/50 space-y-2">
                    <p className="text-xs font-bold text-saluang-dark/70">
                      Belum ada Chat ID penerima yang terdaftar.
                    </p>
                    <p className="text-[11px] text-saluang-dark/50">
                      Gunakan formulir di bawah untuk menambahkan akun Telegram atau grup Anda.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recipients.map((rec, idx) => {
                      const isGroup = rec.id.startsWith('-');
                      const isCurrentlyTesting = isTestingTelegram && testingTargetId === rec.id;

                      return (
                        <div
                          key={rec.id + idx}
                          className="p-3.5 bg-saluang-cream/40 rounded-xl border-2 border-saluang-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-neo-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl border-2 border-saluang-dark bg-white flex items-center justify-center shrink-0">
                              {isGroup ? (
                                <Users className="w-4 h-4 text-saluang-dark" />
                              ) : (
                                <User className="w-4 h-4 text-saluang-dark" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-xs text-saluang-dark">
                                  {rec.label || `Penerima #${idx + 1}`}
                                </span>
                                <span
                                  className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border border-saluang-dark ${
                                    isGroup
                                      ? 'bg-saluang-coral/20 text-saluang-dark'
                                      : 'bg-saluang-teal/20 text-saluang-dark'
                                  }`}
                                >
                                  {isGroup ? '👥 Grup / Channel' : '👤 Akun Pribadi'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs font-bold text-saluang-dark/80">
                                  {rec.id}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(rec.id, `rec-${rec.id}`)}
                                  className="text-[10px] text-saluang-dark/50 hover:text-saluang-dark flex items-center gap-1 font-semibold"
                                  title="Salin Chat ID"
                                >
                                  {copiedId === `rec-${rec.id}` ? (
                                    <Check className="w-3 h-3 text-saluang-teal" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestTelegram(rec.id)}
                              isLoading={isCurrentlyTesting}
                              leftIcon={<Send className="w-3 h-3" />}
                              className="bg-white text-xs"
                            >
                              Uji ID Ini
                            </Button>
                            <button
                              type="button"
                              onClick={() => handleRemoveRecipient(rec.id)}
                              className="p-2 rounded-xl border-2 border-saluang-dark bg-saluang-coral/10 hover:bg-saluang-coral hover:text-white text-saluang-coral transition-colors"
                              title="Hapus ID penerima"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Form Tambah Penerima Baru */}
                <div className="p-4 bg-saluang-sand/20 rounded-2xl border-2 border-dashed border-saluang-dark/40 space-y-3">
                  <div className="text-xs font-black text-saluang-dark flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Tambah Penerima Notifikasi Baru
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-6">
                      <label className="block mb-1 text-[11px] font-bold text-saluang-dark">
                        Telegram Chat ID / User ID / Group ID *
                      </label>
                      <input
                        type="text"
                        value={newChatId}
                        onChange={(e) => setNewChatId(e.target.value)}
                        placeholder="Contoh: 1143585924 atau -10012345678"
                        className="w-full px-3 py-2 rounded-xl border border-saluang-dark bg-white font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal shadow-neo-sm"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block mb-1 text-[11px] font-bold text-saluang-dark">
                        Label / Keterangan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newChatLabel}
                        onChange={(e) => setNewChatLabel(e.target.value)}
                        placeholder="Contoh: Admin Fahrizal"
                        className="w-full px-3 py-2 rounded-xl border border-saluang-dark bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal shadow-neo-sm"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-end">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddRecipient}
                        disabled={!newChatId.trim()}
                        className="w-full justify-center"
                      >
                        + Tambah
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-saluang-dark/60">
                    💡 Tips: Jika ID berupa angka positif (misal: <code>1143585924</code>), sistem menandainya sebagai <strong>Akun Pribadi</strong>. Jika diawali tanda minus (misal: <code>-100...</code>), sistem menandainya sebagai <strong>Grup/Channel</strong>.
                  </p>
                </div>
              </div>

              {/* SECTION 3: TEST FEEDBACK & DELIVERY REPORT */}
              {telegramTestFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 space-y-3 shadow-neo-sm ${
                    telegramTestFeedback.type === 'success'
                      ? 'bg-saluang-teal/20 border-saluang-teal text-saluang-dark'
                      : 'bg-saluang-coral/20 border-saluang-coral text-saluang-dark'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <div className="flex items-center gap-2">
                      {telegramTestFeedback.type === 'success' ? (
                        <Check className="w-4 h-4 text-saluang-teal shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-saluang-coral shrink-0" />
                      )}
                      <span>{telegramTestFeedback.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelegramTestFeedback(null)}
                      className="p-1 hover:opacity-70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {telegramTestFeedback.details && telegramTestFeedback.details.length > 0 && (
                    <div className="pt-2 border-t border-saluang-dark/15 space-y-1.5">
                      <div className="text-[11px] uppercase font-black text-saluang-dark/70 tracking-wider">
                        Rincian Pengiriman ke Setiap ID:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {telegramTestFeedback.details.map((res, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between ${
                              res.ok
                                ? 'bg-white/80 border-saluang-teal/50 text-saluang-dark'
                                : 'bg-saluang-coral/15 border-saluang-coral text-saluang-coral'
                            }`}
                          >
                            <span className="font-mono font-bold">{res.chatId}</span>
                            <span className="text-[11px]">
                              {res.ok ? '✅ Sukses Terkirim' : `❌ ${res.error}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 4: PANDUAN PENTING & TROUBLESHOOTING */}
              <div className="p-4 sm:p-5 bg-saluang-yellow/15 border-2 border-saluang-dark rounded-2xl text-xs space-y-3 shadow-neo-sm">
                <div className="font-black text-saluang-dark flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span>Panduan Lengkap Menghubungkan Bot & Chat ID:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-white/90 rounded-xl border border-saluang-dark/30 space-y-1">
                    <div className="font-black text-saluang-dark">1. Dapatkan Token Bot</div>
                    <p className="text-[11px] text-saluang-dark/70 leading-relaxed">
                      Buka <strong>@BotFather</strong> di Telegram, kirim <code>/newbot</code>, ikuti instruksi hingga Anda menerima Token HTTP API (format <code>123456:ABC...</code>).
                    </p>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-saluang-dark/30 space-y-1">
                    <div className="font-black text-saluang-dark">2. Dapatkan Chat ID Pribadi</div>
                    <p className="text-[11px] text-saluang-dark/70 leading-relaxed">
                      Buka <strong>@userinfobot</strong> di Telegram lalu klik START. Bot tersebut akan langsung membalas dengan <strong>Id: 1143585924</strong> milik Anda.
                    </p>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-saluang-dark/30 space-y-1">
                    <div className="font-black text-saluang-dark">3. Wajib: Klik START!</div>
                    <p className="text-[11px] text-saluang-dark/70 leading-relaxed">
                      Cari bot Anda (misal <strong>@Wangtek_bot</strong>), lalu tekan <strong>START</strong> (atau kirim <code>/start</code>). Bot dilarang mengirim pesan sebelum Anda memulai percakapan.
                    </p>
                  </div>
                </div>
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
