# Saluang Teknologi — Website Profil Perusahaan & Backend Engine

Repositori resmi website profil perusahaan startup **Saluang Teknologi** — penyedia jasa rekayasa perangkat lunak, pembuatan website profesional berkecepatan tinggi, sistem informasi manajemen kustom, aplikasi Android, dan integrasi perangkat lunak khusus.

Proyek ini dibangun secara *fullstack* menggunakan arsitektur modern **Next.js 14 App Router**, **Drizzle ORM**, **TiDB Cloud (MySQL-compatible)**, sistem autentikasi **Better Auth**, proteksi spam berlapis (Cloudflare Turnstile, in-memory rate limiter, honeypot), dan sistem notifikasi modular (Mock, Telegram, Email). Aplikasi di-deploy ke **Vercel** sebagai platform serverless.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + High-Contrast Modern Neo-Brutalist Theme (`#3A1F3D`, `bg-saluang-cream`, `bg-saluang-sand`, `shadow-neo`)
- **Animasi & Interaksi**: Framer Motion (Transisi halus, scroll reveal, fallback `prefers-reduced-motion`)
- **Ikonografi**: Lucide React
- **Formulir & Validasi**: React Hook Form + Zod skema validasi ganda (klien & server)
- **Aksesibilitas & SEO**: Standar WCAG 2.1 AA, JSON-LD Schema.org, Open Graph, dynamic sitemap & robots

### Backend & Database
- **API Engine**: Next.js Route Handlers (`/api/leads`, `/api/auth/[...all]`)
- **Database**: TiDB Cloud (MySQL-compatible, serverless-friendly)
- **ORM & Migrations**: Drizzle ORM (`drizzle-orm` + `drizzle-kit` + `mysql2` connection pool)
- **Fallback Strategi**: Arsitektur akses data publik (`src/lib/data/`) membaca database secara asinkron dengan fallback otomatis ke mock data jika database sedang *offline*.

### Keamanan & Autentikasi
- **Autentikasi**: Better Auth (Email & Password, Session Cookies, Drizzle Adapter)
- **Proteksi Rute**: Next.js Edge Middleware (`src/middleware.ts`) mengamankan rute `/admin/*`
- **Proteksi Spam**:
  - Cloudflare Turnstile token validation (dengan bypass mode untuk development)
  - In-Memory IP Rate Limiter (maksimal 5 request / 15 menit per IP)
  - Honeypot form field (`website_url_check`) untuk menjebak bot otomatis
  - Pembersihan input HTML / XSS sanitization (`src/lib/security/sanitize.ts`)
- **Sistem Notifikasi**: Modular dispatcher (`src/lib/notifications/`) mendukung multi-channel: Mock Logger (Development), Telegram Bot API, dan SMTP Email.

### Deployment & Hosting
- **Platform**: Vercel (Serverless Functions, Edge Network, Auto CI/CD)
- **Database Cloud**: TiDB Cloud (MySQL-compatible serverless database)
- **Region**: Singapore (`sin1`) — terdekat ke Indonesia

---

## 🛠️ Pengembangan Lokal (Local Development)

### Prasyarat
- **Node.js** 18 atau 20 (cek dengan `node -v`)
- **npm** (bawaan Node.js, cek dengan `npm -v`)
- **Database MySQL** yang bisa diakses (lokal atau TiDB Cloud)

### 1. Instalasi Dependensi

```bash
npm install
```

### 2. Konfigurasi Environment

Salin file template `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi konfigurasi database Anda:

```env
# Untuk MySQL lokal:
DATABASE_URL=mysql://root:password@localhost:3306/saluang_db
DB_SSL=false

# Untuk TiDB Cloud:
DATABASE_URL=mysql://user:pass@gateway01.region.prod.aws.tidbcloud.com:4000/saluang_db
DB_SSL=true
```

### 3. Migrasi & Seeding Database

```bash
# Jalankan migrasi skema
npm run db:migrate

