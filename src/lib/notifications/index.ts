export interface NotificationPayload {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  companyName?: string | null;
  serviceType: string;
  budgetRange: string;
  projectDescription: string;
  createdAt: Date;
}

export interface NotificationAdapter {
  name: string;
  sendLeadNotification(payload: NotificationPayload): Promise<boolean>;
}

/**
 * Adapter 1: Mock Notifier
 * Mencatat notifikasi ke console/logger server untuk pengembangan lokal dan pengujian.
 */
export class MockNotificationAdapter implements NotificationAdapter {
  name = 'mock';

  async sendLeadNotification(payload: NotificationPayload): Promise<boolean> {
    console.log('\n[Notification:Mock] 📩 Notifikasi Permintaan Proyek Diterima:');
    console.log(`  - ID: ${payload.id}`);
    console.log(`  - Nama: ${payload.fullName}`);
    console.log(`  - Email: ${payload.email}`);
    console.log(`  - WhatsApp: ${payload.whatsapp}`);
    console.log(`  - Perusahaan: ${payload.companyName || '-'}`);
    console.log(`  - Layanan: ${payload.serviceType}`);
    console.log(`  - Anggaran: ${payload.budgetRange}`);
    console.log(`  - Deskripsi: ${payload.projectDescription.slice(0, 100)}...`);
    console.log(`  - Waktu: ${payload.createdAt.toISOString()}\n`);
    return true;
  }
}

/**
 * Helper untuk mem-parsing satu atau banyak Telegram Chat ID (string koma/spasi atau JSON)
 */
export function parseTelegramChatIds(raw: string | null | undefined): string[] {
  if (!raw || !raw.trim()) return [];
  const trimmed = raw.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => (typeof item === 'string' ? item : item?.id))
          .filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
          .map((id) => id.trim());
      }
    } catch {
      // fallback
    }
  }
  return trimmed
    .split(/[\s,;]+/)
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * Adapter 2: Telegram Notifier
 * Mengirimkan pesan instan terformat ke Telegram Bot & Grup Tim Saluang Teknologi.
 */
export class TelegramNotificationAdapter implements NotificationAdapter {
  name = 'telegram';

  async sendLeadNotification(payload: NotificationPayload): Promise<boolean> {
    let token = process.env.TELEGRAM_BOT_TOKEN;
    let chatId = process.env.TELEGRAM_CHAT_ID;

    // Prioritaskan konfigurasi dinamis yang tersimpan di basis data (company_settings)
    try {
      const { db } = await import('@/lib/db');
      const { companySettings } = await import('@/lib/db/schema');
      const { eq } = await import('drizzle-orm');
      const rows = await db
        .select({
          token: companySettings.telegramBotToken,
          chatId: companySettings.telegramChatId,
          enabled: companySettings.telegramEnabled,
        })
        .from(companySettings)
        .where(eq(companySettings.id, 'default'))
        .limit(1);

      if (rows && rows.length > 0) {
        if (rows[0].enabled === false) {
          console.log('[Notification:Telegram] Notifikasi Telegram dinonaktifkan di pengaturan database.');
          return false;
        }
        if (rows[0].token && rows[0].token.trim()) token = rows[0].token.trim();
        if (rows[0].chatId && rows[0].chatId.trim()) chatId = rows[0].chatId.trim();
      }
    } catch (dbErr) {
      console.warn('[Notification:Telegram] Gagal membaca config dari basis data, menggunakan env:', dbErr);
    }

    // Jika kredensial belum diisi atau masih placeholder, lewati pengiriman
    if (!token || !chatId || token.includes('placeholder') || chatId.includes('placeholder')) {
      console.log('[Notification:Telegram] Kredensial TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID belum dikonfigurasi, lewati pengiriman.');
      return false;
    }

    // Mendukung multiple chat IDs (misal: "1143585924, -10012345678" atau format JSON)
    const targetChatIds = parseTelegramChatIds(chatId);

    if (targetChatIds.length === 0) {
      return false;
    }

    const message = [
      '🚀 <b>Permintaan Proyek Baru Masuk!</b>',
      '────────────────────────────',
      `👤 <b>Nama:</b> ${escapeHtml(payload.fullName)}`,
      `📧 <b>Email:</b> ${escapeHtml(payload.email)}`,
      `📱 <b>WhatsApp:</b> <a href="https://wa.me/${cleanWaNumber(payload.whatsapp)}">${escapeHtml(payload.whatsapp)}</a>`,
      `🏢 <b>Perusahaan:</b> ${escapeHtml(payload.companyName || '-')}`,
      `🛠 <b>Layanan:</b> ${escapeHtml(payload.serviceType)}`,
      `💰 <b>Anggaran:</b> ${escapeHtml(payload.budgetRange)}`,
      '────────────────────────────',
      `📝 <b>Deskripsi Kebutuhan:</b>\n${escapeHtml(payload.projectDescription)}`,
      '────────────────────────────',
      `🕒 <i>${payload.createdAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</i>`,
    ].join('\n');

    let atLeastOneSuccess = false;
    for (const targetId of targetChatIds) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });

        const data = await response.json();
        if (data.ok) {
          atLeastOneSuccess = true;
        } else {
          console.error(`[Notification:Telegram] Gagal mengirim pesan ke ID ${targetId}:`, data.description);
        }
      } catch (error) {
        console.error(`[Notification:Telegram] Gangguan jaringan saat menghubungi Telegram API untuk ID ${targetId}:`, error);
      }
    }

    return atLeastOneSuccess;
  }
}

