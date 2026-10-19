export type ServiceCategory = 'website' | 'sistem-informasi' | 'aplikasi-android' | 'software-lainnya';

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: ServiceCategory;
  categoryLabel: string;
  summary: string;
  problem: string;
  solution: string;
  results: string[];
  techStack: string[];
  imageUrl: string;
  featured: boolean; // Ditampilkan di Beranda (minimal 3 proyek)
  completionYear: string;
  liveUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}
