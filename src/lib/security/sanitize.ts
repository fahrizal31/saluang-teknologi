/**
 * Sanitasi string input pengguna untuk mencegah Stored XSS
 * dan membersihkan karakter berbahaya sebelum disimpan ke database.
 */
export function sanitizeString(input?: string | null): string {
  if (!input) return '';

  return input
    .replace(/<[^>]*>/g, '') // Hapus tag HTML
    .replace(/javascript:/gi, '') // Hapus URI javascript:
    .replace(/on\w+=/gi, '') // Hapus inline event handlers (contoh: onclick=)
    .trim();
}

/**
 * Sanitasi data formulir inquiry secara menyeluruh
 */
export function sanitizeInquiryInput<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data };

  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeString(value);
    }
  }

  return sanitized;
}
