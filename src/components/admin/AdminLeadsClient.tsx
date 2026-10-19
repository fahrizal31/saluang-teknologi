'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Phone,
  Mail,
  Building,
  Calendar,
  Layers,
  DollarSign,
  X,
  Eye,
  Inbox,
  UserCheck,
  CheckCircle2,
  Trash2,
  Save,
  MessageSquare,
  AlertCircle,
  Check,
} from 'lucide-react';
import type { Lead } from '@/lib/db/schema';

interface AdminLeadsClientProps {
  initialLeads: Lead[];
  adminUser: {
    name: string;
    email: string;
  };
}

export function AdminLeadsClient({ initialLeads, adminUser }: AdminLeadsClientProps) {
  const router = useRouter();
  const [leadsList, setLeadsList] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('semua');
  const [notesInput, setNotesInput] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const totalLeads = leadsList.length;
  const newLeads = leadsList.filter((l) => l.status === 'baru').length;
  const dealLeads = leadsList.filter((l) => l.status === 'deal').length;

  const statusOptions = [
    { value: 'baru', label: 'Baru', badgeClass: 'bg-saluang-yellow text-saluang-dark border-saluang-dark' },
    { value: 'dihubungi', label: 'Dihubungi', badgeClass: 'bg-blue-100 text-blue-900 border-blue-800' },
    { value: 'negosiasi', label: 'Negosiasi', badgeClass: 'bg-purple-100 text-purple-900 border-purple-800' },
    { value: 'deal', label: 'Deal Proyek', badgeClass: 'bg-saluang-teal/30 text-saluang-dark border-saluang-teal font-black' },
    { value: 'ditolak', label: 'Ditolak', badgeClass: 'bg-saluang-coral/20 text-saluang-coral border-saluang-coral' },
  ];

  const getStatusBadgeClass = (status: string) => {
    const found = statusOptions.find((s) => s.value === status);
    return found ? found.badgeClass : 'bg-saluang-sand text-saluang-dark border-saluang-dark';
  };

  const getServiceLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'website':
        return 'Website Profesional';
      case 'sistem-informasi':
        return 'Sistem Informasi';
      case 'aplikasi-android':
        return 'Aplikasi Android';
      case 'software-lainnya':
        return 'Software Custom';
      default:
        return serviceType;
    }
  };

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'under-10m':
        return '< Rp 10 Juta';
      case '10m-25m':
        return 'Rp 10–25 Juta';
      case '25m-50m':
        return 'Rp 25–50 Juta';
      case '50m-100m':
        return 'Rp 50–100 Juta';
      case 'above-100m':
        return '> Rp 100 Juta';
      default:
        return budget;
    }
  };

  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('0') ? '62' + digits.slice(1) : digits;
  };

  const handleOpenDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesInput(lead.notes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal mengubah status');

      setLeadsList((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setFeedback({ type: 'success', message: `Status berhasil diubah menjadi "${newStatus}"` });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal mengubah status' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesInput }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menyimpan catatan');

      setLeadsList((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: notesInput } : l))
      );
      setSelectedLead((prev) => (prev ? { ...prev, notes: notesInput } : null));
      setFeedback({ type: 'success', message: 'Catatan internal admin berhasil disimpan!' });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menyimpan catatan' });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/leads/${deleteConfirmId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus lead');

      setLeadsList((prev) => prev.filter((l) => l.id !== deleteConfirmId));
      if (selectedLead && selectedLead.id === deleteConfirmId) {
        setSelectedLead(null);
      }
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Data lead berhasil dihapus permanen.' });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus lead' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredLeads =
    activeStatusFilter === 'semua'
      ? leadsList
      : leadsList.filter((l) => l.status === activeStatusFilter);

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
      {/* Header Title */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Daftar Permintaan Proyek (Leads)
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
            Seluruh inquiry masuk dari formulir kontak publik Saluang Teknologi
          </p>
        </div>
        <Badge variant="teal" size="sm" className="gap-1.5 font-bold self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>TiDB Cloud Live</span>
        </Badge>
      </div>

      {/* Feedback Banner */}
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

      {/* Stats Row - 3 columns on mobile and desktop */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <GlassCard className="p-3 sm:p-5 border-2 border-saluang-dark shadow-neo-sm sm:shadow-neo">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-saluang-dark/60 uppercase tracking-wider truncate">
                Total
              </p>
              <p className="text-xl sm:text-3xl font-black text-saluang-dark mt-0.5 sm:mt-1">{totalLeads}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-saluang-dark text-saluang-cream flex items-center justify-center border sm:border-2 border-saluang-dark shrink-0">
              <Inbox className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-5 border-2 border-saluang-dark shadow-neo-sm sm:shadow-neo">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-saluang-dark/60 uppercase tracking-wider truncate">
                Baru
              </p>
              <p className="text-xl sm:text-3xl font-black text-saluang-yellow mt-0.5 sm:mt-1">{newLeads}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-saluang-yellow text-saluang-dark flex items-center justify-center border sm:border-2 border-saluang-dark shrink-0">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-3 sm:p-5 border-2 border-saluang-dark shadow-neo-sm sm:shadow-neo">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-saluang-dark/60 uppercase tracking-wider truncate">
                Deal
              </p>
              <p className="text-xl sm:text-3xl font-black text-saluang-teal mt-0.5 sm:mt-1">{dealLeads}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-saluang-teal text-saluang-cream flex items-center justify-center border sm:border-2 border-saluang-dark shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Tab Row - Swipeable on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          onClick={() => setActiveStatusFilter('semua')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 shrink-0 transition-all ${
            activeStatusFilter === 'semua'
              ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-xs'
              : 'bg-saluang-cream text-saluang-dark border-saluang-dark hover:bg-saluang-sand'
          }`}
        >
          Semua ({totalLeads})
        </button>
        {statusOptions.map((st) => {
          const count = leadsList.filter((l) => l.status === st.value).length;
          const active = activeStatusFilter === st.value;
          return (
            <button
              key={st.value}
              onClick={() => setActiveStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 shrink-0 transition-all ${
                active
                  ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-xs'
                  : 'bg-saluang-cream text-saluang-dark border-saluang-dark hover:bg-saluang-sand'
              }`}
            >
              {st.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 1. MOBILE CARD VIEW (Khusus Layar Ponsel: block md:hidden) */}
      {/* ============================================================ */}
      <div className="block md:hidden space-y-3 mb-8">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-saluang-dark/60 font-semibold text-xs bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-sm">
            Tidak ada permintaan proyek dengan filter ini.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-3 text-saluang-dark"
            >
              {/* Header: Name & Service Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-sm text-saluang-dark leading-tight truncate">
                    {lead.fullName}
                  </h3>
                  {lead.companyName && (
                    <p className="text-[11px] font-bold text-saluang-dark/70 flex items-center gap-1 mt-0.5 truncate">
                      <Building className="w-3 h-3 shrink-0" />
                      <span>{lead.companyName}</span>
                    </p>
                  )}
                  <p className="text-[10px] text-saluang-dark/50 font-mono mt-0.5 truncate">
                    {lead.email}
                  </p>
                </div>
                <Badge variant="teal" size="sm" className="shrink-0 text-[10px]">
                  {getServiceLabel(lead.serviceType)}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-saluang-sand/50 p-2.5 rounded-xl border border-saluang-dark/15 font-semibold">
                <div>
                  <span className="text-saluang-dark/60 block text-[10px]">Anggaran:</span>
                  <span className="font-extrabold text-saluang-dark truncate block">
                    {getBudgetLabel(lead.budgetRange)}
                  </span>
                </div>
                <div suppressHydrationWarning>
                  <span className="text-saluang-dark/60 block text-[10px]">Waktu:</span>
                  <span className="font-mono text-saluang-dark/80" suppressHydrationWarning>
                    {new Date(lead.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>

              {/* Status Selector Row */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-saluang-dark/10">
                <span className="text-[10px] font-bold text-saluang-dark/60 uppercase">Status:</span>
                <select
                  value={lead.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border-2 border-saluang-dark cursor-pointer focus:outline-none ${getStatusBadgeClass(
                    lead.status
                  )}`}
                >
                  {statusOptions.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Actions Bar */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={`https://wa.me/${cleanPhone(lead.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleOpenDetail(lead)}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-saluang-cream hover:bg-saluang-sand text-saluang-dark font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(lead.id)}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-saluang-coral hover:text-white text-saluang-coral font-bold text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
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
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-saluang-dark/60 font-semibold text-sm">
            Tidak ada permintaan proyek dengan filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-saluang-cream border-b-2 border-saluang-dark font-black text-saluang-dark">
                  <th className="py-3 px-4">Nama & Klien</th>
                  <th className="py-3 px-4">Layanan</th>
                  <th className="py-3 px-4">Estimasi Anggaran</th>
                  <th className="py-3 px-4">Waktu Masuk</th>
                  <th className="py-3 px-4">Ubah Status</th>
                  <th className="py-3 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-saluang-dark/10 font-medium">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-saluang-sand/40 transition-colors"
                  >
                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-sm text-saluang-dark">
                        {lead.fullName}
                      </div>
                      {lead.companyName && (
                        <div className="text-[11px] text-saluang-dark/70 font-semibold flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{lead.companyName}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-saluang-dark/50 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{lead.email}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <Badge variant="teal" size="sm">
                        {getServiceLabel(lead.serviceType)}
                      </Badge>
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-bold text-saluang-dark">
                      {getBudgetLabel(lead.budgetRange)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-saluang-dark/70" suppressHydrationWarning>
                      <div className="flex items-center gap-1 font-semibold" suppressHydrationWarning>
                        <Calendar className="w-3 h-3 text-saluang-dark/40" />
                        <span suppressHydrationWarning>
                          {new Date(lead.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-[10px] text-saluang-dark/50 pl-4 font-mono" suppressHydrationWarning>
                        {new Date(lead.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </div>
                    </td>

                    {/* Status Selector */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        disabled={isUpdatingStatus}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-saluang-dark cursor-pointer focus:outline-none ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenDetail(lead)}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Detail
                        </Button>
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-coral/20 text-saluang-coral shadow-neo-sm transition-colors cursor-pointer"
                          title="Hapus Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* ============================================================ */}
      {/* MODAL DETAIL LEAD */}
      {/* ============================================================ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl bg-saluang-cream border-2 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-lg p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-xl border-2 border-saluang-dark hover:bg-saluang-sand transition-colors cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4 text-saluang-dark" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="teal" size="sm">
                Detail Permintaan Proyek
              </Badge>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase border border-saluang-dark ${getStatusBadgeClass(
                  selectedLead.status
                )}`}
              >
                {selectedLead.status}
              </span>
            </div>

            <h3 className="text-xl font-black text-saluang-dark mb-1">
              {selectedLead.fullName}
            </h3>
            {selectedLead.companyName && (
              <p className="text-xs font-bold text-saluang-dark/60 mb-4 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>{selectedLead.companyName}</span>
              </p>
            )}

            <div className="space-y-4 my-5 bg-white p-4 rounded-2xl border-2 border-saluang-dark/20 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-bold text-saluang-dark/50 block">Jenis Layanan</span>
                  <span className="font-extrabold text-saluang-dark">
                    {getServiceLabel(selectedLead.serviceType)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-saluang-dark/50 block">Estimasi Anggaran</span>
                  <span className="font-extrabold text-saluang-dark">
                    {getBudgetLabel(selectedLead.budgetRange)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-saluang-dark/50 block">Email Klien</span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-bold text-saluang-teal hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-saluang-dark/50 block">Nomor WhatsApp</span>
                  <a
                    href={`https://wa.me/${cleanPhone(selectedLead.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-saluang-teal hover:underline"
                  >
                    {selectedLead.whatsapp}
                  </a>
                </div>
              </div>

              {/* Status Update inside Modal */}
              <div className="pt-3 border-t border-saluang-dark/10">
                <label className="font-black text-saluang-dark block mb-1">Ubah Status Prospek:</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((st) => (
                    <button
                      key={st.value}
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedLead.id, st.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                        selectedLead.status === st.value
                          ? 'bg-saluang-dark text-saluang-cream border-saluang-dark shadow-neo-sm scale-105'
                          : 'bg-white text-saluang-dark border-saluang-dark/40 hover:border-saluang-dark'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="pt-3 border-t border-saluang-dark/10">
                <span className="font-bold text-saluang-dark/50 block mb-1">
                  Deskripsi Kebutuhan Proyek:
                </span>
                <p className="whitespace-pre-line text-saluang-dark text-xs leading-relaxed bg-saluang-sand/50 p-3 rounded-xl border border-saluang-dark/10">
                  {selectedLead.projectDescription}
                </p>
              </div>

              {/* Internal Notes */}
              <div className="pt-3 border-t border-saluang-dark/10">
                <label className="font-black text-saluang-dark flex items-center justify-between mb-1">
                  <span>Catatan Internal Tim Admin:</span>
                  <span className="text-[10px] text-saluang-dark/50 font-normal">
                    (Hanya terlihat oleh tim internal)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Contoh: Klien minta follow-up hari Rabu via Google Meet. Budget fleksibel..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-saluang-sand/30 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 leading-relaxed text-xs"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleSaveNotes}
                    isLoading={isSavingNotes}
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                  >
                    Simpan Catatan
                  </Button>
                </div>
              </div>

              {selectedLead.ipAddress && (
                <div className="pt-2 text-[10px] text-saluang-dark/40 flex justify-between border-t border-saluang-dark/10">
                  <span>IP: {selectedLead.ipAddress}</span>
                  <span>
                    ID: <code className="font-mono">{selectedLead.id.slice(0, 8)}</code>
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-between items-center pt-2">
              <Button
                variant="coral"
                size="sm"
                onClick={() => setDeleteConfirmId(selectedLead.id)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Hapus Lead
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="teal"
                  size="sm"
                  href={`https://wa.me/${cleanPhone(selectedLead.whatsapp)}?text=Halo%20${encodeURIComponent(
                    selectedLead.fullName
                  )},%20terima%20kasih%20telah%20menghubungi%20Saluang%20Teknologi.`}
                  isExternal
                  leftIcon={<Phone className="w-3.5 h-3.5" />}
                >
                  Hubungi via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL CONFIRMATION: DELETE LEAD */}
      {/* ============================================================ */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-lg p-6">
            <h3 className="text-lg font-black text-saluang-dark mb-2">Hapus Permintaan Proyek Ini?</h3>
            <p className="text-xs text-saluang-dark/70 mb-6">
              Data prospek ini akan dihapus secara permanen dari basis data dan tidak dapat dikembalikan.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleDeleteLead}
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