# Isi data awal (layanan, portofolio, tim, akun admin)
npm run db:seed
```

- **Akun Admin Awal (Seed)**:
  - Email: `admin@saluangteknologi.com`
  - Password Awal: `AdminSaluang2026!` *(Terenkripsi otomatis via scrypt hash di database)*
  - Dashboard: [http://localhost:3000/admin/leads](http://localhost:3000/admin/leads)

### 4. Menjalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 👤 Manajemen Akun Administrator

Kredensial administrator **TIDAK disimpan di file `.env`** demi keamanan. Seluruh akun tersimpan langsung di database dan kata sandi dienkripsi (*scrypt hash*).

```bash
# Membuat admin baru
npm run admin:create <email> <password> [nama]

# Mereset kata sandi admin
npm run admin:reset-password <email> <password_baru>

# Melihat daftar admin
npm run admin:list
```

---

## 🧪 Pengujian Otomatis

```bash
npm test
```

Hasil uji mencakup:
1. `POST /api/leads` — Simpan lead, validasi Zod, honeypot, rate limiter
2. `Better Auth` — Login admin, tolak password salah, tolak email tidak terdaftar

---

## 🔍 Pengecekan Kualitas Kode

```bash
# Type-check (TypeScript)
npm run type-check

# Linting (ESLint)
npm run lint

# Build produksi
npm run build
```

---

## 🌐 Deployment ke Vercel

### 1. Push ke GitHub

Pastikan repositori sudah di-push ke GitHub.

### 2. Import ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login
2. Klik **"Add New" → "Project"**
3. Import repositori GitHub
4. Vercel akan otomatis mendeteksi framework Next.js

### 3. Konfigurasi Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

| Variabel | Nilai | Wajib? |
| :--- | :--- | :---: |
| `DATABASE_URL` | `mysql://user:pass@host:port/db` (dari TiDB Cloud) | ✅ |
| `DB_SSL` | `true` | ✅ |
| `BETTER_AUTH_SECRET` | String acak min 32 karakter (`openssl rand -hex 32`) | ✅ |
| `BETTER_AUTH_URL` | `https://yourdomain.vercel.app` | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.vercel.app` | ✅ |
| `NEXT_PUBLIC_COMPANY_NAME` | `Saluang Teknologi` | ✅ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WA resmi | ✅ |
| `NEXT_PUBLIC_COMPANY_EMAIL` | Email resmi | ✅ |
| `NEXT_PUBLIC_COMPANY_ADDRESS` | Alamat kantor | ✅ |
| `ENABLE_TURNSTILE` | `true` | Disarankan |
| `TURNSTILE_SECRET_KEY` | Dari Cloudflare | Jika Turnstile aktif |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Dari Cloudflare | Jika Turnstile aktif |
| `NOTIFICATION_CHANNELS` | `telegram` / `email` / `all` | Disarankan |
| `TELEGRAM_BOT_TOKEN` | Dari @BotFather | Jika pakai Telegram |
| `TELEGRAM_CHAT_ID` | Chat ID tujuan | Jika pakai Telegram |

### 4. Deploy

Setelah environment variables diatur, klik **Deploy**. Vercel akan:
- Menjalankan `npm run build` otomatis
- Deploy ke edge network global
- Setiap push ke branch `main` akan auto-deploy

### 5. Migrasi Database (Satu Kali)

Setelah deployment pertama, jalankan migrasi dan seeding secara lokal menggunakan `DATABASE_URL` TiDB Cloud yang sama:

```bash
# Pastikan .env berisi DATABASE_URL TiDB Cloud Anda
npm run db:migrate
npm run db:seed
npm run admin:create admin@saluangteknologi.com <password_aman> "Admin Saluang"
```

---

## 📁 Struktur Direktori

```text
├── vercel.json               # Konfigurasi Vercel (region, function duration)
├── drizzle.config.ts         # Konfigurasi Drizzle ORM & Kit
├── .env.example              # Template variabel lingkungan komprehensif
├── next.config.mjs           # Konfigurasi Next.js & optimasi gambar
├── tailwind.config.ts        # Design tokens: palet warna brand, shadow neo, fonts
├── drizzle/                  # Berkas migrasi SQL hasil generate Drizzle Kit
├── tests/                    # Pengujian otomatis backend
│   ├── run-all.ts            # Test runner terpadu
│   └── api/
│       ├── leads.test.ts     # Uji API leads, rate limit, honeypot, & notifikasi
│       └── auth.test.ts      # Uji Better Auth login & proteksi sesi
└── src/
    ├── middleware.ts         # Next.js Edge Middleware untuk proteksi rute /admin/*
    ├── scripts/              # CLI utilitas manajemen admin
    ├── app/                  # Next.js 14 App Router
    │   ├── page.tsx          # Beranda (Hero, Layanan, Portofolio Pilihan, Tim, CTA)
    │   ├── layanan/          # Halaman indeks layanan & detail dinamis [slug]
    │   ├── portofolio/       # Portofolio proyek interaktif & modal studi kasus
    │   ├── tentang/          # Profil Saluang Teknologi, visi misi, & tim
    │   ├── kontak/           # Halaman kontak & form permintaan proyek
    │   ├── login/            # Halaman login administrator
    │   ├── admin/
    │   │   ├── page.tsx      # Redirect ke /admin/leads
    │   │   └── leads/        # Panel monitoring permintaan proyek (Admin Leads Dashboard)
    │   └── api/
    │       ├── leads/        # Endpoint POST /api/leads
    │       └── auth/         # Endpoint Better Auth handler [...all]
    ├── components/
    │   ├── ui/               # Komponen primitif (Button, GlassCard, Section, Container, Badge)
    │   ├── layout/           # Navbar sticky, Footer, FloatingWhatsApp, CookieBanner
    │   ├── home/             # Hero, FeaturedProjects, WhyChooseUs, HomeCTA
    │   ├── contact/          # ProjectInquiryForm (terhubung ke POST /api/leads)
    │   └── admin/            # Komponen AdminLeadsClient & filter status lead
    ├── lib/
    │   ├── auth.ts           # Konfigurasi server-side Better Auth
    │   ├── auth-client.ts    # Klien Better Auth untuk komponen React
    │   ├── db/               # Inisialisasi koneksi MySQL, skema Drizzle, runner migrasi & seed
    │   │   ├── index.ts      # Pool MySQL & Drizzle instance (SSL + serverless optimized)
    │   │   ├── schema.ts     # Skema tabel (leads, services, portfolio, team, auth)
    │   │   ├── migrate.ts    # Skrip runner migrasi database
    │   │   └── seed.ts       # Skrip seeding data awal
    │   ├── security/         # Proteksi keamanan aplikasi
    │   │   ├── rateLimiter.ts# In-memory IP rate limiter
    │   │   ├── turnstile.ts  # Verifikasi token Cloudflare Turnstile
    │   │   └── sanitize.ts   # Sanitasi payload teks dari XSS/HTML
    │   ├── notifications/    # Sistem notifikasi modular (Mock, Telegram, Email)
    │   └── data/             # Layer data publik (DB query dengan fallback mock data)
    ├── schemas/              # Skema validasi Zod (inquirySchema, loginSchema)
    └── types/                # Definisi antarmuka TypeScript
