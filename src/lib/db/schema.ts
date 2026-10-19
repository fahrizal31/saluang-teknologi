import { mysqlTable, varchar, text, timestamp, boolean, int, json } from 'drizzle-orm/mysql-core';
import type { ServiceDeliverable, ServiceWorkflowStep } from '@/types/service';

// ============================================================================
// 1. LEADS (Permintaan Proyek dari formulir kontak / konsultasi)
// ============================================================================
export const leads = mysqlTable('leads', {
  id: varchar('id', { length: 36 }).primaryKey(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  serviceType: varchar('service_type', { length: 50 }).notNull(),
  budgetRange: varchar('budget_range', { length: 50 }).notNull(),
  projectDescription: text('project_description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('baru'),
  notes: text('notes'),
  ipAddress: varchar('ip_address', { length: 64 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

// ============================================================================
// 2. SERVICES (Katalog Layanan Digital Saluang Teknologi)
// ============================================================================
export const services = mysqlTable('services', {
  id: varchar('id', { length: 64 }).primaryKey(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  shortTitle: varchar('short_title', { length: 100 }).notNull(),
  subtitle: text('subtitle').notNull(),
  tagline: text('tagline').notNull(),
  heroDescription: text('hero_description').notNull(),
  iconName: varchar('icon_name', { length: 50 }).notNull(),
  badge: varchar('badge', { length: 100 }).notNull(),
  features: json('features').$type<string[]>().notNull(),
  problemsSolved: json('problems_solved').$type<string[]>().notNull(),
  deliverables: json('deliverables').$type<ServiceDeliverable[]>().notNull(),
  workflow: json('workflow').$type<ServiceWorkflowStep[]>().notNull(),
  techStack: json('tech_stack').$type<string[]>().notNull(),
  accentColor: varchar('accent_color', { length: 50 }).notNull(),
  displayOrder: int('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type ServiceModel = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

// ============================================================================
// 3. PORTFOLIO PROJECTS (Studi Kasus & Portofolio Proyek)
// ============================================================================
export const portfolioProjects = mysqlTable('portfolio_projects', {
  id: varchar('id', { length: 64 }).primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  categoryLabel: varchar('category_label', { length: 100 }).notNull(),
  summary: text('summary').notNull(),
  problem: text('problem').notNull(),
  solution: text('solution').notNull(),
  results: json('results').$type<string[]>().notNull(),
  techStack: json('tech_stack').$type<string[]>().notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  featured: boolean('featured').notNull().default(false),
  completionYear: varchar('completion_year', { length: 10 }).notNull(),
  liveUrl: varchar('live_url', { length: 500 }),
  testimonial: json('testimonial').$type<{
    quote: string;
    author: string;
    role: string;
  }>(),
  displayOrder: int('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type PortfolioProjectModel = typeof portfolioProjects.$inferSelect;
export type NewPortfolioProject = typeof portfolioProjects.$inferInsert;

// ============================================================================
// 4. TEAM MEMBERS (Profil Tim Saluang Teknologi)
// ============================================================================
export const teamMembers = mysqlTable('team_members', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  roleCategory: varchar('role_category', { length: 50 }).notNull(),
  bio: text('bio').notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }).notNull(),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 500 }),
  displayOrder: int('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type TeamMemberModel = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

// ============================================================================
// 5. BETTER AUTH TABLES (Autentikasi & Sesi Admin)
// ============================================================================
export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: varchar('role', { length: 50 }).notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = mysqlTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// ============================================================================
// 6. COMPANY SETTINGS (Pengaturan Profil, Kontak, Alamat & Sosmed Perusahaan)
// ============================================================================
export const companySettings = mysqlTable('company_settings', {
  id: varchar('id', { length: 32 }).primaryKey().default('default'),
  name: varchar('name', { length: 255 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }).notNull(),
  tagline: text('tagline').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  vision: text('vision').notNull(),
  mission: json('mission').$type<string[]>().notNull(),
  phoneDisplay: varchar('phone_display', { length: 50 }).notNull(),
  phoneWhatsapp: varchar('phone_whatsapp', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  addressStreet: varchar('address_street', { length: 255 }).notNull(),
  addressCity: varchar('address_city', { length: 100 }).notNull(),
  addressProvince: varchar('address_province', { length: 100 }).notNull(),
  addressCountry: varchar('address_country', { length: 100 }).notNull(),
  addressPostalCode: varchar('address_postal_code', { length: 20 }).notNull(),
  socialLinkedin: varchar('social_linkedin', { length: 500 }),
  socialInstagram: varchar('social_instagram', { length: 500 }),
  socialGithub: varchar('social_github', { length: 500 }),
  stats: json('stats').$type<{ label: string; value: string; suffix?: string }[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type CompanySettingsModel = typeof companySettings.$inferSelect;
export type NewCompanySettings = typeof companySettings.$inferInsert;

// ============================================================================
// 7. UPLOADED FILES (Penyimpanan Gambar Serverless / Database Fallback)
// ============================================================================
export const uploadedFiles = mysqlTable('uploaded_files', {
  id: varchar('id', { length: 64 }).primaryKey(),
  folder: varchar('folder', { length: 50 }).notNull(),
  filename: varchar('filename', { length: 255 }).notNull().unique(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: int('file_size').notNull(),
  data: text('data').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type UploadedFileModel = typeof uploadedFiles.$inferSelect;
export type NewUploadedFile = typeof uploadedFiles.$inferInsert;

// ============================================================================
// 7. VISITOR SESSIONS (Pelacakan Pengunjung Online & Profil Sesi)
// ============================================================================
export const visitorSessions = mysqlTable('visitor_sessions', {
  sessionId: varchar('session_id', { length: 64 }).primaryKey(),
  ipAddress: varchar('ip_address', { length: 64 }).notNull(),
  countryCode: varchar('country_code', { length: 10 }).default('ID'),
  countryName: varchar('country_name', { length: 100 }).default('Indonesia'),
  city: varchar('city', { length: 100 }),
  currentPath: varchar('current_path', { length: 255 }).notNull().default('/'),
  deviceType: varchar('device_type', { length: 20 }).notNull().default('desktop'),
  browser: varchar('browser', { length: 50 }),
  os: varchar('os', { length: 50 }),
  pageviewCount: int('pageview_count').notNull().default(1),
  firstSeenAt: timestamp('first_seen_at').notNull().defaultNow(),
  lastActiveAt: timestamp('last_active_at').notNull().defaultNow(),
});

export type VisitorSessionModel = typeof visitorSessions.$inferSelect;
export type NewVisitorSession = typeof visitorSessions.$inferInsert;

// ============================================================================
// 8. VISITOR PAGEVIEWS (Log Riwayat Kunjungan Pengunjung)
// ============================================================================
export const visitorPageviews = mysqlTable('visitor_pageviews', {
  id: varchar('id', { length: 64 }).primaryKey(),
  sessionId: varchar('session_id', { length: 64 }).notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 64 }).notNull(),
  countryCode: varchar('country_code', { length: 10 }),
  countryName: varchar('country_name', { length: 100 }),
  city: varchar('city', { length: 100 }),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type VisitorPageviewModel = typeof visitorPageviews.$inferSelect;
export type NewVisitorPageview = typeof visitorPageviews.$inferInsert;

export const authSchema = {
  user,
  session,
  account,
  verification,
};

export const appSchema = {
  leads,
  services,
  portfolioProjects,
  teamMembers,
  companySettings,
  uploadedFiles,
  visitorSessions,
  visitorPageviews,
  ...authSchema,
};



