'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema, InquiryFormData } from '@/schemas/inquirySchema';
import { companyData } from '@/data/company';
import { Button } from '@/components/ui/Button';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const ProjectInquiryForm: React.FC = () => {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('layanan');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<InquiryFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsapp: '',
      companyName: '',
      serviceType: 'website',
      budgetRange: '10m-25m',
      projectDescription: '',
      websiteUrlHoneypot: '',
    },
  });

  useEffect(() => {
    if (
      preselectedService &&
      ['website', 'sistem-informasi', 'aplikasi-android', 'software-lainnya'].includes(
        preselectedService
      )
    ) {
      setValue('serviceType', preselectedService as any);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: InquiryFormData) => {
    if (data.websiteUrlHoneypot && data.websiteUrlHoneypot.length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Gagal mengirim formulir permintaan proyek.');
      }

      setSubmittedData(data);
      setSubmitSuccess(true);

      // Trigger custom analytics event (sesuai PRD)
      if (typeof window !== 'undefined') {
        const win = window as any;
        if (win.dataLayer && Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event: 'lead_form_submitted',
            service_type: data.serviceType,
            budget_range: data.budgetRange,
            inquiry_id: resData.inquiryId,
          });
        }
      }
    } catch (err) {
      console.error('Gagal mengirim formulir:', err);
      setSubmitError(
        err instanceof Error ? err.message : 'Terjadi gangguan saat memproses formulir. Silakan coba kembali.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    reset();
    setSubmitSuccess(false);
    setSubmitError(null);
    setSubmittedData(null);
  };

  const getWhatsAppSummaryUrl = () => {
    if (!submittedData) return `https://wa.me/${companyData.phoneWhatsapp}`;

    const serviceLabels: Record<string, string> = {
      website: 'Website Profesional',
      'sistem-informasi': 'Sistem Informasi',
      'aplikasi-android': 'Aplikasi Android',
      'software-lainnya': 'Software Lainnya',
    };

    const text = `Halo Saluang Teknologi, saya telah mengisi formulir penawaran proyek di website:
- Nama: ${submittedData.fullName}
${submittedData.companyName ? `- Perusahaan: ${submittedData.companyName}\n` : ''}- Email: ${submittedData.email}
- Layanan: ${serviceLabels[submittedData.serviceType] || submittedData.serviceType}
- Deskripsi: ${submittedData.projectDescription}

Mohon tindak lanjut dan estimasi biayanya. Terima kasih!`;

    return `https://wa.me/${companyData.phoneWhatsapp}?text=${encodeURIComponent(text)}`;
  };

  if (submitSuccess && submittedData) {
    return (
      <div className="p-8 sm:p-12 bg-saluang-cream border-2 border-saluang-dark rounded-4xl shadow-neo-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-saluang-teal text-white border-2 border-saluang-dark shadow-neo flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="text-2xl font-black text-saluang-dark tracking-tight">
            Permintaan Proyek Berhasil Terkirim!
          </h3>
          <p className="text-sm text-saluang-dark/80 font-medium leading-relaxed">
            Terima kasih, <strong className="text-saluang-dark">{submittedData.fullName}</strong>. Tim
            analis Saluang Teknologi akan meninjau kebutuhan sistem Anda dan menghubungi Anda via WhatsApp /
            email dalam waktu kurang dari 1 hari kerja.
          </p>
        </div>

        {/* WhatsApp Fast Track Option */}
        <div className="p-5 rounded-3xl bg-saluang-sand border-2 border-saluang-dark shadow-neo-sm max-w-md mx-auto space-y-3">
          <p className="text-xs text-saluang-coral font-black">
            Butuh Respon Instan Sekarang?
          </p>
          <Button
            href={getWhatsAppSummaryUrl()}
            isExternal
            variant="coral"
            size="md"
            leftIcon={<MessageSquare className="w-4 h-4 text-white" />}
            className="w-full justify-center text-xs font-black bg-saluang-coral text-white"
          >
            Lanjutkan ke WhatsApp dengan Ringkasan Ini
          </Button>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetForm}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="text-xs font-bold text-saluang-dark hover:text-saluang-coral"
          >
            Kirim Permintaan Proyek Lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 lg:p-10 bg-saluang-cream border-2 border-saluang-dark rounded-3xl sm:rounded-4xl shadow-neo-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6" noValidate>
        {/* Form Title & Instruction */}
        <div className="space-y-1.5 border-b-2 border-saluang-dark/15 pb-4 sm:pb-5">
          <h2 className="text-xl sm:text-2xl font-black text-saluang-dark tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-saluang-yellow shrink-0" />
            Formulir Permintaan Penawaran
          </h2>
          <p className="text-xs text-saluang-dark/75 font-semibold leading-relaxed">
            Sampaikan kebutuhan proyek Anda. Kami menjamin kerahasiaan data dan spesifikasi yang Anda bagikan.
          </p>
        </div>

        {submitError && (
          <div className="p-4 bg-saluang-coral/10 border-2 border-saluang-coral rounded-2xl flex items-start gap-3 text-saluang-coral text-xs sm:text-sm font-semibold animate-in fade-in-50 duration-200">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Honeypot anti-spam */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="websiteUrlHoneypot">Jangan isi bidang ini</label>
          <input
            id="websiteUrlHoneypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('websiteUrlHoneypot')}
          />
        </div>

        {/* Grid: Nama & Perusahaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="fullName" className="block text-xs font-black text-saluang-dark">
              Nama Lengkap <span className="text-saluang-coral">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Contoh: Rahmat Hidayat"
              className={`w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 text-base sm:text-sm text-saluang-dark placeholder-saluang-dark/40 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors ${
                errors.fullName ? 'border-saluang-coral ring-1 ring-saluang-coral' : 'border-saluang-dark'
              }`}
              {...register('fullName')}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="text-xs font-bold text-saluang-coral flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="companyName" className="block text-xs font-black text-saluang-dark">
              Nama Instansi / Perusahaan <span className="text-saluang-dark/50 font-normal">(Opsional)</span>
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="Contoh: PT Saluang Jaya / Dinas Terkait"
              className="w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 border-saluang-dark text-base sm:text-sm text-saluang-dark placeholder-saluang-dark/40 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors"
              {...register('companyName')}
            />
          </div>
        </div>

        {/* Grid: Email & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="email" className="block text-xs font-black text-saluang-dark">
              Email Aktif <span className="text-saluang-coral">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@perusahaan.com"
              className={`w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 text-base sm:text-sm text-saluang-dark placeholder-saluang-dark/40 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors ${
                errors.email ? 'border-saluang-coral ring-1 ring-saluang-coral' : 'border-saluang-dark'
              }`}
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs font-bold text-saluang-coral flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="whatsapp" className="block text-xs font-black text-saluang-dark">
              Nomor WhatsApp <span className="text-saluang-coral">*</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              placeholder="081234567890"
              className={`w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 text-base sm:text-sm text-saluang-dark placeholder-saluang-dark/40 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors ${
                errors.whatsapp ? 'border-saluang-coral ring-1 ring-saluang-coral' : 'border-saluang-dark'
              }`}
              {...register('whatsapp')}
              aria-invalid={!!errors.whatsapp}
            />
            {errors.whatsapp && (
              <p className="text-xs font-bold text-saluang-coral flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.whatsapp.message}
              </p>
            )}
          </div>
        </div>

        {/* Grid: Jenis Layanan & Perkiraan Anggaran */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="serviceType" className="block text-xs font-black text-saluang-dark">
              Jenis Layanan <span className="text-saluang-coral">*</span>
            </label>
            <select
              id="serviceType"
              className="w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 border-saluang-dark text-base sm:text-sm text-saluang-dark font-bold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors"
              {...register('serviceType')}
            >
              <option value="website">Website Profesional</option>
              <option value="sistem-informasi">Sistem Informasi Kustom</option>
              <option value="aplikasi-android">Aplikasi Android</option>
              <option value="software-lainnya">Software Lainnya / Integrasi API</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="budgetRange" className="block text-xs font-black text-saluang-dark">
              Perkiraan Anggaran <span className="text-saluang-coral">*</span>
            </label>
            <select
              id="budgetRange"
              className="w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 border-saluang-dark text-base sm:text-sm text-saluang-dark font-bold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors"
              {...register('budgetRange')}
            >
              <option value="under-10m">&lt; Rp 10 Juta (Skala Sederhana)</option>
              <option value="10m-25m">Rp 10 Juta – 25 Juta</option>
              <option value="25m-50m">Rp 25 Juta – 50 Juta</option>
              <option value="50m-100m">Rp 50 Juta – 100 Juta</option>
              <option value="above-100m">&gt; Rp 100 Juta (Enterprise / Sistem Kompleks)</option>
            </select>
          </div>
        </div>

        {/* Deskripsi Kebutuhan Proyek */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="projectDescription" className="block text-xs font-black text-saluang-dark">
            Deskripsi Kebutuhan Proyek <span className="text-saluang-coral">*</span>
          </label>
          <textarea
            id="projectDescription"
            rows={4}
            placeholder="Jelaskan gambaran sistem yang ingin dibangun, target pengguna, atau fitur-fitur wajib yang diinginkan..."
            className={`w-full px-4 py-3 rounded-2xl bg-saluang-sand border-2 text-base sm:text-sm text-saluang-dark placeholder-saluang-dark/40 font-semibold focus:outline-none focus:ring-2 focus:ring-saluang-coral transition-colors resize-y ${
              errors.projectDescription
                ? 'border-saluang-coral ring-1 ring-saluang-coral'
                : 'border-saluang-dark'
            }`}
            {...register('projectDescription')}
            aria-invalid={!!errors.projectDescription}
          />
          {errors.projectDescription && (
            <p className="text-xs font-bold text-saluang-coral flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.projectDescription.message}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-saluang-dark/70 font-bold text-center sm:text-left">
            Respon maksimal 1x24 jam kerja &bull; Konsultasi awal bebas biaya
          </span>
          <Button
            type="submit"
            variant="coral"
            size="lg"
            isLoading={isSubmitting}
            rightIcon={<Send className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center px-8 bg-saluang-coral text-white font-black"
          >
            Kirim Permintaan Penawaran
          </Button>
        </div>
      </form>
    </div>
  );
};
