import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { companyData } from '@/data/company';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Mail, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi & Perlindungan Data',
  description:
    'Komitmen Saluang Teknologi dalam melindungi data pribadi, privasi pengunjung, dan kerahasiaan informasi proyek.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '16 Oktober 2026';

  return (
    <div className="py-16 sm:py-24 bg-saluang-sand relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-saluang-dark/70 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-saluang-coral transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-saluang-dark/40" />
          <span className="text-saluang-coral font-bold">Kebijakan Privasi</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 mb-12">
          <Badge variant="coral" size="md">
            Dokumen Hukum &amp; Kepatuhan
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-saluang-dark tracking-tight">
            Kebijakan Privasi &amp; Perlindungan Data
          </h1>
          <p className="text-xs sm:text-sm text-saluang-dark/70 font-bold">
            Terakhir diperbarui: {lastUpdated} &bull; Berlaku untuk seluruh layanan {companyData.name}
          </p>
        </div>

        {/* Policy Content Body */}
        <div className="p-8 sm:p-12 bg-saluang-cream border-2 border-saluang-dark rounded-4xl shadow-neo-xl space-y-10 text-saluang-dark text-sm font-medium leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-saluang-dark flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-saluang-coral" />
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mengisi formulir
              permintaan proyek atau menghubungi kami melalui tautan WhatsApp resmi, yang mencakup:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-saluang-dark/85 font-semibold">
              <li>Nama lengkap dan nama instansi/perusahaan Anda.</li>
              <li>Alamat surat elektronik (email) aktif.</li>
              <li>Nomor telepon / WhatsApp untuk koordinasi penawaran.</li>
              <li>Kategori layanan yang diminati dan estimasi anggaran proyek.</li>
              <li>Deskripsi ringkas kebutuhan dan spesifikasi teknis proyek.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-saluang-dark flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-saluang-teal" />
              2. Penggunaan Informasi
            </h2>
            <p>Informasi yang terkumpul semata-mata kami gunakan untuk:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-saluang-dark/85 font-semibold">
              <li>Menyusun dokumen estimasi biaya dan proposal teknis yang sesuai.</li>
              <li>Menghubungi Anda untuk sesi konsultasi atau klarifikasi kebutuhan sistem.</li>
              <li>Menyampaikan pembaruan status pengerjaan bagi proyek yang telah berjalan.</li>
              <li>Menganalisis performa website secara agregat untuk meningkatkan pengalaman navigasi.</li>
            </ul>
            <p className="font-bold text-saluang-dark bg-saluang-yellow/20 p-3 rounded-2xl border border-saluang-dark/20">
              Kami menjamin tidak akan pernah menjual, menyewakan, atau memindahtangankan data pribadi
              Anda kepada pihak ketiga mana pun tanpa persetujuan tertulis eksplisit.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-saluang-dark flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-saluang-yellow" />
              3. Penggunaan Cookie &amp; Analitik
            </h2>
            <p>
              Situs ini menggunakan cookie teknis yang esensial untuk menjaga preferensi navigasi Anda
              serta analitik agregat guna memahami halaman mana yang paling sering dikunjungi.
            </p>
            <p>
              Anda memiliki kebebasan penuh untuk menolak cookie non-esensial melalui banner persetujuan
              cookie yang kami sediakan di awal kunjungan Anda.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-black text-saluang-dark flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-saluang-teal" />
              4. Keamanan Informasi &amp; Hak Anda
            </h2>
            <p>
              Seluruh transmisi data di website Saluang Teknologi dilindungi oleh protokol enkripsi
              SSL/TLS (HTTPS). Anda berhak meminta salinan data pribadi yang kami simpan, meminta
              koreksi, atau menuntut penghapusan menyeluruh data kontak Anda dari catatan penawaran kami
              kapan saja.
            </p>
          </section>

          {/* Section 5: Kontak */}
          <section className="space-y-3 pt-4 border-t-2 border-saluang-dark/15">
            <h2 className="text-xl font-black text-saluang-dark flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-saluang-coral" />
              5. Hubungi Tim Perlindungan Privasi
            </h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi atau ingin mengajukan penghapusan
              data, silakan hubungi kami melalui:
            </p>
            <div className="p-5 rounded-2xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm space-y-1.5 text-xs font-bold">
              <div className="text-saluang-dark font-black text-sm">{companyData.name}</div>
              <div>Email: <a href={`mailto:${companyData.email}`} className="text-saluang-coral underline">{companyData.email}</a></div>
              <div>WhatsApp: <a href={`https://wa.me/${companyData.phoneWhatsapp}`} className="text-saluang-coral underline">{companyData.phoneDisplay}</a></div>
              <div>Alamat: {companyData.address.street}, {companyData.address.city}, {companyData.address.province}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