```

---

## ⚙️ Variabel Lingkungan (`.env`)

Salin berkas `.env.example` ke `.env` sebelum menjalankan aplikasi:

| Kategori | Variabel | Deskripsi | Default / Contoh |
| :--- | :--- | :--- | :--- |
| **Situs Publik** | `NEXT_PUBLIC_SITE_URL` | Domain utama aplikasi | `http://localhost:3000` |
| | `NEXT_PUBLIC_COMPANY_NAME` | Nama legal atau merek usaha | `Saluang Teknologi` |
| | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WhatsApp resmi (format internasional tanpa `+`) | `6281234567890` |
| | `NEXT_PUBLIC_COMPANY_EMAIL` | Email resmi perusahaan | `kontak@saluangteknologi.com` |
| | `NEXT_PUBLIC_COMPANY_ADDRESS` | Alamat kantor | `Padang, Sumatera Barat, Indonesia` |
| **Basis Data** | `DATABASE_URL` | URL koneksi MySQL / TiDB Cloud | `mysql://root:pass@localhost:3306/saluang_db` |
| | `DB_SSL` | Aktifkan SSL untuk koneksi database cloud | `false` (lokal) / `true` (TiDB) |
| **Autentikasi** | `BETTER_AUTH_SECRET` | Kunci rahasia hashing sesi (min. 32 karakter) | *(wajib diganti di produksi)* |
| | `BETTER_AUTH_URL` | Base URL untuk callback Better Auth | `http://localhost:3000` |
| *(Akun Admin)* | *(Tidak memakai .env)* | Kredensial disimpan langsung di MySQL & dienkripsi via scrypt | Dikelola via `npm run admin:create` |
| **Spam & Keamanan** | `ENABLE_TURNSTILE` | Mengaktifkan verifikasi Cloudflare Turnstile (`true`/`false`) | `false` |
| | `TURNSTILE_SECRET_KEY` | Secret key Cloudflare Turnstile | `0x4AAAAAA_placeholder` |
| | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key publik Cloudflare Turnstile | `0x4AAAAAA_placeholder` |
| **Notifikasi Tim** | `NOTIFICATION_CHANNELS` | Saluran aktif: `mock`, `telegram`, `email`, `all` | `mock` |
| | `NOTIFICATION_EMAIL` | Email tujuan notifikasi tim internal | `kontak@saluangteknologi.com` |
| | `TELEGRAM_BOT_TOKEN` | Token Bot Telegram dari @BotFather | *(opsional)* |
| | `TELEGRAM_CHAT_ID` | Chat ID Telegram grup/pribadi tim | *(opsional)* |

