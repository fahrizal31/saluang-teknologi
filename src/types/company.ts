export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  children?: { label: string; href: string; description: string }[];
}

export interface CompanySocial {
  platform: 'linkedin' | 'instagram' | 'github' | 'whatsapp';
  url: string;
  label: string;
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  vision: string;
  mission: string[];
  values: { title: string; description: string; icon: string }[];
  phoneDisplay: string;
  phoneWhatsapp: string;
  email: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  socials: CompanySocial[];
  stats: { label: string; value: string; suffix?: string }[];
}
