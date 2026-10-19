# PRD Website Profil Saluang Teknologi

Oct 16, 2026 · @AMDTEMP

## 1. Ringkasan Produk

Website profil Saluang Teknologi adalah etalase digital resmi startup yang menampilkan layanan, portofolio, dan kredibilitas perusahaan agar calon klien mudah menilai dan menghubungi tim.

**Latar belakang.** Saluang Teknologi menyediakan jasa pengembangan website, sistem informasi (SI), aplikasi Android, dan perangkat lunak khusus lainnya. Calon klien umumnya menilai vendor perangkat lunak dari kehadiran online dan bukti kerja sebelum menghubungi. Tanpa website profil, startup bergantung pada rekomendasi personal dan media sosial, sehingga sulit dibuktikan, dicari, dan dibagikan.

**Masalah yang diselesaikan.**

- Calon klien tidak punya satu tempat untuk memahami layanan dan melihat hasil kerja.
- Proses permintaan penawaran masih lewat chat tidak terstruktur, sehingga kebutuhan klien sering tidak lengkap.
- Kredibilitas startup baru sulit dibangun tanpa portofolio, profil tim, dan testimoni yang terkurasi.

**Visi produk.** Dalam satu kunjungan singkat, pengunjung paham apa yang ditawarkan Saluang Teknologi, melihat bukti kualitasnya, dan mengirim permintaan proyek dengan mudah.

**Catatan:** dokumen ini disusun dari informasi bidang usaha saja. Hal yang belum diketahui ditandai sebagai asumsi atau pertanyaan terbuka di bagian 11.

## 2. Tujuan dan Metrik Keberhasilan

Tujuan utama website adalah menghasilkan permintaan proyek (lead) yang berkualitas dalam 3 bulan pertama setelah peluncuran. Angka target di bawah adalah usulan awal dan perlu disesuaikan dengan kondisi bisnis.

**Tujuan bisnis**

1. Membangun kredibilitas dan citra profesional Saluang Teknologi.
2. Menjadi kanal utama masuknya calon klien melalui formulir permintaan proyek dan WhatsApp.
3. Meningkatkan keterlihatan di pencarian Google untuk kata kunci jasa pembuatan website, sistem informasi, dan aplikasi Android.

| Metrik | Cara ukur | Target 3 bulan (usulan) |
| --- | --- | --- |
| Permintaan proyek masuk | Formulir + klik WhatsApp | 15 per bulan |
| Konversi kunjungan ke kontak | Analitik (event kontak / sesi) | 2% |
| Pengunjung organik | Google Search Console | 500 sesi per bulan |
| Kecepatan halaman (mobile) | Lighthouse | Skor performa ≥ 90 |
| Rasio bounce halaman beranda | Analitik | < 60% |
| Waktu respons ke lead | Catatan internal | < 1 hari kerja |

## 3. Target Pengguna dan Persona

Website melayani empat kelompok pengunjung, dengan calon klien sebagai prioritas utama. Persona berikut adalah hipotesis awal untuk divalidasi bersama tim.

| Persona | Siapa dan kebutuhan | Yang dicari di website | Prioritas |
| --- | --- | --- | --- |
| Pemilik UMKM / bisnis kecil | Butuh website atau aplikasi sederhana dengan biaya jelas | Layanan, contoh hasil, kontak cepat via WhatsApp | Tinggi |
| Instansi / lembaga | Butuh sistem informasi dan aplikasi sesuai kebutuhan internal | Portofolio SI, keamanan, proses kerja, dokumen penawaran | Tinggi |
| Perusahaan / startup lain | Butuh mitra pengembang untuk produk digital | Stack teknologi, studi kasus, kemampuan tim | Sedang |
| Calon talenta dan mitra | Developer, desainer, atau vendor yang ingin bergabung | Profil tim, budaya kerja, lowongan atau kontak kolaborasi | Rendah |

**Skenario utama (calon klien).** Pengunjung datang dari Google atau rekomendasi, membaca layanan yang relevan, membuka dua atau tiga studi kasus, lalu mengirim permintaan proyek atau menekan tombol WhatsApp.

## 4. Lingkup dan Fase Rilis

Rilis pertama (MVP) fokus pada halaman informasi dan formulir kontak; fitur yang butuh pengelolaan lanjutan ditunda ke fase berikutnya.

