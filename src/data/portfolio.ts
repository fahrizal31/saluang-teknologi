import { PortfolioProject } from '@/types/portfolio';

export const portfolioData: PortfolioProject[] = [
  {
    id: 'proj-1',
    slug: 'sim-klinik-sehat-mandiri',
    title: 'Sistem Informasi Manajemen Klinik & Rekam Medis Elektronik',
    clientName: 'Klinik Pratama Sehat Mandiri',
    category: 'sistem-informasi',
    categoryLabel: 'Sistem Informasi',
    summary:
      'Digitalisasi menyeluruh alur pendaftaran pasien, antrean poli, rekam medis elektronik (RME), dan stok farmasi terintegrasi.',
    problem:
      'Pencatatan rekam medis berbasis kertas sering tercecer dan memperlambat waktu tunggu pasien hingga 45 menit per kunjungan.',
    solution:
      'Membangun sistem informasi berbasis web dengan antarmuka cepat, hak akses dokter/perawat/kasir yang terisolasi aman, serta pencetakan resep otomatis.',
    results: [
      'Memangkas waktu tunggu pasien dari 45 menit menjadi kurang dari 12 menit.',
      'Akurasi stok obat farmasi meningkat hingga 99.8% tanpa selisih manual.',
      'Kepatuhan 100% terhadap regulasi standar Rekam Medis Elektronik Kemenkes.',
    ],
    techStack: ['Next.js', 'TypeScript', 'MySQL', 'Drizzle ORM', 'Tailwind CSS', 'Docker'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    featured: true,
    completionYear: '2026',
    liveUrl: '#',
    testimonial: {
      quote:
        'Saluang Teknologi mengubah klinik kami dari serba manual menjadi modern. Pasien tidak lagi antre menumpuk dan dokter sangat terbantu saat membaca riwayat medis.',
      author: 'dr. H. Rahmat Syahputra, Sp.PD',
      role: 'Direktur Medis',
    },
  },
  {
    id: 'proj-2',
    slug: 'portal-resmi-wisata-sumatera',
    title: 'Portal Destinasi Wisata & Pemesanan Tiket Online Terintegrasi',
    clientName: 'Dinas Pariwisata Daerah',
    category: 'website',
    categoryLabel: 'Website Profesional',
    summary:
      'Platform website pariwisata berkecepatan tinggi dengan fitur tur virtual, peta interaktif, dan pemesanan e-tiket instan.',
    problem:
      'Situs web lama lambat, tidak mobile-friendly, dan wisatawan kesulitan mendapatkan informasi rute serta tiket resmi.',
    solution:
      'Merancang arsitektur Jamstack modern dengan Next.js App Router, caching CDN global, dan optimasi gambar otomatis untuk waktu muat di bawah 1.5 detik.',
    results: [
      'Skor Lighthouse Mobile mencapai 96/100 pada jaringan seluler 4G.',
      'Lonjakan kunjungan wisatawan naik 180% pada musim liburan pertama setelah rilis.',
      'Tingkat pentalan (bounce rate) berkurang drastis dari 68% menjadi 28%.',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Vercel Edge'],
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    featured: true,
    completionYear: '2025',
    liveUrl: '#',
    testimonial: {
      quote:
        'Desainnya sangat elegan dan cepat sekali dibuka di HP. Kredibilitas promosi wisata daerah kami melonjak drastis berkat Saluang Teknologi.',
      author: 'Drs. Afrizal M.Si',
      role: 'Kabid Promosi Pariwisata',
    },
  },
  {
    id: 'proj-3',
    slug: 'aplikasi-kurir-express-tracking',
    title: 'Aplikasi Android Pelacakan Kurir Logistik & Bukti Pengantaran',
    clientName: 'PT Andalas Kirim Cepat',
    category: 'aplikasi-android',
    categoryLabel: 'Aplikasi Android',
    summary:
      'Aplikasi mobile kurir berbasis GPS real-time dengan pemindaian barcode cepat, tanda tangan digital, dan foto bukti penerimaan.',
    problem:
      'Perusahaan kesulitan memantau posisi armada kurir secara akurat dan sering terjadi komplain paket hilang tanpa bukti foto yang valid.',
    solution:
      'Membangun aplikasi Android hemat baterai dengan offline-mode sync, scanning barcode terintegrasi kamera, dan geolokasi presisi tinggi.',
    results: [
      'Penyelesaian pengiriman paket harian meningkat 35% berkat optimasi rute.',
      'Komplain paket tidak terkirim turun hingga 92% berkat bukti foto & tanda tangan digital.',
      'Aplikasi stabil tanpa crash pada ratusan gawai kurir berspesifikasi menengah ke bawah.',
    ],
    techStack: ['React Native', 'Android Native', 'Node.js', 'Firebase Cloud Messaging', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&auto=format&fit=crop&q=80',
    featured: true,
    completionYear: '2026',
    liveUrl: '#',
    testimonial: {
      quote:
        'Tim teknis Saluang Teknologi sangat paham kebutuhan lapangan kami. Aplikasinya enteng, tidak bikin baterai kurir cepat habis, dan pelacakannya akurat.',
      author: 'Hendri Gunawan',
      role: 'Head of Operations',
    },
  },
  {
    id: 'proj-4',
    slug: 'gateway-notifikasi-payment-automation',
    title: 'Mesin Otomasi Integrasi Payment Gateway & WhatsApp Notifier',
    clientName: 'Fintech Solution Mandiri',
    category: 'software-lainnya',
    categoryLabel: 'Software Lainnya',
    summary:
      'Sistem middleware mikroservis untuk menangani webhook pembayaran bank, reconciliasi transaksi instan, dan dispatching invoice PDF via WhatsApp.',
    problem:
      'Konfirmasi pembayaran dari klien masih diverifikasi manual oleh staf keuangan, menyebabkan verifikasi tertunda hingga berjam-jam.',
    solution:
      'Mengembangkan REST API mikroservis dengan antrean asinkron (queue worker) yang memverifikasi webhook pembayaran dan mengirim faktur otomatis dalam hitungan detik.',
    results: [
      'Memproses lebih dari 15.000 transaksi per hari dengan tingkat keberhasilan 99.99%.',
      'Waktu verifikasi transaksi terpangkas dari 3 jam menjadi rata-rata 3.2 detik.',
      'Penghematan biaya operasional staf rekonsiliasi manual hingga 70%.',
    ],
    techStack: ['Node.js', 'Go', 'Docker', 'Redis Queue', 'PostgreSQL', 'Midtrans Webhook'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    featured: false,
    completionYear: '2025',
    liveUrl: '#',
  },
  {
    id: 'proj-5',
    slug: 'e-commerce-songket-minang',
    title: 'Toko Online E-Commerce Kerajinan Tradisional Premium',
    clientName: 'Rumah Tenun Pusaka Minang',
    category: 'website',
    categoryLabel: 'Website Profesional',
    summary:
      'Katalog produk kain tenun bernilai tinggi dengan sistem checkout WhatsApp otomatis, kalkulator ongkir kurir nasional, dan galeri interaktif.',
    problem:
      'Penjualan terbatas pada toko fisik lokal dan etalase media sosial yang tidak menampilkan detail motif kain dengan jelas.',
    solution:
      'Membangun website katalog e-commerce berorientasi visual dengan zoom gambar resolusi tinggi, integrasi ongkos kirim RajaOngkir, dan direct checkout ke WhatsApp.',
    results: [
      'Pesanan dari luar pulau dan luar negeri meningkat 240% dalam 2 bulan pertama.',
      'Nilai transaksi rata-rata (basket size) naik 45% berkat bundling produk yang rapi.',
    ],
    techStack: ['Next.js', 'React', 'Tailwind CSS', 'WhatsApp Business API'],
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    featured: false,
    completionYear: '2025',
    liveUrl: '#',
  },
  {
    id: 'proj-6',
    slug: 'sim-aset-daerah-inventaris',
    title: 'Sistem Informasi Inventaris & Audit Aset Bergerak / Tidak Bergerak',
    clientName: 'Sekretariat Daerah',
    category: 'sistem-informasi',
    categoryLabel: 'Sistem Informasi',
    summary:
      'Aplikasi terpusat untuk pelacakan nilai penyusutan aset pemerintah, labelisasi QR Code barang inventaris, dan audit fisik berkala.',
    problem:
      'Sering terjadi selisih pencatatan antara buku inventaris dinas dan fisik barang nyata di ruangan kantor.',
    solution:
      'Sistem web terintegrasi scanner barcode dengan perhitungan depresiasi nilai buku otomatis sesuai standar akuntansi instansi.',
    results: [
      'Mencapai opini Wajar Tanpa Pengecualian (WTP) untuk laporan audit aset daerah.',
      'Proses sensus inventaris tahunan menjadi 4 kali lebih cepat.',
    ],
    techStack: ['Next.js', 'MySQL', 'Drizzle ORM', 'TypeScript', 'Docker'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    featured: false,
    completionYear: '2026',
    liveUrl: '#',
  },
];
