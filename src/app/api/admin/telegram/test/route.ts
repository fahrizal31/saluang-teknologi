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
    const customMessage = body.customMessage?.trim();

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

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Token Bot Telegram wajib diisi terlebih dahulu.' },
        { status: 400 }
      );
    }

    if (!chatId) {
      return NextResponse.json(
        { ok: false, error: 'Minimal 1 Chat ID penerima wajib diisi.' },
        { status: 400 }
      );
    }

    // Parse target chat IDs (bisa koma, spasi, titik koma, baris baru)
    const targetChatIds = chatId
      .split(/[\s,;]+/)
      .map((id: string) => id.trim())
      .filter(Boolean);

    if (targetChatIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Format Chat ID tidak valid.' },
        { status: 400 }
      );
    }

    const testMessage = customMessage
      ? [
          '🔔 <b>Tes Pesan Kustom Saluang Teknologi</b>',
          '────────────────────────────',
          customMessage,
          '────────────────────────────',
          `🕒 <i>${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</i>`,
        ].join('\n')
      : [
          '🔔 <b>Tes Notifikasi Saluang Teknologi</b>',
          '────────────────────────────',
          '✅ <b>Koneksi Berhasil!</b>',
          'Bot Telegram Saluang Teknologi sudah sukses terhubung dengan Chat ID ini.',
          '────────────────────────────',
          'Setiap ada permohonan proyek baru yang masuk melalui formulir website, rincian permohonan akan otomatis dikirimkan ke chat ini.',
          `🕒 <i>${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</i>`,
        ].join('\n');

    const results: Array<{ chatId: string; ok: boolean; error?: string }> = [];

    for (const targetId of targetChatIds) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetId,
            text: testMessage,
            parse_mode: 'HTML',
          }),
        });

        const data = await res.json();

        if (!data.ok) {
          let errText = data.description || 'Gagal mengirim pesan';
          if (errText.includes('chat not found')) {
            errText = 'Pengguna belum menekan tombol START (/start) pada bot di Telegram.';
          } else if (errText.includes('bot was blocked by the user')) {
            errText = 'Bot telah diblokir oleh pengguna.';
          } else if (errText.includes('Forbidden')) {
            errText = 'Akses ditolak: pastikan bot sudah dimasukkan ke grup/channel dengan izin admin jika berupa grup.';
          }
          results.push({ chatId: targetId, ok: false, error: errText });
        } else {
          results.push({ chatId: targetId, ok: true });
        }
      } catch (err: any) {
        results.push({
          chatId: targetId,
          ok: false,
          error: err.message || 'Gangguan jaringan',
        });
      }
    }

    const successCount = results.filter((r) => r.ok).length;
    const failCount = results.length - successCount;

    if (successCount === 0) {
      return NextResponse.json({
        ok: false,
        error: `Gagal mengirim ke seluruh Chat ID (${results.map((r) => `${r.chatId}: ${r.error}`).join(' | ')})`,
        results,
      });
    }

    return NextResponse.json({
      ok: true,
      message:
        failCount === 0
          ? `Pesan tes berhasil dikirim ke ${successCount} penerima Telegram!`
          : `Terkirim ke ${successCount} penerima, tetapi gagal pada ${failCount} penerima.`,
      results,
    });
  } catch (error) {
    console.error('Error in /api/admin/telegram/test:', error);
    return NextResponse.json(
      { ok: false, error: 'Terjadi gangguan saat menghubungi server Telegram.' },
      { status: 500 }
    );
  }
}
