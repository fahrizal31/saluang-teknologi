import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { companySettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Verifikasi Admin Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    let token = body.token?.trim();

    // Jika tidak dikirim via body, baca dari database
    if (!token) {
      const rows = await db
        .select({
          token: companySettings.telegramBotToken,
        })
        .from(companySettings)
        .where(eq(companySettings.id, 'default'))
        .limit(1);

      if (rows.length > 0 && rows[0].token) {
        token = rows[0].token.trim();
      }
    }

    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Token bot belum diisi di database atau formulir.' },
        { status: 400 }
      );
    }

    // Call Telegram getMe
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!data.ok) {
      return NextResponse.json({
        ok: false,
        error: data.description || 'Token bot tidak valid atau bot tidak ditemukan di Telegram.',
      });
    }

    const bot = data.result;
    return NextResponse.json({
      ok: true,
      bot: {
        id: bot.id,
        firstName: bot.first_name,
        username: bot.username,
        isBot: bot.is_bot,
        canJoinGroups: bot.can_join_groups ?? true,
        canReadAllGroupMessages: bot.can_read_all_group_messages ?? false,
        link: `https://t.me/${bot.username}`,
      },
    });
  } catch (error) {
    console.error('Error in /api/admin/telegram/info:', error);
    return NextResponse.json(
      { ok: false, error: 'Terjadi gangguan jaringan saat menghubungi Telegram API.' },
      { status: 500 }
    );
  }
}
