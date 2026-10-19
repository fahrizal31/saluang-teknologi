'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { companyData as fallbackCompanyData, navItems } from '@/data/company';
import type { CompanyInfo } from '@/types/company';
import { Mail, Phone, MapPin, Linkedin, Instagram, Github } from 'lucide-react';

interface FooterProps {
  companyData?: CompanyInfo;
}

export const Footer: React.FC<FooterProps> = ({ companyData: propCompanyData }) => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const data = propCompanyData || fallbackCompanyData;
  const linkedinUrl = data.socials?.find((s) => s.platform === 'linkedin')?.url || 'https://linkedin.com/company/saluang-teknologi';
  const instagramUrl = data.socials?.find((s) => s.platform === 'instagram')?.url || 'https://instagram.com/saluangteknologi';
  const githubUrl = data.socials?.find((s) => s.platform === 'github')?.url || 'https://github.com/saluang-teknologi';

  return (
    <footer className="relative bg-saluang-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Kolom 1: Profil & Logo Resmi */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <Link href="/" className="inline-flex items-center group" aria-label="Saluang Teknologi Beranda">
              <Image
                src="/images/saluang-logo-white-text.png"
                alt="Saluang Teknologi"
                width={190}
                height={78}
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
              />
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm font-medium">
              {data.shortDescription}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Saluang Teknologi"
                className="h-10 w-10 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-saluang-coral transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Saluang Teknologi"
                className="h-10 w-10 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-saluang-coral transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Saluang Teknologi"
                className="h-10 w-10 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-white hover:bg-saluang-coral transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Layanan */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-saluang-yellow">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-300">
              <li>
                <Link href="/layanan/website" className="hover:text-saluang-mint transition-colors">
                  Website Profesional
                </Link>
              </li>
              <li>
                <Link href="/layanan/sistem-informasi" className="hover:text-saluang-mint transition-colors">
                  Sistem Informasi
                </Link>
              </li>
              <li>
                <Link href="/layanan/aplikasi-android" className="hover:text-saluang-mint transition-colors">
                  Aplikasi Android
                </Link>
              </li>
              <li>
                <Link href="/layanan/software-lainnya" className="hover:text-saluang-mint transition-colors">
                  Software Lainnya
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Navigasi Cepat */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-saluang-yellow">
              Perusahaan
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-300">
              <li>
                <Link href="/tentang" className="hover:text-saluang-mint transition-colors">
                  Tentang &amp; Tim
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-saluang-mint transition-colors">
                  Portofolio Kerja
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-saluang-mint transition-colors">
                  Minta Penawaran
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-saluang-mint transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Hubungi Kami */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-saluang-yellow">
              Kontak
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-saluang-coral shrink-0 mt-0.5" />
                <span>
                  {data.address.city}, {data.address.province}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-saluang-coral shrink-0" />
                <a href={`mailto:${data.email}`} className="hover:text-saluang-mint transition-colors">
                  {data.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-saluang-coral shrink-0" />
                <a
                  href={`https://wa.me/${data.phoneWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-saluang-mint transition-colors"
                >
                  {data.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-400 font-medium text-center sm:text-left">
          <div>
            &copy; {currentYear} {data.name}. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors py-1">
              Kebijakan Privasi
            </Link>
            <span>&bull;</span>
            <span className="text-saluang-mint">Inovasi Digital Berkelanjutan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
