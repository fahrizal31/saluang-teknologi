'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/Button';
import { Clock, AlertTriangle, LogOut, CheckCircle } from 'lucide-react';

const STORAGE_LAST_ACTIVITY_KEY = 'saluang_admin_last_activity';
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 Jam = 3.600.000 ms
const WARNING_THRESHOLD_MS = 2 * 60 * 1000; // Munculkan peringatan 2 menit sebelum logout (di menit ke-58)
const THROTTLE_INTERVAL_MS = 15 * 1000; // Catat pergerakan maksimal sekali tiap 15 detik

interface AdminIdleTimeoutProps {
  sessionLastActiveAt?: number;
}

export function AdminIdleTimeout({ sessionLastActiveAt }: AdminIdleTimeoutProps) {
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(120);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const lastRecordedRef = useRef<number>(Date.now());

  // Eksekusi logout otomatis ketika timeout 1 jam terpenuhi
  const performLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_LAST_ACTIVITY_KEY);
      }
      await signOut();
    } catch (err) {
      console.error('Inactivity signOut error:', err);
    } finally {
      router.push('/login?reason=timeout');
      router.refresh();
    }
  }, [isLoggingOut, router]);

  // Fungsi untuk memperbarui timestamp aktivitas admin
  const recordActivity = useCallback((force = false) => {
    const now = Date.now();
    lastActivityRef.current = now;

    // Throttle penulisan ke localStorage agar hemat performa
    if (force || now - lastRecordedRef.current > THROTTLE_INTERVAL_MS) {
      lastRecordedRef.current = now;
      try {
        localStorage.setItem(STORAGE_LAST_ACTIVITY_KEY, String(now));
      } catch {
        // Abaikan jika storage penuh atau dinonaktifkan
      }
    }

    // Jika modal peringatan sedang terbuka dan admin berinteraksi, tutup modal
    setShowWarningModal(false);
  }, []);

  // Tombol "Tetap Masuk"
  const handleExtendSession = () => {
    recordActivity(true);
    setShowWarningModal(false);
  };

  // Setup Activity Listeners & Cross-Tab Sync
  useEffect(() => {
    // 1. Inisialisasi awal timestamp dari localStorage atau server timestamp
    try {
      const stored = localStorage.getItem(STORAGE_LAST_ACTIVITY_KEY);
      const parsed = stored ? Number(stored) : NaN;

      let initialTimestamp = Date.now();
      if (!isNaN(parsed) && parsed > 0) {
        initialTimestamp = parsed;
      } else if (sessionLastActiveAt && sessionLastActiveAt > 0) {
        initialTimestamp = sessionLastActiveAt;
      }

      // Jika sudah lewat 1 jam sejak aktivitas terakhir sebelumnya
      if (Date.now() - initialTimestamp >= ONE_HOUR_MS) {
        performLogout();
        return;
      }

      lastActivityRef.current = initialTimestamp;
      localStorage.setItem(STORAGE_LAST_ACTIVITY_KEY, String(initialTimestamp));
    } catch {
      // Fallback
    }

    // 2. Event listener pergerakan user
    const handleUserActivity = () => {
      recordActivity(false);
    };

    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // 3. Sinkronisasi antar-tab (jika admin aktif di tab lain, perbarui waktu di tab ini)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_LAST_ACTIVITY_KEY && e.newValue) {
        const remoteTime = Number(e.newValue);
        if (!isNaN(remoteTime)) {
          lastActivityRef.current = remoteTime;
          setShowWarningModal(false);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. Cek saat tab difokuskan / dibuka kembali
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const stored = localStorage.getItem(STORAGE_LAST_ACTIVITY_KEY);
        const parsed = stored ? Number(stored) : lastActivityRef.current;
        const elapsed = Date.now() - parsed;
        if (elapsed >= ONE_HOUR_MS) {
          performLogout();
        } else {
          lastActivityRef.current = parsed;
          if (elapsed < ONE_HOUR_MS - WARNING_THRESHOLD_MS) {
            setShowWarningModal(false);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    // 5. Interval Heartbeat per 1 detik untuk menghitung sisa waktu
    const intervalId = window.setInterval(() => {
      // Baca kemungkinan update waktu dari tab lain
      let currentLastActivity = lastActivityRef.current;
      try {
        const stored = localStorage.getItem(STORAGE_LAST_ACTIVITY_KEY);
        if (stored) {
          const parsed = Number(stored);
          if (!isNaN(parsed) && parsed > currentLastActivity) {
            currentLastActivity = parsed;
            lastActivityRef.current = parsed;
          }
        }
      } catch {}

      const elapsed = Date.now() - currentLastActivity;

      // Skenario A: Waktu sudah genap atau melebihi 1 jam tanpa aktivitas -> Logout
      if (elapsed >= ONE_HOUR_MS) {
        performLogout();
        return;
      }

      // Skenario B: Waktu tersisa di bawah 2 menit (58 menit tidak bergerak) -> Tampilkan Modal
      const timeLeftMs = ONE_HOUR_MS - elapsed;
      if (timeLeftMs <= WARNING_THRESHOLD_MS) {
        setRemainingSeconds(Math.max(0, Math.ceil(timeLeftMs / 1000)));
        setShowWarningModal(true);
      } else {
        setShowWarningModal(false);
      }
    }, 1000);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [performLogout, recordActivity]);

  if (!showWarningModal) return null;

  // Format detik menjadi MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-saluang-dark/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl border-3 border-saluang-dark shadow-neo-lg max-w-md w-full p-6 text-saluang-dark space-y-5 animate-scaleUp">
        {/* Header Warning */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-saluang-yellow border-2 border-saluang-dark flex items-center justify-center shrink-0 shadow-neo-sm">
            <AlertTriangle className="w-6 h-6 text-saluang-dark animate-pulse" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-saluang-dark">
              Sesi Login Hampir Berakhir
            </h3>
            <p className="text-xs text-saluang-dark/70 mt-0.5">
              Tidak ada pergerakan selama hampir 1 jam
            </p>
          </div>
        </div>

        {/* Countdown Box */}
        <div className="p-4 rounded-2xl bg-saluang-coral/10 border-2 border-saluang-coral text-center space-y-1.5">
          <div className="text-xs font-bold text-saluang-coral uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4" />
            Otomatis Terlogout Dalam:
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-black text-saluang-dark tracking-tight">
            {formattedTime}
          </div>
          <p className="text-[11px] text-saluang-dark/70 leading-relaxed pt-1">
            Demi keamanan akun dan data permohonan proyek, sistem akan mengeluarkan akun Anda secara otomatis jika tidak ada aktivitas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleExtendSession}
            leftIcon={<CheckCircle className="w-4 h-4" />}
            className="w-full justify-center shadow-neo-sm font-black"
          >
            Lanjutkan Sesi (Tetap Masuk)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={performLogout}
            disabled={isLoggingOut}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center text-xs font-bold shrink-0"
          >
            Keluar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
