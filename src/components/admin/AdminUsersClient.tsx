'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Plus,
  KeyRound,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Calendar,
  Lock,
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

interface AdminUsersClientProps {
  initialUsers: AdminUserItem[];
  currentUserId: string;
}

export function AdminUsersClient({ initialUsers, currentUserId }: AdminUsersClientProps) {
  const router = useRouter();
  const [usersList, setUsersList] = useState<AdminUserItem[]>(initialUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUserItem | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUserItem | null>(null);

  // Form Create State
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal membuat admin baru');

      setFeedback({ type: 'success', message: 'Akun administrator baru berhasil dibuat!' });
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', email: '', password: '' });
      router.refresh();

      // Refresh list lokal
      const updatedRes = await fetch('/api/admin/users');
      const updatedData = await updatedRes.json();
      if (updatedData.data) setUsersList(updatedData.data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Terjadi kesalahan sistem' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    setIsResetting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${resetPasswordUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal mereset kata sandi');

      setFeedback({
        type: 'success',
        message: `Kata sandi untuk ${resetPasswordUser.email} berhasil direset dan dienkripsi ulang!`,
      });
      setResetPasswordUser(null);
      setNewPassword('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal mereset kata sandi' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${deleteConfirmUser.id}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Gagal menghapus admin');

      setUsersList((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
      setFeedback({ type: 'success', message: 'Akun administrator berhasil dihapus.' });
      setDeleteConfirmUser(null);
      router.refresh();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Gagal menghapus admin' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-saluang-dark tracking-tight">
            Manajemen Akun Administrator
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 mt-0.5">
            Kelola akses staf admin. Seluruh kata sandi dienkripsi menggunakan scrypt hash di TiDB Cloud
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto justify-center shrink-0"
        >
          Tambah Admin Baru
        </Button>
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

      {/* ============================================================ */}
      {/* 1. MOBILE CARD VIEW (Khusus Layar Ponsel: block md:hidden) */}
      {/* ============================================================ */}
      <div className="block md:hidden space-y-3 mb-8">
        {usersList.map((usr) => {
          const isCurrentUser = usr.id === currentUserId;
          return (
            <div
              key={usr.id}
              className="p-4 bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-sm space-y-3 text-saluang-dark"
            >
              {/* Header: Avatar, Name & Role */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-saluang-dark text-saluang-cream flex items-center justify-center font-bold text-xs shrink-0 border border-saluang-dark">
                    {usr.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-saluang-dark leading-tight flex items-center gap-1.5 truncate">
                      <span>{usr.name}</span>
                      {isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-saluang-teal/20 text-saluang-teal border border-saluang-teal font-black shrink-0">
                          Anda
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-saluang-dark/50 font-mono mt-0.5">ID: {usr.id.slice(0, 8)}</p>
                  </div>
                </div>

                <Badge variant="teal" size="sm" className="shrink-0 text-[10px]">
                  {usr.role.toUpperCase()}
                </Badge>
              </div>

              {/* Email & Date Info */}
              <div className="bg-saluang-sand/50 p-2.5 rounded-xl border border-saluang-dark/15 text-xs space-y-1">
                <div className="flex items-center justify-between font-mono font-bold text-saluang-dark text-[11px] truncate">
                  <span className="text-saluang-dark/60 font-sans text-[10px]">Email:</span>
                  <span className="truncate ml-2">{usr.email}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-saluang-dark/70" suppressHydrationWarning>
                  <span className="text-saluang-dark/60 text-[10px]">Terdaftar:</span>
                  <span className="font-semibold" suppressHydrationWarning>
                    {new Date(usr.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-saluang-dark/10">
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordUser(usr);
                    setNewPassword('');
                  }}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-saluang-sand hover:bg-saluang-teal hover:text-white text-saluang-dark font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Password</span>
                </button>
                {!isCurrentUser && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmUser(usr)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-saluang-coral hover:text-white text-saluang-coral font-black text-xs border-2 border-saluang-dark shadow-neo-xs active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP TABLE VIEW (Khusus Layar Desktop: hidden md:block) */}
      {/* ============================================================ */}
      <GlassCard className="hidden md:block border-2 border-saluang-dark shadow-neo overflow-hidden p-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-saluang-cream border-b-2 border-saluang-dark font-black text-saluang-dark">
                <th className="py-3 px-4">Nama Administrator</th>
                <th className="py-3 px-4">Email Login</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-saluang-dark/10 font-medium">
              {usersList.map((usr) => {
                const isCurrentUser = usr.id === currentUserId;
                return (
                  <tr key={usr.id} className="hover:bg-saluang-sand/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-saluang-dark text-saluang-cream flex items-center justify-center font-bold text-xs shrink-0">
                          {usr.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-sm text-saluang-dark flex items-center gap-2">
                            <span>{usr.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-saluang-teal/20 text-saluang-teal border border-saluang-teal font-black">
                                Anda
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-saluang-dark/50 font-mono">ID: {usr.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-saluang-dark font-mono">
                      {usr.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="teal" size="sm">
                        {usr.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-saluang-dark/70" suppressHydrationWarning>
                      <div className="flex items-center gap-1 font-semibold" suppressHydrationWarning>
                        <Calendar className="w-3 h-3 text-saluang-dark/40" />
                        <span suppressHydrationWarning>
                          {new Date(usr.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setResetPasswordUser(usr);
                            setNewPassword('');
                          }}
                          className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-sand text-saluang-dark shadow-neo-sm transition-colors cursor-pointer"
                          title="Reset Kata Sandi"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        {!isCurrentUser && (
                          <button
                            onClick={() => setDeleteConfirmUser(usr)}
                            className="p-1.5 rounded-lg border border-saluang-dark bg-white hover:bg-saluang-coral/20 text-saluang-coral shadow-neo-sm transition-colors cursor-pointer"
                            title="Hapus Administrator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ============================================================ */}
      {/* MODAL: TAMBAH ADMIN BARU */}
      {/* ============================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-saluang-cream border-2 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-lg p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-xl border-2 border-saluang-dark hover:bg-saluang-sand transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-saluang-dark" />
            </button>

            <div className="mb-6">
              <Badge variant="teal" size="sm" className="mb-2">
                Administrator Baru
              </Badge>
              <h3 className="text-xl font-black text-saluang-dark">
                Buat Akun Administrator
              </h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-bold text-saluang-dark">
              <div>
                <label className="block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div>
                <label className="block mb-1">Email Login *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="admin.budi@saluangteknologi.com"
                  className="w-full px-3 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                />
              </div>

              <div>
                <label className="block mb-1">Kata Sandi (Minimal 8 karakter) *</label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-3 pr-10 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-saluang-dark/60 hover:text-saluang-dark"
                  >
                    {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-saluang-dark/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                >
                  Buat Akun
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: RESET KATA SANDI */}
      {/* ============================================================ */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-saluang-cream border-2 border-saluang-dark rounded-2xl sm:rounded-3xl shadow-neo-lg p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setResetPasswordUser(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1 rounded-xl border-2 border-saluang-dark hover:bg-saluang-sand transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-saluang-dark" />
            </button>

            <div className="mb-4">
              <Badge variant="yellow" size="sm" className="mb-2">
                Reset Kata Sandi
              </Badge>
              <h3 className="text-lg font-black text-saluang-dark">
                Reset Kata Sandi Admin
              </h3>
              <p className="text-xs text-saluang-dark/70 mt-1">
                Akun: <strong className="text-saluang-dark">{resetPasswordUser.email}</strong>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-bold text-saluang-dark">
              <div>
                <label className="block mb-1">Kata Sandi Baru (Min. 8 karakter) *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ketik kata sandi baru..."
                    className="w-full pl-3 pr-10 py-2 rounded-xl border-2 border-saluang-dark bg-white font-mono focus:outline-none focus:ring-2 focus:ring-saluang-teal/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-saluang-dark/60 hover:text-saluang-dark"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-saluang-dark/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResetPasswordUser(null)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isResetting}
                >
                  Simpan Kata Sandi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: HAPUS ADMIN */}
      {/* ============================================================ */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-saluang-dark/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-lg p-6">
            <h3 className="text-lg font-black text-saluang-dark mb-2">Hapus Administrator Ini?</h3>
            <p className="text-xs text-saluang-dark/70 mb-6">
              Akun <strong className="text-saluang-dark">{deleteConfirmUser.email}</strong> akan dihapus permanen dari basis data dan tidak dapat digunakan lagi untuk login.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmUser(null)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                variant="coral"
                size="sm"
                onClick={handleDeleteUser}
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
