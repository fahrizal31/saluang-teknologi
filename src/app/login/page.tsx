'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from '@/lib/auth-client';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Clock } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/leads';
  const reason = searchParams.get('reason');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Harap masukkan alamat email dan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signIn.email({
        email,
        password,
      });

      if (response.error) {
        setErrorMessage(
          response.error.message || 'Email atau kata sandi yang Anda masukkan salah.'
        );
        setIsLoading(false);
        return;
      }

      // Berhasil login, perbarui timestamp aktivitas admin di localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('saluang_admin_last_activity', String(Date.now()));
        } catch {}
      }

      // Arahkan ke dashboard admin dengan hard navigation agar cookie dan sesi ter-mount bersih
      window.location.href = callbackUrl;
    } catch (err: unknown) {
      console.error('Login error:', err);
      const detail = err instanceof Error ? err.message : '';
      setErrorMessage(
        detail && detail !== 'Failed to fetch'
          ? `Terjadi gangguan: ${detail}`
          : 'Gagal menghubungi server auth. Pastikan Environment Variables (DATABASE_URL & BETTER_AUTH_URL) sudah diset di dashboard hosting.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header Branding: Logo Only */}
      <div className="text-center mb-8 flex justify-center">
        <Link
          href="/"
          className="inline-block group focus-visible:outline-none transition-transform duration-200 hover:scale-105"
          aria-label="Kembali ke Beranda Saluang Teknologi"
        >
          <Image
            src="/images/saluang-logo.png"
            alt="Saluang Teknologi"
            width={280}
            height={116}
            className="h-16 md:h-20 w-auto object-contain drop-shadow-xs"
            priority
          />
        </Link>
      </div>

      {/* Card Form */}
      <GlassCard className="p-6 md:p-8 border-2 border-saluang-dark shadow-neo">
        <form onSubmit={handleSubmit} className="space-y-5">
          {reason === 'timeout' && (
            <div className="p-3.5 bg-saluang-yellow/25 border-2 border-saluang-dark rounded-xl flex items-start gap-2.5 text-saluang-dark text-xs md:text-sm font-bold shadow-neo-xs">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-saluang-coral" />
              <span>
                Sesi login Anda telah berakhir karena tidak ada pergerakan selama 1 jam. Silakan masuk kembali demi keamanan akun.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-saluang-coral/10 border-2 border-saluang-coral rounded-xl flex items-start gap-2.5 text-saluang-coral text-xs md:text-sm font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs md:text-sm font-bold text-saluang-dark mb-1.5"
            >
              Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-saluang-dark/50">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@saluangteknologi.com"
                autoComplete="email"
                disabled={isLoading}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border-2 border-saluang-dark rounded-xl text-saluang-dark placeholder-saluang-dark/40 font-medium focus:outline-none focus:ring-2 focus:ring-saluang-teal focus:border-saluang-teal shadow-neo-sm disabled:opacity-60 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs md:text-sm font-bold text-saluang-dark mb-1.5"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-saluang-dark/50">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border-2 border-saluang-dark rounded-xl text-saluang-dark placeholder-saluang-dark/40 font-medium focus:outline-none focus:ring-2 focus:ring-saluang-teal focus:border-saluang-teal shadow-neo-sm disabled:opacity-60 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-saluang-dark/50 hover:text-saluang-dark transition-colors"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="coral"
              size="md"
              className="w-full justify-center"
              isLoading={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </Button>
          </div>
        </form>

        {/* Footer note */}
        <div className="mt-6 pt-5 border-t border-saluang-dark/10 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-saluang-dark/70 hover:text-saluang-dark hover:underline transition-colors"
          >
            ← Kembali ke Beranda Situs
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-saluang-sand flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-saluang-pink/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-saluang-mint/20 blur-3xl pointer-events-none -z-10" />

      <Suspense
        fallback={
          <div className="text-center font-bold text-saluang-dark p-8">
            <span className="inline-block animate-pulse">Memuat form login...</span>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
