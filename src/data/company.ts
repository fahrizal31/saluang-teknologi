import { CompanyInfo, NavItem } from '@/types/company';

export const companyData: CompanyInfo = {
  name: 'Saluang Teknologi',
  legalName: 'PT Saluang Teknologi Indonesia', // [PLACEHOLDER] Nama legal entitas usaha
  tagline: 'Menghubungkan Potensi Lokal dengan Inovasi Digital Modern',
  shortDescription:
    'Saluang Teknologi adalah perusahaan teknologi yang menghubungkan potensi lokal dengan inovasi modern. Terinspirasi dari kelincahan ikan saluang dan aliran sungai jernih nusantara, kami merancang solusi digital yang menggerakkan dan memajukan masyarakat.',
  fullDescription:
    'Kami memadukan ketangguhan rekayasa perangkat lunak modern dengan kearifan lokal. Dari website berkecepatan tinggi, sistem informasi operasional terukur, aplikasi Android ergonomis, hingga otomasi backend, Saluang Teknologi adalah mitra andal transformasi digital organisasi Anda.',
  vision:
    'Menjadi pionir rekayasa perangkat lunak nusantara yang menjembatani potensi lokal ke panggung inovasi teknologi global yang berdampak nyata dan berkelanjutan.',
  mission: [
    'Menghasilkan perangkat lunak berarsitektur kokoh, cepat, dan aman dengan standar kode industri.',
    'Menciptakan antarmuka pengguna yang ramah, memikat, dan menyenangkan untuk dioperasikan setiap hari.',
    'Menjaga komunikasi dan alur kerja yang jujur, transparan, serta menghormati kapasitas anggaran klien.',
    'Mengangkat talenta teknologi daerah untuk berkontribusi aktif dalam digitalisasi nasional.',
  ],
  values: [
    {
      title: 'Kelincahan & Ketepatan',
      description: 'Seperti ikan saluang di arus sungai, sistem yang kami bangun gesit merespons perubahan kebutuhan bisnis.',
      icon: 'Zap',
    },
    {
      title: 'Transparansi Penuh',
      description: 'Estimasi biaya nyata, laporan progres berkala, dan tanpa ada klausul biaya tersembunyi.',
      icon: 'Handshake',
    },
    {
      title: 'Kualitas Tanpa Kompromi',
      description: 'Standar pengujian ketat, audit performa Lighthouse, dan kepatuhan aksesibilitas WCAG 2.1 AA.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Dampak Komunitas Nyata',
      description: 'Solusi teknologi yang kami rancang bertujuan memecahkan masalah riil dan memajukan produktivitas klien.',
      icon: 'Target',
    },
  ],
  phoneDisplay: '+62 812-3456-7890', // [PLACEHOLDER] Nomor telepon tampilan
  phoneWhatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890', // [PLACEHOLDER] Nomor WhatsApp
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'kontak@saluangteknologi.com', // [PLACEHOLDER] Email resmi
  address: {
    street: 'Jl. Pendreh No. 1', // [PLACEHOLDER] Alamat kantor operasional
    city: 'Muara Teweh',
    province: 'Kalimantan Tengah',
    country: 'Indonesia',
    postalCode: '73811',
  },
  socials: [
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/saluang-teknologi',
      label: 'LinkedIn Saluang Teknologi',
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/saluangteknologi',
      label: 'Instagram Saluang Teknologi',
    },
    {
      platform: 'github',
      url: 'https://github.com/saluang-teknologi',
      label: 'GitHub Saluang Teknologi',
    },
    {
      platform: 'whatsapp',
      url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'}?text=${encodeURIComponent('Halo Saluang Teknologi, saya ingin berdiskusi mengenai proyek perangkat lunak.')}`,
      label: 'WhatsApp Resmi',
    },
  ],
  stats: [
    { label: 'Proyek Selesai', value: '25', suffix: '+' },
    { label: 'Kepuasan Klien', value: '98', suffix: '%' },
    { label: 'Waktu Uptime', value: '99.9', suffix: '%' },
    { label: 'Respon Pertanyaan', value: '< 24', suffix: ' Jam' },
  ],
};

export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Layanan',
    href: '/layanan',
    children: [
      {
        label: 'Website Profesional',
        href: '/layanan/website',
        description: 'Landing page modern & portal web berkecepatan tinggi.',
      },
      {
        label: 'Sistem Informasi',
        href: '/layanan/sistem-informasi',
        description: 'Aplikasi manajemen internal & otomasi data terpusat.',
      },
      {
        label: 'Aplikasi Android',
        href: '/layanan/aplikasi-android',
        description: 'Aplikasi mobile gesit untuk menjangkau pengguna smartphone.',
      },
      {
        label: 'Software Lainnya',
        href: '/layanan/software-lainnya',
        description: 'Integrasi API, mikroservis kustom, dan otomasi alur kerja.',
      },
    ],
  },
  { label: 'Portofolio', href: '/portofolio' },
  { label: 'Tentang Kami', href: '/tentang' },
  { label: 'Kontak', href: '/kontak' },
];
