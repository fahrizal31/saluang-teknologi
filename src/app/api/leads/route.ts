import { NextRequest, NextResponse } from 'next/server';
import { inquirySchema } from '@/schemas/inquirySchema';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimiter';
import { verifyTurnstileToken } from '@/lib/security/turnstile';
import { sanitizeInquiryInput } from '@/lib/security/sanitize';
import { dispatchLeadNotification } from '@/lib/notifications';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // 1. Proteksi Rate Limit per IP (Maks 5 pengiriman per 15 menit)
    const rateLimit = checkRateLimit(clientIp, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Terlalu banyak permintaan dari alamat IP Anda. Silakan coba kembali dalam beberapa menit.',
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          },
        }
      );
    }

    // 2. Parsing Payload JSON
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Format data permintaan tidak valid (JSON malformed).',
        },
        { status: 400 }
      );
    }

    // 3. Proteksi Honeypot Anti-Spam
    // Jika field jebakan websiteUrlHoneypot diisi oleh bot, tolak permintaan
    if (body.websiteUrlHoneypot && String(body.websiteUrlHoneypot).trim().length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Spam terdeteksi.',
        },
        { status: 400 }
      );
    }

    // 4. Verifikasi Cloudflare Turnstile (bila diaktifkan)
    const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : undefined;
    const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstileResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: turnstileResult.message || 'Verifikasi keamanan gagal.',
        },
        { status: 400 }
      );
    }

    // 5. Validasi Server-Side menggunakan Zod Schema (Single Source of Truth)
    const validationResult = inquirySchema.safeParse(body);
    if (!validationResult.success) {
      const flattenedErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: 'Data formulir tidak memenuhi aturan validasi.',
          errors: flattenedErrors,
        },
        { status: 400 }
      );
    }

    // 6. Sanitasi Input Pengguna (Mencegah Stored XSS)
    const sanitizedData = sanitizeInquiryInput(validationResult.data);

    // 7. Simpan Lead ke Database (Drizzle ORM + MySQL 8)
    const leadId = crypto.randomUUID();
    const userAgent = request.headers.get('user-agent') || null;
    const now = new Date();

    await db.insert(leads).values({
      id: leadId,
      fullName: sanitizedData.fullName,
      email: sanitizedData.email,
      whatsapp: sanitizedData.whatsapp,
      companyName: sanitizedData.companyName || null,
      serviceType: sanitizedData.serviceType,
      budgetRange: sanitizedData.budgetRange,
      projectDescription: sanitizedData.projectDescription,
      status: 'baru',
      ipAddress: clientIp,
      userAgent: userAgent,
      createdAt: now,
      updatedAt: now,
    });

    // 8. Kirim Notifikasi ke Tim (Adapter: Telegram / Email / Mock)
    try {
      await dispatchLeadNotification({
        id: leadId,
        fullName: sanitizedData.fullName,
        email: sanitizedData.email,
        whatsapp: sanitizedData.whatsapp,
        companyName: sanitizedData.companyName,
        serviceType: sanitizedData.serviceType,
        budgetRange: sanitizedData.budgetRange,
        projectDescription: sanitizedData.projectDescription,
        createdAt: now,
      });
    } catch (notifError) {
      console.error('[API:Leads] Kesalahan pengiriman notifikasi:', notifError);
    }

    // 9. Respons Sukses Terstandar
    return NextResponse.json(
      {
        success: true,
        message: 'Permintaan proyek Anda telah berhasil kami terima. Tim Saluang Teknologi akan segera menghubungi Anda.',
        inquiryId: leadId,
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        },
      }
    );
  } catch (error) {
    console.error('[API:Leads] Terjadi kesalahan server:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi gangguan internal pada server saat memproses permintaan Anda. Silakan coba beberapa saat lagi.',
      },
      { status: 500 }
    );
  }
}