---

## 📌 Registri Placeholder (Production Readiness Checklist)

Sebelum merilis ke produksi, pastikan variabel placeholder berikut telah diganti:

| No | Komponen | Variabel / Berkas | Keterangan & Tindakan | Status Rilis |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Secret Autentikasi** | `BETTER_AUTH_SECRET` | Buat string acak kriptografis 32+ karakter (`openssl rand -hex 32`) | ⚠️ Placeholder |
| 2 | **Akun Administrator** | Database | Ganti password awal: `npm run admin:reset-password admin@saluangteknologi.com <pw_baru>` | ⚠️ Default |
| 3 | **Database URL** | `DATABASE_URL` | Pastikan mengarah ke TiDB Cloud produksi (bukan lokal) | ⚠️ Placeholder |
| 4 | **Cloudflare Turnstile** | `ENABLE_TURNSTILE=true` | Daftarkan domain di Cloudflare Turnstile dan pasang keys resmi | ⚠️ Nonaktif |
| 5 | **Saluran Notifikasi** | `NOTIFICATION_CHANNELS` | Ubah dari `mock` ke `telegram` / `email` | ⚠️ Mock Aktif |
| 6 | **Bot Telegram Tim** | `TELEGRAM_BOT_TOKEN` & `CHAT_ID` | Buat bot via @BotFather | ⚠️ Placeholder |
| 7 | **Nomor WhatsApp** | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ganti dengan nomor CS/Marketing aktif | ⚠️ Placeholder |
| 8 | **Email Perusahaan** | `NEXT_PUBLIC_COMPANY_EMAIL` | Ganti dengan email domain resmi | ⚠️ Placeholder |
| 9 | **Foto & Profil Tim** | `src/data/team.ts` & database | Ganti foto placeholder dengan foto asli tim | ⚠️ Dummy Data |

---

## 🗺️ Roadmap Pengembangan Fase 2

1. **Panel Admin CRUD Penuh**:
   - Pengelolaan Layanan: Tambah, edit, dan nonaktifkan paket layanan dari dashboard.
   - Pengelolaan Portofolio: Unggah studi kasus baru, tangkapan layar, teknologi yang digunakan.
   - Manajemen Anggota Tim: Perbarui susunan tim, jabatan, dan tautan sosial.
2. **Blog & Knowledge Hub CMS**:
   - Sistem publikasi artikel dan wawasan teknologi dengan Rich-Text Editor.
   - Optimasi SEO otomatis per artikel.
3. **Sub-halaman Studi Kasus Portofolio Mendalam (`/portofolio/[slug]`)**:
   - Halaman detail komprehensif untuk setiap proyek.
4. **Integrasi CRM & Webhooks Eksternal**:
   - Sinkronisasi otomatis lead masuk ke Notion/Slack/HubSpot.
5. **Manajemen Hak Akses Bertingkat (RBAC)**:
   - Pembagian peran pengguna (*Super Admin*, *Sales Lead*, *Content Editor*).
