'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  Loader2,
  HardDrive,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  folder?: 'portfolio' | 'team' | 'services' | 'general';
  aspectRatio?: 'video' | 'square' | 'wide';
  helperText?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  required = false,
  folder = 'portfolio',
  aspectRatio = 'video',
  helperText,
}: ImageUploadFieldProps) {
  // Mode default: jika value adalah /uploads/ atau kosong, tampilkan tab upload perangkat.
  const [activeTab, setActiveTab] = useState<'device' | 'url'>(() => {
    if (value && value.startsWith('http')) return 'url';
    return 'device';
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setUploadError('File yang dipilih bukan gambar. Gunakan JPG, PNG, WEBP, GIF, atau SVG.');
      return;
    }

    // Validasi ukuran (maks 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maksimal 10MB.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah gambar ke server');
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: any) {
      console.error('[ImageUploadField] Error:', err);
      setUploadError(err.message || 'Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setIsUploading(false);
      // Reset input agar file yang sama bisa dipilih ulang jika dihapus
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClearImage = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isLocalUpload = value && value.startsWith('/uploads/');
  const isExternalUrl = value && value.startsWith('http');

  const aspectRatioClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[220px]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-video';

  return (
    <div className="space-y-2">
      {/* Label and Source Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <label className="text-xs font-black text-saluang-dark flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-saluang-coral">*</span>}
        </label>

        {/* Tab Selector */}
        <div className="inline-flex items-center p-0.5 rounded-lg border border-saluang-dark/30 bg-saluang-sand text-[11px] font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('device')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'device'
                ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs font-black'
                : 'text-saluang-dark/70 hover:text-saluang-dark'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Pilih dari Perangkat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-saluang-dark text-saluang-cream shadow-neo-xs font-black'
                : 'text-saluang-dark/70 hover:text-saluang-dark'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Tautan URL</span>
          </button>
        </div>
      </div>

      {/* Main Input Area */}
      {activeTab === 'device' ? (
        <div className="space-y-2">
          {/* Dropzone Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-saluang-teal bg-saluang-teal/15 scale-[1.01]'
                : 'border-saluang-dark bg-saluang-sand/40 hover:bg-saluang-sand/80 hover:border-saluang-dark'
            } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
              onChange={onInputChange}
              className="hidden"
            />

            {isUploading ? (
              <div className="py-3 flex flex-col items-center gap-2">
                <Loader2 className="w-7 h-7 text-saluang-teal animate-spin" />
                <p className="text-xs font-black text-saluang-dark">
                  Mengunggah gambar dari perangkat...
                </p>
                <p className="text-[10px] text-saluang-dark/60">
                  Sedang menyimpan ke server lokal
                </p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-saluang-cream border-2 border-saluang-dark shadow-neo-xs flex items-center justify-center text-saluang-dark">
                  <Upload className="w-5 h-5 text-saluang-teal" />
                </div>
                <div>
                  <p className="text-xs font-black text-saluang-dark">
                    Klik untuk memilih foto dari perangkat Anda
                  </p>
                  <p className="text-[10px] text-saluang-dark/60 mt-0.5">
                    atau seret (drag & drop) gambar ke sini &bull; PNG, JPG, WEBP, GIF (Maks. 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setUploadError(null);
              }}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full pl-3 pr-9 py-2.5 rounded-xl border-2 border-saluang-dark bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-saluang-teal/30 font-semibold"
            />
            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-saluang-dark/50 hover:text-saluang-coral"
                title="Hapus URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-[11px] text-saluang-dark/60 font-medium">
            Tempel tautan gambar eksternal (Unsplash, CDN, atau Cloudinary).
          </p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-saluang-coral/15 border border-saluang-coral flex items-center gap-2 text-xs font-bold text-saluang-dark">
          <AlertCircle className="w-4 h-4 text-saluang-coral shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="p-1 hover:opacity-70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Image Preview Card (Jika gambar terisi) */}
      {value && (
        <div className="p-3 bg-saluang-cream rounded-2xl border-2 border-saluang-dark shadow-neo-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-saluang-dark shrink-0 shadow-neo-xs bg-saluang-yellow/40 text-saluang-dark">
                <Check className="w-2.5 h-2.5 text-saluang-dark" />
                {isLocalUpload ? 'Unggahan Perangkat Lokal' : isExternalUrl ? 'Tautan URL Online' : 'Gambar Aktif'}
              </span>
              <span className="text-[11px] font-mono font-bold text-saluang-dark/70 truncate">
                {value}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-saluang-dark hover:bg-saluang-sand text-saluang-dark transition-colors"
                title="Lihat Gambar Ukuran Penuh"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 rounded-lg border border-saluang-dark hover:bg-saluang-coral hover:text-white text-saluang-coral transition-colors cursor-pointer"
                title="Hapus / Ganti Gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Container */}
          <div className={`relative w-full ${aspectRatioClass} rounded-xl border border-saluang-dark overflow-hidden bg-saluang-dark/5 mx-auto`}>
            <img
              src={value}
              alt="Pratinjau gambar"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback jika URL rusak
                (e.target as any).src =
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>
      )}

      {/* Hidden input to ensure HTML form validation passes when required */}
      {required && (
        <input
          type="text"
          value={value}
          required={required}
          onChange={() => {}}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {helperText && (
        <p className="text-[11px] text-saluang-dark/60 font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
}
