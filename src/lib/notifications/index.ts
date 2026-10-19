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
 * Adapter 2: Telegram Notifier
 * Mengirimkan pesan instan terformat ke Telegram Bot & Grup Tim Saluang Teknologi.
 */
export class TelegramNotificationAdapter implements NotificationAdapter {
  name = 'telegram';

  async sendLeadNotification(payload: NotificationPayload): Promise<boolean> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Jika kredensial belum diisi atau masih placeholder, fallback ke log
    if (!token || !chatId || token.includes('placeholder') || chatId.includes('placeholder')) {
      console.log('[Notification:Telegram] Kredensial TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID belum dikonfigurasi, lewati pengiriman.');
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

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await response.json();
      if (!data.ok) {
        console.error('[Notification:Telegram] Gagal mengirim pesan Telegram:', data.description);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Notification:Telegram] Gangguan jaringan saat menghubungi Telegram API:', error);
      return false;
    }
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

  if (channels.includes('telegram') || channels.includes('all')) {
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
