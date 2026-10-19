import { ServiceItem } from '@/types/service';

export const servicesData: ServiceItem[] = [
  {
    id: 'srv-web',
    slug: 'website',
    title: 'Jasa Pembuatan Website Profesional & Berkecepatan Tinggi',
    shortTitle: 'Website Profesional',
    subtitle: 'Etalase digital elegan, responsif, dan optimal di mesin pencari Google.',
    tagline: 'Tingkatkan kredibilitas dan konversi penjualan dengan situs web berperforma prima.',
    heroDescription:
      'Kami merancang dan membangun website profil perusahaan, landing page konversi tinggi, hingga portal berita dengan standar arsitektur modern Next.js. Ringan dibuka di smartphone, aman dengan enkripsi SSL, dan ramah SEO.',
    iconName: 'Globe',
    badge: 'Populer untuk UMKM & Perusahaan',
    problemsSolved: [
      'Website lama lambat dan sulit dibuka lewat ponsel pelanggan.',
      'Situs web tidak muncul di pencarian Google untuk kata kunci bisnis yang relevan.',
      'Desain terlihat usang sehingga mengurangi kepercayaan calon klien atau investor.',
      'Ketiadaan formulir terintegrasi WhatsApp untuk menangkap calon pembeli seketika.',
    ],
    features: [
      'Desain Responsif Mobile-First (skor Lighthouse tinggi)',
      'Optimasi SEO On-Page (struktur Schema.org, OpenGraph, sitemap)',
      'Integrasi Tombol WhatsApp & Formulir Kontak Interaktif',
      'Keamanan HTTPS/SSL, Honeypot Anti-Spam & Sanitasi Input',
      'Manajemen Konten Mudah & Panduan Operasional Lengkap',
    ],
    deliverables: [
      {
        title: 'Kode Sumber Bersih & Bergaransi',
        description: 'Repositari Git terorganisir, standar TypeScript, tanpa lisensi tersembunyi.',
      },
      {
        title: 'Deployment & Konfigurasi Domain/Server',
        description: 'Bantuan setup di Cloud VPS/Vercel/Hosting lokal dengan SSL terpasang.',
      },
      {
        title: 'Dokumentasi & Sesi Pendampingan',
        description: 'Video panduan dan berkas petunjuk pembaruan konten mandiri bagi tim internal.',
      },
    ],
    workflow: [
      {
        step: 1,
        title: 'Konsultasi & Analisis Kebutuhan',
        description: 'Identifikasi target pengunjung, struktur sitemap, dan materi konten utama.',
        duration: '1–2 Hari',
      },
      {
        step: 2,
        title: 'Perancangan Wireframe & Desain Visual',
        description: 'Penyusunan tata letak antarmuka (UI) interaktif yang disetujui klien.',
        duration: '3–5 Hari',
      },
      {
        step: 3,
        title: 'Pengembangan Frontend & Integrasi',
        description: 'Implementasi kode Next.js, animasi halus, dan responsivitas lintas gawai.',
        duration: '5–10 Hari',
      },
      {
        step: 4,
        title: 'Pengujian, Optimasi & Peluncuran',
        description: 'Audit performa Lighthouse, uji keamanan, dan rilis ke domain resmi.',
        duration: '2–3 Hari',
      },
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel / VPS Linux'],
    accentColor: '#0EA5E9',
  },
  {
    id: 'srv-si',
    slug: 'sistem-informasi',
    title: 'Pengembangan Sistem Informasi & Perangkat Lunak Manajemen',
    shortTitle: 'Sistem Informasi',
    subtitle: 'Otomatisasi operasional, kelola data terpusat, dan tingkatkan efisiensi organisasi.',
    tagline: 'Tinggalkan pencatatan manual. Kendalikan alur kerja bisnis secara real-time dan akurat.',
    heroDescription:
      'Solusi software berbasis web kustom untuk instansi pemerintah, lembaga pendidikan, dan perusahaan swasta. Mulai dari sistem inventaris, ERP mini, CRM penjualan, sistem kepegawaian, hingga dashboard eksekutif analitis.',
    iconName: 'Database',
    badge: 'Paling Dicari Instansi & Korporasi',
    problemsSolved: [
      'Data operasional tercecer di berbagai spreadsheet yang rawan duplikasi dan hilang.',
      'Proses persetujuan birokrasi dan rekap laporan memakan waktu berhari-hari.',
      'Kurangnya kontrol hak akses (role-based permissions) antar divisi kerja.',
      'Sistem lama lambat, sering crash saat jam sibuk, atau vendor lama tidak dapat dihubungi.',
    ],
    features: [
      'Manajemen Hak Akses Bertingkat (RBAC - Multi-Level Roles)',
      'Dashboard Analitik Real-Time dengan Visualisasi Grafik Interaktif',
      'Ekspor Laporan Otomatis (Format Excel, PDF, CSV)',
      'Audit Trail Riwayat Aktivitas & Perubahan Data Sistem',
      'Arsitektur Basis Data Terindeks Cepat (MySQL / PostgreSQL)',
    ],
    deliverables: [
      {
        title: 'Sistem Informasi Web Siap Pakai',
        description: 'Aplikasi lengkap terpasang di server lokal instansi atau cloud private.',
      },
      {
        title: 'Manual Book & SOP Operasional',
        description: 'Buku panduan resmi untuk administrator dan operator harian.',
      },
      {
        title: 'Garansi Bug & Pemeliharaan Berkala',
        description: 'Dukungan perbaikan bug dan pemantauan performa pasca rilis resmi.',
      },
    ],
    workflow: [
      {
        step: 1,
        title: 'Bedah Proses Bisnis & Data Mapping',
        description: 'Wawancara stakeholder divisi untuk memetakan alur dokumen dan skema data.',
        duration: '3–7 Hari',
      },
      {
        step: 2,
        title: 'Desain Skema Database & Prototyping',
        description: 'Penyusunan Entity Relationship Diagram (ERD) dan mockup alur interaksi.',
        duration: '5–10 Hari',
      },
      {
        step: 3,
        title: 'Pengembangan Sistem & Logika Bisnis',
        description: 'Pengkodean modul CRUD, validasi ketat, pelaporan, dan security hardening.',
        duration: '2–4 Minggu',
      },
      {
        step: 4,
        title: 'UAT (User Acceptance Testing) & Pelatihan',
        description: 'Pengujian bersama staf, revisi akhir, dan sesi workshop penggunaan sistem.',
        duration: '1 Minggu',
      },
    ],
    techStack: ['Next.js / Node.js', 'MySQL / PostgreSQL', 'Drizzle ORM', 'TypeScript', 'Tailwind CSS', 'Docker'],
    accentColor: '#06B6D4',
  },
  {
    id: 'srv-android',
    slug: 'aplikasi-android',
    title: 'Jasa Pembuatan Aplikasi Android Modern & Ergonomis',
    shortTitle: 'Aplikasi Android',
    subtitle: 'Jangkau jutaan pengguna smartphone dengan aplikasi mobile yang gesit dan intuitif.',
    tagline: 'Hadirkan layanan Anda langsung di saku pelanggan dengan aplikasi yang memikat.',
    heroDescription:
      'Pengembangan aplikasi Android untuk e-commerce lokal, kasir pintar (POS), tracking kurir/lapangan, aplikasi internal karyawan, hingga komunitas digital. Ringan, hemat baterai, dan terintegrasi aman dengan API server.',
    iconName: 'Smartphone',
    badge: 'Solusi Mobilitas Pelanggan',
    problemsSolved: [
      'Pelanggan enggan membuka browser untuk transaksi berulang yang membutuhkan notifikasi instan.',
      'Tim sales/kurir di lapangan kesulitan mengirim data lokasi dan bukti kerja seketika.',
      'Aplikasi mobile vendor sebelumnya sering force-close dan boros memori ponsel.',
      'Proses publikasi ke Google Play Store ditolak karena kendala kebijakan teknis.',
    ],
    features: [
      'Antarmuka Pengguna Modern Mengikuti Prinsip Material Design 3',
      'Push Notification Real-Time (Firebase Cloud Messaging)',
      'Dukungan Mode Offline & Sinkronisasi Data Otomatis',
      'Integrasi Kamera, GPS Geolocation, & Barcode/QR Scanner',
      'Pendampingan Pendaftaran & Penerbitan di Google Play Store',
    ],
    deliverables: [
      {
        title: 'Berkas APK / Android App Bundle (AAB)',
        description: 'File rilis teroptimasi siap unggah ke Google Play Console.',
      },
      {
        title: 'RESTful API Endpoint & Dokumentasi',
        description: 'Konektor backend yang aman dengan token authentication (JWT / Session).',
      },
      {
        title: 'Dukungan Rilis Play Store',
        description: 'Bantuan pengisian data privasi, screenshot promo, dan kepatuhan kebijakan Google.',
      },
    ],
    workflow: [
      {
        step: 1,
        title: 'User Journey & Wireframing',
        description: 'Menentukan alur navigasi layar (screen flow) yang paling singkat dan nyaman.',
        duration: '3–5 Hari',
      },
      {
        step: 2,
        title: 'UI Design & Interactive Prototype',
        description: 'Desain visual visual aplikasi resolusi tinggi dengan panduan komponen standar.',
        duration: '5–7 Hari',
      },
      {
        step: 3,
        title: 'Pengembangan Native/Hybrid & API Integration',
        description: 'Koding logika aplikasi, integrasi hardware (kamera/GPS), dan API backend.',
        duration: '2–4 Minggu',
      },
      {
        step: 4,
        title: 'Quality Assurance & Publikasi Play Store',
        description: 'Uji perangkat nyata (real-device testing), pengemasan AAB, dan pengajuan rilis.',
        duration: '1–2 Minggu',
      },
    ],
    techStack: ['React Native / Flutter / Android Native', 'TypeScript', 'Node.js API', 'Firebase', 'REST / GraphQL'],
    accentColor: '#10B981',
  },
  {
    id: 'srv-software',
    slug: 'software-lainnya',
    title: 'Rekayasa Perangkat Lunak Khusus, API & Integrasi Sistem',
    shortTitle: 'Software Lainnya',
    subtitle: 'Solusi perangkat lunak tailor-made untuk kebutuhan spesifik yang tidak dapat diselesaikan produk generik.',
    tagline: 'Kustomisasi tanpa batas untuk memecahkan tantangan teknologi paling rumit dalam bisnis Anda.',
    heroDescription:
      'Kami merancang backend berkecepatan tinggi, integrasi payment gateway (Midtrans, Xendit), sistem SMS/WhatsApp Gateway otomatis, perantara antarmuka IoT/hardware (RFID, fingerprint), hingga migrasi arsitektur sistem lama ke cloud modern.',
    iconName: 'Cpu',
    badge: 'Solusi Rekayasa Khusus',
    problemsSolved: [
      'Sistem yang sudah ada tidak bisa berkomunikasi dengan aplikasi pihak ketiga atau perbankan.',
      'Kebutuhan integrasi hardware khusus (seperti barcode scanner industri atau turnstile gate).',
      'Server sering down saat lonjakan trafik karena arsitektur monolitik yang belum teroptimasi.',
      'Proses sinkronisasi data antar cabang membutuhkan waktu manual yang lambat dan rawan fraud.',
    ],
    features: [
      'Pembangunan Arsitektur REST API & Webhook Aman Berenkripsi',
      'Integrasi Payment Gateway, Logistik & WhatsApp Notification API',
      'Containerisasi Docker untuk Portabilitas & Skalabilitas Deployment',
      'Otomatisasi Bot Tugas Rutin (Data Scraping / Sync Scheduler)',
      'Security Hardening, Rate Limiting & Proteksi Serangan DDOS',
    ],
    deliverables: [
      {
        title: 'Modul Software Kustom & Source Code Lengkap',
        description: 'Kode terstruktur, terdokumentasi rapi dengan spesifikasi OpenAPI/Swagger.',
      },
      {
        title: 'Arsitektur Docker Compose Siap Pakai',
        description: 'Skrip otomatisasi lingkungan server yang memudahkan reproduksi sistem.',
      },
      {
        title: 'SLA Performa & Pemeliharaan Khusus',
        description: 'Kesepakatan tingkat layanan ketersediaan dan respon cepat penanganan kendala.',
      },
    ],
    workflow: [
      {
        step: 1,
        title: 'Audit Arsitektur & Analisis Teknis',
        description: 'Evaluasi infrastruktur server lama, skema API, dan spesifikasi perangkat keras.',
        duration: '2–4 Hari',
      },
      {
        step: 2,
        title: 'Perancangan Solusi Arsitektur',
        description: 'Pembuatan diagram topologi, alur data protokol, dan mitigasi bottleneck.',
        duration: '3–5 Hari',
      },
      {
        step: 3,
        title: 'Implementasi & Koding Modul Spesifik',
        description: 'Pengembangan backend service, integrasi webhook, dan pengujian beban (load test).',
        duration: '1–3 Minggu',
      },
      {
        step: 4,
        title: 'Integrasi Live & Stress Test',
        description: 'Pengujian terintegrasi di staging environment sebelum diarahkan ke produksi.',
        duration: '3–5 Hari',
      },
    ],
    techStack: ['Node.js', 'Go / Python', 'Docker', 'Redis', 'RabbitMQ / Kafka', 'Linux Server'],
    accentColor: '#6366F1',
  },
];