| Fase | Isi | Status |
| --- | --- | --- |
| Fase 1 (MVP) | Beranda, Layanan, Portofolio, Tentang/Tim, Kontak, formulir permintaan proyek, tombol WhatsApp, SEO dasar, analitik | Wajib |
| Fase 2 | Blog/artikel, studi kasus detail, testimoni, halaman karier, panel admin untuk kelola konten | Setelah rilis |
| Fase 3 | Dukungan dua bahasa (ID/EN), kalkulator estimasi biaya, portal klien, newsletter | Opsional |

**Di luar lingkup rilis pertama**

- Pembayaran online dan e-commerce.
- Portal klien dengan login dan pelacakan proyek.
- Aplikasi mobile pendamping website.

## 5. Struktur Situs dan Kebutuhan Fungsional

Rilis pertama berisi beranda dan empat bagian utama; blog dan studi kasus detail menyusul di Fase 2.

&#91;embedded content: sitemap · 5 bagian utama, 9 halaman turunan\]

Setiap halaman membawa satu aksi utama: **Minta penawaran** atau **Hubungi via WhatsApp**.

| Halaman | Isi dan fungsi | Fase |
| --- | --- | --- |
| Beranda | Pernyataan nilai (hero), ringkasan empat layanan, tiga proyek pilihan, logo klien atau testimoni, tombol Minta penawaran | 1 |
| Layanan | Satu halaman per jenis (website, sistem informasi, aplikasi Android, software lainnya): masalah yang diselesaikan, proses kerja, teknologi, ajakan bertindak | 1 |
| Portofolio | Daftar proyek dengan filter jenis layanan, memuat gambar, ringkasan, dan teknologi | 1 |
| Studi kasus | Halaman detail: konteks, solusi, tangkapan layar, hasil | 2 |
| Tentang | Profil perusahaan, visi dan misi, profil tim | 1 |
| Kontak | Formulir permintaan proyek (nama, email, WhatsApp, jenis layanan, perkiraan anggaran, deskripsi), tombol WhatsApp, alamat dan peta | 1 |
| Blog | Artikel, kategori, tombol bagikan | 2 |
| Elemen global | Navigasi tetap di atas, footer berisi kontak dan tautan sosial, tombol WhatsApp mengambang, kebijakan privasi, banner cookie | 1 |

## 6. Kebutuhan Non-Fungsional

Website harus cepat, aman, dan nyaman dibuka dari ponsel, karena mayoritas pengunjung diperkirakan datang dari perangkat mobile.

| Aspek | Kebutuhan |
| --- | --- |
| Performa | Skor Lighthouse mobile ≥ 90; LCP < 2,5 detik; gambar WebP dan lazy loading |
| Responsif | Tampil baik di lebar 360 px sampai 1920 px; desain mobile-first |
| Keamanan | HTTPS wajib; validasi dan sanitasi formulir; proteksi spam (reCAPTCHA/honeypot); header keamanan dasar |
| SEO | Judul dan meta unik per halaman, URL bersih, sitemap.xml, robots.txt, data terstruktur Organization |
| Aksesibilitas | Kontras warna memadai, teks alternatif gambar, navigasi keyboard (acuan WCAG 2.1 AA) |
| Ketersediaan | Uptime ≥ 99% per bulan; pencadangan berkala |
| Kompatibilitas | Dua versi terbaru Chrome, Edge, Firefox, Safari; Android dan iOS |
| Privasi | Halaman kebijakan privasi; persetujuan cookie jika memakai pelacakan |

**Aturan performa untuk hero 3D dan efek kaca**

- Target Lighthouse mobile ≥ 90 tetap berlaku; hero 3D dimuat belakangan (lazy) dan tidak boleh menghambat LCP.
- Berat aset hero maksimal 500 KB di ponsel (gambar WebP/AVIF atau video pendek terkompresi); angka ini usulan dan diuji sebelum rilis.
- Efek blur dibatasi pada jumlah elemen kecil, karena backdrop-filter berat di perangkat lama.
- Teks di atas kaca wajib memenuhi kontras WCAG 2.1 AA; beri lapisan latar lebih pekat bila perlu.
- Hormati prefers-reduced-motion: animasi dan parallax dimatikan, hero tampil statis.

## 7. Desain, Branding, dan Konten

