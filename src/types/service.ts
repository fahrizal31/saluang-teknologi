export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceWorkflowStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface ServiceItem {
  id: string;
  slug: 'website' | 'sistem-informasi' | 'aplikasi-android' | 'software-lainnya';
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  heroDescription: string;
  iconName: 'Globe' | 'Database' | 'Smartphone' | 'Cpu';
  badge: string;
  features: string[];
  problemsSolved: string[];
  deliverables: ServiceDeliverable[];
  workflow: ServiceWorkflowStep[];
  techStack: string[];
  accentColor: string;
}
