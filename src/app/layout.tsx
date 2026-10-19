import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { companyData } from '@/data/company';
import { getCompanyInfo } from '@/lib/data/company';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: '#0B1120',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Saluang Teknologi - Mitra Rekayasa Software & Solusi Digital',
    template: '%s | Saluang Teknologi',
  },
  description:
    'Jasa pembuatan website profesional, sistem informasi kustom, aplikasi Android modern, dan perangkat lunak handal untuk akselerasi bisnis Anda.',
  keywords: [
    'jasa pembuatan website',
    'pembuatan sistem informasi',
    'jasa pembuatan aplikasi android',
    'software house indonesia',
    'konsultan it',
    'saluang teknologi',
    'jasa pembuatan web kalimantan tengah',
    'software house barito utara',
  ],
  authors: [{ name: 'Saluang Teknologi' }],
  creator: 'Saluang Teknologi',
  publisher: 'PT Saluang Teknologi Indonesia',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'Saluang Teknologi - Mitra Rekayasa Software & Solusi Digital',
    description:
      'Wujudkan website berkecepatan tinggi, sistem informasi operasional terukur, dan aplikasi mobile handal bersama Saluang Teknologi.',
    siteName: 'Saluang Teknologi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saluang Teknologi - Software House & Solusi Digital',
    description:
      'Jasa pembuatan website, sistem informasi, dan aplikasi Android berkinerja tinggi.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyInfo = await getCompanyInfo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyInfo.name,
    legalName: companyInfo.legalName,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: companyInfo.shortDescription,
    telephone: companyInfo.phoneDisplay,
    email: companyInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.address.street,
      addressLocality: companyInfo.address.city,
      addressRegion: companyInfo.address.province,
      addressCountry: companyInfo.address.country,
      postalCode: companyInfo.address.postalCode,
    },
    sameAs: companyInfo.socials.map((s) => s.url),
  };

  return (
    <html lang="id" className={`${jakarta.variable} font-sans scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-saluang-sand text-saluang-dark antialiased selection:bg-saluang-coral selection:text-white min-h-screen font-sans">
        <PublicLayout companyInfo={companyInfo}>
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}
