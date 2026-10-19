interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store untuk IP rate limiting
const ipStore = new Map<string, RateLimitRecord>();

// Bersihkan rekaman kedaluwarsa secara berkala setiap 5 menit
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    ipStore.forEach((record, ip) => {
      if (now > record.resetAt) {
        ipStore.delete(ip);
      }
    });
  }, 5 * 60 * 1000).unref();
}

export interface RateLimitOptions {
  windowMs?: number; // Durasi jendela waktu (default: 15 menit)
  maxRequests?: number; // Maksimal permintaan dalam jendela (default: 5)
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

/**
 * Mengecek dan membatasi frekuensi request berdasarkan IP pengguna
 */
export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 15 * 60 * 1000; // 15 menit
  const maxRequests = options.maxRequests ?? 5; // 5 permintaan

  const now = Date.now();
  const record = ipStore.get(ip);

  // Jika belum ada atau jendela waktu telah habis
  if (!record || now > record.resetAt) {
    ipStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetTime: Math.ceil((now + windowMs) / 1000),
      retryAfterSeconds: 0,
    };
  }

  // Jika masih dalam jendela waktu
  if (record.count >= maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: Math.ceil(record.resetAt / 1000),
      retryAfterSeconds: Math.max(1, retryAfter),
    };
  }

  // Tambahkan hitungan
  record.count += 1;
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - record.count,
    resetTime: Math.ceil(record.resetAt / 1000),
    retryAfterSeconds: 0,
  };
}

/**
 * Reset limit untuk IP tertentu (berguna untuk testing)
 */
export function resetRateLimit(ip: string): void {
  ipStore.delete(ip);
}

/**
 * Ekstraksi IP klien dari request headers Next.js
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return '127.0.0.1';
}
