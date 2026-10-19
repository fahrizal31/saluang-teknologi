import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { companySettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Verifikasi Admin
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    let token = body.token?.trim();
    let chatId = body.chatId?.trim();

    // Jika tidak dikirim via body, baca dari database
    if (!token || !chatId) {
      const rows = await db
        .select({
          token: companySettings.telegramBotToken,
          chatId: companySettings.telegramChatId,
        })
        .from(companySettings)
        .where(eq(companySettings.id, 'default'))
        .limit(1);

      if (rows.length > 0) {
        token = token || rows[0].token?.trim();
        chatId = chatId || rows[0].chatId?.trim();
      }
    }

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: 'Token Bot dan Chat ID Telegram wajib diisi terlebih dahulu.' },
        { status: 400 }
      );
    }

    const testMessage = [
      '🔔 <b>Tes Notifikasi Saluang Teknologi</b>',
      '────────────────────────────',
      '✅ <b>Koneksi Berhasil!</b>',
      'Bot Telegram Saluang Teknologi sudah sukses terhubung dengan Chat ID ini.',
      '────────────────────────────',
      'Setiap ada permohonan proyek baru yang masuk melalui formulir website, rincian permohonan akan otomatis dikirimkan ke chat ini.',
      `🕒 <i>${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</i>`,
    ].join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      if (data.description?.includes('chat not found')) {
        return NextResponse.json({
          ok: false,
          error:
            'Chat tidak ditemukan. Pastikan Anda sudah membuka bot tersebut di Telegram dan menekan tombol START (/start) terlebih dahulu.',
        });
      }
      return NextResponse.json({
        ok: false,
        error: `Gagal dari Telegram: ${data.description || 'Token atau Chat ID tidak valid'}`,
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Pesan tes berhasil dikirim! Silakan periksa chat Telegram Anda.',
    });
  } catch (error) {
    console.error('Error in /api/admin/telegram/test:', error);
    return NextResponse.json(
      { ok: false, error: 'Terjadi gangguan saat menghubungi server Telegram.' },
      { status: 500 }
    );
  }
}
