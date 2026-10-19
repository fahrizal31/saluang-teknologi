'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Check,
  X,
  AlertCircle,
  Linkedin,
  Github,
  Image as ImageIcon,
  User,
  ExternalLink,
} from 'lucide-react';
import type { TeamMemberModel } from '@/lib/db/schema';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

interface AdminTeamClientProps {
  initialMembers: TeamMemberModel[];
}

export function AdminTeamClient({ initialMembers }: AdminTeamClientProps) {
  const router = useRouter();
  const [membersList, setMembersList] = useState<TeamMemberModel[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    roleCategory: 'engineering',
    bio: '',
    avatarUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    displayOrder: 0,
  });

  const categories = [
    { value: 'engineering', label: 'Engineering & DevOps' },
    { value: 'design', label: 'UI/UX & Product Design' },
    { value: 'management', label: 'Leadership & Management' },
    { value: 'cloud', label: 'Cloud & Infrastructure' },
    { value: 'marketing', label: 'Growth & Business' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      roleCategory: 'engineering',
      bio: '',
      avatarUrl: '',
      linkedinUrl: '',
      githubUrl: '',
      displayOrder: membersList.length,
    });
    setEditingMember(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMemberModel) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      roleCategory: member.roleCategory,
      bio: member.bio,
      avatarUrl: member.avatarUrl,
      linkedinUrl: member.linkedinUrl || '',
      githubUrl: member.githubUrl || '',
      displayOrder: member.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      roleCategory: formData.roleCategory,
      bio: formData.bio.trim(),
      avatarUrl: formData.avatarUrl.trim(),
      linkedinUrl: formData.linkedinUrl.trim() || null,
      githubUrl: formData.githubUrl.trim() || null,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember.id}`
        : '/api/admin/team';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan data anggota tim');
      }

      setFeedback({
        type: 'success',
        message: editingMember
          ? 'Profil anggota tim berhasil diperbarui!'
          : 'Anggota tim baru berhasil ditambahkan!',
      });
      setIsModalOpen(false);
      router.refresh();

      // Refresh list lokal
      const updatedRes = await fetch('/api/admin/team');
      const updatedData = await updatedRes.json();
      if (updatedData.data) {
        setMembersList(updatedData.data);
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
      const res = await fetch(`/api/admin/team/${deleteId}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus anggota tim');

      setMembersList((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
      setFeedback({ type: 'success', message: 'Profil anggota tim berhasil dihapus.' });
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus anggota tim' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    const found = categories.find((c) => c.value === cat);
    return found ? found.label : cat;
  };

  const filteredMembers = membersList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.roleCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
      {/* Top Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Manajemen Anggota Tim
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
            Kelola profil pendiri, rekayasawan, desainer, dan staf yang ditampilkan di halaman Tentang Kami
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto justify-center shrink-0"
        >
          Tambah Anggota Tim
        </Button>
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
                placeholder="Cari nama atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-lg border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 text-xs font-bold rounded-lg border-2 border-saluang-dark bg-white focus:outline-none"
            >
              <option value="all">Semua Kategori Peran</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-bold text-saluang-dark/60">
            Menampilkan {filteredMembers.length} dari {membersList.length} Anggota
          </span>
        </div>
      </GlassCard>

      {/* Team Cards Grid */}
      {filteredMembers.length === 0 ? (
        <GlassCard className="p-12 text-center border-2 border-saluang-dark shadow-neo">
          <p className="text-sm font-bold text-saluang-dark/60">
            Belum ada anggota tim yang cocok dengan kriteria pencarian.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <GlassCard
              key={member.id}
              className="border-2 border-saluang-dark shadow-neo flex flex-col justify-between p-5 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <div>
                {/* Header: Avatar & Category */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-16 h-16 rounded-2xl border-2 border-saluang-dark overflow-hidden bg-saluang-dark/10 shadow-neo-sm relative shrink-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-saluang-dark/40">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="teal" size="sm">
                      {getCategoryLabel(member.roleCategory)}
                    </Badge>
                    <span className="block mt-1 text-[10px] font-mono text-saluang-dark/50">
                      Urutan: #{member.displayOrder}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-base font-black text-saluang-dark leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-saluang-teal mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs text-saluang-dark/70 mt-3 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Socials & Card Actions */}
              <div className="pt-4 mt-4 border-t border-saluang-dark/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-sm"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-sm"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-2 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-teal/20 text-saluang-dark shadow-neo-sm transition-colors"
                    title="Edit Anggota"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(member.id)}
                    className="p-2 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-coral/20 text-saluang-coral shadow-neo-sm transition-colors"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL FORM: CREATE / EDIT MEMBER */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-saluang-cream border-2 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-lg p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-xl border-2 border-saluang-dark hover:bg-saluang-sand transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-saluang-dark" />
            </button>

            <div className="mb-6">
              <Badge variant="teal" size="sm" className="mb-2">
                {editingMember ? 'Edit Profil Tim' : 'Anggota Tim Baru'}
              </Badge>
              <h3 className="text-xl font-black text-saluang-dark">
                {editingMember ? `Perbarui: ${editingMember.name}` : 'Tambah Anggota Tim Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-saluang-dark">
              {/* Name & Role */}
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Rian Pratama, S.Kom."
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Jabatan / Role Spesifik *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Contoh: Principal Software Architect"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
                  />
                </div>
              </div>

              {/* Role Category & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Kategori Peran *</label>
                  <select
                    value={formData.roleCategory}
                    onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value })}
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
                  <label className="block mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Avatar Photo (Upload dari Perangkat atau URL) */}
              <ImageUploadField
                label="Foto Profil Anggota Tim"
                required
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                folder="team"
                aspectRatio="square"
                helperText="Pilih foto persegi langsung dari komputer/HP atau gunakan tautan URL online."
              />

              {/* Bio */}
              <div>
                <label className="block mb-1">Biografi Singkat & Keahlian *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Pengalaman rekayasa, keahlian khusus, dan dedikasi dalam membangun sistem..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold leading-relaxed"
                />
              </div>

              {/* LinkedIn & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Tautan LinkedIn (Opsional)</label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1">Tautan GitHub (Opsional)</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none font-semibold"
                  />
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
                  {editingMember ? 'Simpan Perubahan' : 'Tambah Anggota'}
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
            <h3 className="text-lg font-black text-saluang-dark mb-2">Hapus Anggota Tim Ini?</h3>
            <p className="text-xs text-saluang-dark/70 mb-6">
              Profil anggota tim ini akan dihapus secara permanen dari basis data dan tidak lagi tampil di halaman Tentang Kami.
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
