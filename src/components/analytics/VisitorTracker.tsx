'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const SESSION_STORAGE_KEY = 'saluang_v_session';
const HEARTBEAT_INTERVAL_MS = 60000; // 60 detik

/**
 * Menghasilkan Session ID unik per tab browser pengunjung.
 */
function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return 'v_temp_' + Math.random().toString(36).substring(2, 10);
  }
}

/**
 * Komponen pelacak pengunjung online & tayangan halaman publik Saluang Teknologi.
 * Bekerja di latar belakang tanpa mempengaruhi performa atau tampilan visual website.
 */
export function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string>('');

  const sendPing = useCallback((isHeartbeat: boolean) => {
    try {
      const sessionId = getOrCreateSessionId();
      const currentPath = window.location.pathname || pathname || '/';

      const payload = {
        sessionId,
        path: currentPath,
        isHeartbeat,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      };

      // Gunakan fetch dengan keepalive untuk keandalan maksimal
      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Abaikan kesalahan pelacakan di sisi klien
      });
    } catch {
      // Abaikan error pelacak
    }
  }, [pathname]);

  // 1. Lacak setiap kali rute atau halaman berubah
  useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (lastTrackedPathRef.current === fullPath) return;
    lastTrackedPathRef.current = fullPath;

    sendPing(false);
  }, [pathname, searchParams, sendPing]);

  // 2. Kirim heartbeat berkala (60 detik) untuk mendeteksi pengunjung online
  useEffect(() => {
    const interval = setInterval(() => {
      // Hanya kirim heartbeat jika tab sedang aktif / dibuka oleh pengguna
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        sendPing(true);
      }
    }, HEARTBEAT_INTERVAL_MS);

    // Kirim ping langsung saat pengguna kembali aktif membuka tab ini
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendPing(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sendPing]);

  return null;
}
