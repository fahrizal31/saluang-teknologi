import test, { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST } from '../../src/app/api/leads/route';
import { db } from '../../src/lib/db';
import { leads } from '../../src/lib/db/schema';
import { resetRateLimit } from '../../src/lib/security/rateLimiter';
import { eq } from 'drizzle-orm';

describe('POST /api/leads Test Suite', () => {
  const TEST_IP = '192.168.100.50';

  beforeEach(() => {
    resetRateLimit(TEST_IP);
  });

  const validLeadPayload = {
    fullName: 'Budi Pratama Test',
    email: 'budi.test@perusahaan.com',
    whatsapp: '081234567890',
    companyName: 'PT Maju Digital Test',
    serviceType: 'website',
    budgetRange: '25m-50m',
    projectDescription: 'Kami membutuhkan pembuatan website profil perusahaan modern dengan Next.js.',
    websiteUrlHoneypot: '',
  };

  it('1. Sukses: Menyimpan lead baru ke database dan mengembalikan status 201', async () => {
    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': TEST_IP,
      },
      body: JSON.stringify(validLeadPayload),
    });

    const response = await POST(req);
    assert.equal(response.status, 201);

    const data = await response.json();
    assert.equal(data.success, true);
    assert.ok(data.inquiryId, 'Harus mengembalikan ID inquiry');

    // Verifikasi data tersimpan di database
    const saved = await db.select().from(leads).where(eq(leads.id, data.inquiryId)).limit(1);
    assert.equal(saved.length, 1);
    assert.equal(saved[0].fullName, 'Budi Pratama Test');
    assert.equal(saved[0].email, 'budi.test@perusahaan.com');
    assert.equal(saved[0].serviceType, 'website');
    assert.equal(saved[0].status, 'baru');

    // Bersihkan data uji dari database
    await db.delete(leads).where(eq(leads.id, data.inquiryId));
  });

  it('2. Validasi Gagal: Mengembalikan status 400 jika field tidak lengkap atau format salah', async () => {
    const invalidPayload = {
      fullName: 'A', // kurang dari 3 karakter
      email: 'bukan-email-valid', // bukan format email
      whatsapp: '123', // kurang dari 9 digit
      serviceType: 'layanan-palsu', // enum tidak valid
      budgetRange: 'budget-acak',
      projectDescription: 'pendek', // kurang dari 10 karakter
    };

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': TEST_IP,
      },
      body: JSON.stringify(invalidPayload),
    });

    const response = await POST(req);
    assert.equal(response.status, 400);

    const data = await response.json();
    assert.equal(data.success, false);
    assert.ok(data.errors, 'Harus mengembalikan daftar error validasi Zod');
    assert.ok(data.errors.fullName);
    assert.ok(data.errors.email);
    assert.ok(data.errors.whatsapp);
    assert.ok(data.errors.serviceType);
  });

  it('3. Honeypot Anti-Spam: Mengembalikan status 400 dan menolak submission bila bot mengisi honeypot', async () => {
    const spamPayload = {
      ...validLeadPayload,
      websiteUrlHoneypot: 'https://spam-bot-marketing.com',
    };

    const req = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': TEST_IP,
      },
      body: JSON.stringify(spamPayload),
    });

    const response = await POST(req);
    assert.equal(response.status, 400);

    const data = await response.json();
    assert.equal(data.success, false);
    assert.equal(data.message, 'Spam terdeteksi.');
  });

  it('4. Rate Limit Exceeded: Mengembalikan status 429 jika melebihi batas request per IP', async () => {
    const RATE_LIMIT_IP = '10.0.0.99';
    resetRateLimit(RATE_LIMIT_IP);

    // Kirim 5 request yang diizinkan
    for (let i = 0; i < 5; i++) {
      const req = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': RATE_LIMIT_IP,
        },
        body: JSON.stringify(validLeadPayload),
      });

      const res = await POST(req);
      assert.equal(res.status, 201);
      const resJson = await res.json();
      if (resJson.inquiryId) {
        await db.delete(leads).where(eq(leads.id, resJson.inquiryId));
      }
    }

    // Request ke-6 harus ditolak oleh Rate Limiter
    const blockedReq = new NextRequest('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': RATE_LIMIT_IP,
      },
      body: JSON.stringify(validLeadPayload),
    });

    const blockedRes = await POST(blockedReq);
    assert.equal(blockedRes.status, 429);

    const blockedData = await blockedRes.json();
    assert.equal(blockedData.success, false);
    assert.ok(blockedData.message.includes('Terlalu banyak permintaan'));
    assert.ok(blockedRes.headers.get('Retry-After'));

    // Bersihkan
    resetRateLimit(RATE_LIMIT_IP);
  });
});
