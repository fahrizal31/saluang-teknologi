import { z } from 'zod';

export const inquirySchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Nama lengkap minimal 3 karakter' })
    .max(100, { message: 'Nama lengkap maksimal 100 karakter' }),
  email: z
    .string()
    .email({ message: 'Alamat email tidak valid (contoh: nama@perusahaan.com)' }),
  whatsapp: z
    .string()
    .min(9, { message: 'Nomor WhatsApp minimal 9 digit' })
    .max(16, { message: 'Nomor WhatsApp maksimal 16 digit' })
    .regex(/^[0-9+\s\-]+$/, { message: 'Format nomor telepon hanya boleh berisi angka, +, dan spasi' }),
  companyName: z.string().optional(),
  serviceType: z.enum(
    ['website', 'sistem-informasi', 'aplikasi-android', 'software-lainnya'],
    { errorMap: () => ({ message: 'Pilih salah satu jenis layanan yang dibutuhkan' }) }
  ),
  budgetRange: z.enum(
    ['under-10m', '10m-25m', '25m-50m', '50m-100m', 'above-100m'],
    { errorMap: () => ({ message: 'Pilih perkiraan anggaran yang sesuai' }) }
  ),
  projectDescription: z
    .string()
    .min(10, { message: 'Deskripsi kebutuhan proyek minimal 10 karakter' })
    .max(2000, { message: 'Deskripsi proyek maksimal 2000 karakter' }),
  // Honeypot anti-spam field (should stay empty)
  websiteUrlHoneypot: z.string().max(0, { message: 'Spam terdeteksi' }).optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