Tampilan harus terasa modern, bersih, dan teknis tanpa berlebihan, dengan satu aksi utama yang jelas di setiap halaman: hubungi kami.

**Arah desain**

- Gaya minimalis dengan banyak ruang kosong, tipografi sans-serif yang mudah dibaca, dan satu warna aksen untuk tombol aksi.
- Logo, palet warna, dan font mengikuti identitas Saluang Teknologi; jika belum ada, buat panduan gaya ringkas sebelum desain halaman.
- Mode terang sebagai bawaan; mode gelap opsional di fase berikutnya.
- Ilustrasi atau mockup layar aplikasi untuk menunjukkan hasil kerja, bukan foto stok generik.

**Kebutuhan konten dari tim Saluang Teknologi**

| Konten | Keterangan | Penanggung jawab |
| --- | --- | --- |
| Logo dan aset brand | Format SVG/PNG, versi terang dan gelap | Pemilik / desainer |
| Deskripsi perusahaan | Visi, misi, cerita singkat pendirian | Pemilik |
| Daftar layanan | Web, SI, Android, perangkat lunak lain, masing-masing dengan ringkasan manfaat | Pemilik |
| Portofolio | Minimal 3 proyek: tangkapan layar, masalah, solusi, teknologi, hasil | Tim teknis |
| Profil tim | Foto, nama, peran, satu kalimat bio | Semua anggota |
| Testimoni | Kutipan klien dengan izin tertulis | Pemilik |
| Kontak | Alamat, email, nomor WhatsApp, tautan media sosial | Pemilik |

**Gaya bahasa:** Bahasa Indonesia yang lugas dan profesional, fokus pada manfaat bagi klien, bukan daftar istilah teknis.

### Konsep visual hero: kaca transparan dan diorama 3D

Bagian hero beranda memakai gaya antarmuka kaca (glassmorphism) di atas diorama 3D bertema teknologi, mengacu pada gambar konsep referensi dari tim. Gambar itu hanya acuan gaya; tema, ilustrasi, dan identitas visual dibuat orisinal untuk Saluang Teknologi.

- **Diorama 3D:** satu adegan isometrik (misalnya kota kecil atau meja kerja pengembang) dengan empat kartu kaca yang mewakili Website, Sistem Informasi, Android, dan Software Lainnya. Klik kartu membuka halaman layanan terkait.
- **Efek kaca:** kartu semi-transparan dengan backdrop-filter blur, border tipis, dan glow lembut pada elemen aktif. Warna aksen tunggal untuk tombol utama Minta penawaran.
- **Interaksi:** efek parallax saat kursor bergerak atau halaman di-scroll, transisi hover halus (Framer Motion atau GSAP), dan animasi masuk saat halaman dimuat.
- **Pendekatan 3D (usulan):** gambar atau video hasil render dengan lapisan parallax. Alternatif jika diperlukan: embed Spline (Fase 3) atau Three.js/React Three Fiber dengan model 3D sendiri.
- **Cadangan:** gambar statis WebP untuk ponsel kelas bawah, koneksi lambat, dan pengguna dengan pengaturan prefers-reduced-motion.
- **Cakupan:** gaya ini dipakai di hero beranda dan kartu layanan; halaman lain tetap sederhana agar cepat dan mudah dibaca.
- **Aset yang dibutuhkan:** render atau model 3D diorama, ikon layanan, dan panduan gaya kaca (opasitas, blur, radius sudut).

## 8. Arsitektur Teknis

Usulan: situs hampir statis dengan konten dikelola lewat berkas atau CMS ringan, supaya cepat, murah dihosting, dan mudah dirawat tim kecil. Stack final mengikuti keahlian tim (lihat pertanyaan terbuka).

| Lapisan | Usulan | Alasan |
| --- | --- | --- |
| Frontend | Next.js (React) atau Astro + Tailwind CSS | SEO baik, performa tinggi, komponen dapat dipakai ulang |
| Konten | Berkas Markdown/MDX di repositori (Fase 1); CMS headless atau panel admin (Fase 2) | Sederhana di awal, bisa berkembang |
| Backend formulir | Endpoint API kecil (Node.js atau PHP) + kirim email dan notifikasi WhatsApp/Telegram | Lead langsung sampai ke tim |
| Basis data | Tidak wajib di Fase 1; SQLite/MySQL/PostgreSQL saat panel admin dibuat | Hindari kompleksitas dini |
| Hosting | VPS Indonesia atau Vercel/Cloudflare Pages; CDN untuk aset | Latensi rendah dan biaya terkendali |
| Domain dan SSL | Domain .id atau .com + Let's Encrypt | HTTPS wajib |
| Repositori dan CI/CD | Git (GitHub/GitLab) dengan deploy otomatis dari cabang utama | Rilis cepat dan dapat diulang |
| Integrasi | Google Analytics 4, Search Console, WhatsApp click-to-chat, Google Maps embed | Pengukuran dan kontak |

