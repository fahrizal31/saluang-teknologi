export interface TurnstileVerificationResult {
  success: boolean;
  message?: string;
  errorCodes?: string[];
}

/**
 * Verifikasi token Cloudflare Turnstile di sisi server
 * Menggunakan endpoint resmi: https://challenges.cloudflare.com/turnstile/v0/siteverify
 */
export async function verifyTurnstileToken(
  token?: string | null,
  clientIp?: string
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const isEnabled = process.env.ENABLE_TURNSTILE === 'true';

  // Jika Turnstile tidak diaktifkan atau kunci masih placeholder / kosong (misal di local dev), loloskan verifikasi
  if (!isEnabled || !secretKey || secretKey.includes('placeholder')) {
    return { success: true };
  }

  // Jika diaktifkan tetapi token tidak disertakan
  if (!token) {
    return {
      success: false,
      message: 'Verifikasi keamanan (Turnstile) diperlukan.',
      errorCodes: ['missing-input-response'],
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Gagal menghubungi server verifikasi keamanan Cloudflare.',
      };
    }

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      message: 'Verifikasi keamanan gagal. Silakan coba kembali.',
      errorCodes: data['error-codes'],
    };
  } catch (error) {
    console.error('[Turnstile] Terjadi kesalahan jaringan saat verifikasi:', error);
    // Bila terjadi network timeout ke Cloudflare, jangan blokir pengguna kecuali strictly required
    return {
      success: false,
      message: 'Koneksi ke verifikasi keamanan mengalami gangguan.',
    };
  }
}