/**
 * Adapter 3: Email Notifier
 * Mendukung pengiriman via webhook API / SMTP email notifikasi.
 */
export class EmailNotificationAdapter implements NotificationAdapter {
  name = 'email';

  async sendLeadNotification(payload: NotificationPayload): Promise<boolean> {
    const smtpHost = process.env.SMTP_HOST;
    const notifyEmail = process.env.NOTIFICATION_EMAIL || process.env.NEXT_PUBLIC_COMPANY_EMAIL;

    if (!smtpHost || smtpHost.includes('placeholder')) {
      console.log(`[Notification:Email] SMTP_HOST belum dikonfigurasi, pengiriman email ke ${notifyEmail} dilewati.`);
      return false;
    }

    // Untuk Fase 1, logging siap dikaitkan dengan Nodemailer / Resend
    console.log(`[Notification:Email] Menyiapkan email notifikasi lead ${payload.id} ke ${notifyEmail}`);
    return true;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits;
}

/**
 * Mendapatkan daftar adapter aktif berdasarkan environment variable
 */
export function getActiveNotificationAdapters(): NotificationAdapter[] {
  const channels = (process.env.NOTIFICATION_CHANNELS || 'mock')
    .toLowerCase()
    .split(',')
    .map((c) => c.trim());

  const adapters: NotificationAdapter[] = [];

  if (channels.includes('mock') || channels.includes('all')) {
    adapters.push(new MockNotificationAdapter());
  }

  const hasTelegramConfig = Boolean(
    process.env.TELEGRAM_BOT_TOKEN &&
    process.env.TELEGRAM_CHAT_ID &&
    !process.env.TELEGRAM_BOT_TOKEN.includes('placeholder') &&
    !process.env.TELEGRAM_CHAT_ID.includes('placeholder')
  );

  if (channels.includes('telegram') || channels.includes('all') || hasTelegramConfig) {
    adapters.push(new TelegramNotificationAdapter());
  }

  if (channels.includes('email') || channels.includes('all')) {
    adapters.push(new EmailNotificationAdapter());
  }

  // Jika tidak ada yang cocok, gunakan mock sebagai fallback aman
  if (adapters.length === 0) {
    adapters.push(new MockNotificationAdapter());
  }

  return adapters;
}

/**
 * Mengirim notifikasi ke seluruh adapter yang aktif
 */
export async function dispatchLeadNotification(payload: NotificationPayload): Promise<void> {
  const adapters = getActiveNotificationAdapters();

  await Promise.allSettled(
    adapters.map(async (adapter) => {
      try {
        await adapter.sendLeadNotification(payload);
      } catch (err) {
        console.error(`[Notification] Kesalahan pada adapter ${adapter.name}:`, err);
      }
    })
  );
}