## 9. Analitik, SEO, dan Pemasaran Digital

Sejak hari pertama, setiap kontak yang masuk harus bisa ditelusuri asalnya, agar tim tahu kanal mana yang paling efektif.

**Analitik**

- Pasang Google Analytics 4 dengan event: kirim formulir, klik WhatsApp, klik email, buka studi kasus.
- Verifikasi Google Search Console dan kirim sitemap.xml.
- Tinjau metrik di bagian 2 setiap bulan.

**SEO**

- Kata kunci sasaran: jasa pembuatan website, pembuatan sistem informasi, jasa pembuatan aplikasi Android, software house Indonesia (tambahkan kota/daerah jika menyasar pasar lokal).
- Satu halaman layanan per kata kunci utama, masing-masing dengan judul H1 unik.
- Daftarkan profil Google Business bila ada alamat kantor.

**Pemasaran**

- Tautkan website di profil LinkedIn, Instagram, dan GitHub tim.
- Publikasikan artikel dan studi kasus secara rutin di Fase 2 (target 2 artikel per bulan).
- Cantumkan tautan website di setiap proposal dan tanda tangan email.

## 10. Timeline dan Peran

Fase 1 dapat meluncur dalam 8 minggu jika semua konten (portofolio, profil tim, deskripsi layanan) siap sebelum 6 November 2026. Tanggal di bawah adalah usulan, dengan asumsi kickoff Senin, 19 Oktober 2026.

&#91;embedded content: jadwal Fase 1 · 4 tahap, 1 peluncuran\]

Fase 2 (blog, studi kasus detail, panel admin) dijadwalkan setelah evaluasi empat minggu pertama berdasarkan data analitik.

| Peran | Tanggung jawab |
| --- | --- |
| Pemilik / product owner | Menyediakan konten, menyetujui desain dan hasil akhir |
| Desainer UI/UX | Panduan gaya, wireframe, desain halaman responsif |
| Developer | Implementasi frontend, formulir, integrasi analitik dan SEO, deployment |
| Penulis konten | Naskah layanan, studi kasus, dan artikel |

Untuk tim kecil, satu orang dapat merangkap beberapa peran.

## 11. Risiko, Asumsi, dan Pertanyaan Terbuka

Risiko terbesar adalah konten (portofolio dan testimoni) yang terlambat siap, bukan teknologinya.

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Portofolio belum ada atau belum boleh dipublikasikan | Kredibilitas rendah | Buat proyek demo/studi kasus internal; minta izin klien tertulis |
| Konten terlambat dari tim | Jadwal mundur | Tetapkan tenggat konten di minggu ke-2 |
| Spam lewat formulir | Lead tidak berkualitas | reCAPTCHA, honeypot, validasi sisi server |
| Website lambat karena gambar besar | Pengunjung pergi | Kompresi gambar, CDN, uji Lighthouse sebelum rilis |
| Tidak ada yang merawat konten | Informasi usang | Tunjuk satu penanggung jawab dan jadwal tinjau bulanan |

**Pertanyaan terbuka**

- [ ] Apakah logo dan identitas brand Saluang Teknologi sudah ada?
- [ ] Siapa target klien utama: UMKM, instansi pemerintah, atau perusahaan?
- [ ] Apakah sudah ada domain dan hosting, dan berapa anggaran per tahun?
- [ ] Berapa proyek yang boleh dipublikasikan sebagai portofolio?
- [ ] Perlu dua bahasa (Indonesia dan Inggris) sejak awal?
- [ ] Siapa yang membangun dan merawat website: tim sendiri atau pihak luar?
- [ ] Berapa target tanggal rilis yang diinginkan?

**Asumsi:** tim kecil (2–5 orang), situs dibangun sendiri oleh tim Saluang Teknologi, dan Fase 1 tidak memerlukan panel admin.
