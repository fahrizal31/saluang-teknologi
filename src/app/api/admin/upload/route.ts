import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }
  return session.user;
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes

function getExtension(filename: string, mimeType: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  if (ext && ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(ext)) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/svg+xml':
      return 'svg';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
}

function sanitizeBaseName(name: string): string {
  const withoutExt = path.parse(name).name;
  return withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40) || 'upload';
}

/**
 * POST /api/admin/upload
 * Endpoint untuk upload gambar langsung dari perangkat pengguna (lokal/ponsel/laptop)
 */
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Sesi administrator diperlukan' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const requestedFolder = (formData.get('folder') as string | null) || 'portfolio';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file gambar yang diunggah' }, { status: 400 });
    }

    // Validasi tipe file
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Format file tidak didukung (${file.type}). Gunakan format JPG, PNG, WEBP, GIF, atau SVG.`,
        },
        { status: 400 }
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Batas maksimal adalah 10MB.`,
        },
        { status: 400 }
      );
    }

    // Tentukan folder penyimpanan yang aman
    const safeFolder = ['portfolio', 'team', 'services', 'general'].includes(requestedFolder)
      ? requestedFolder
      : 'portfolio';

    // Generate nama file unik dengan timestamp & random hex
    const ext = getExtension(file.name, file.type);
    const baseName = sanitizeBaseName(file.name);
    const uniqueHash = crypto.randomBytes(4).toString('hex');
    const filename = `${baseName}-${Date.now()}-${uniqueHash}.${ext}`;

    // 1. Prioritas Cloud: Jika Vercel Blob terkonfigurasi (BLOB_READ_WRITE_TOKEN tersedia)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`uploads/${safeFolder}/${filename}`, file, {
          access: 'public',
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          filename,
          size: file.size,
          mimeType: file.type,
          message: 'Gambar berhasil diunggah ke Vercel Blob!',
        });
      } catch (blobError: any) {
        console.error('[API:Admin:Upload:POST] Error saat upload ke Vercel Blob:', blobError);
        return NextResponse.json(
          { error: blobError?.message || 'Gagal mengunggah gambar ke cloud storage' },
          { status: 500 }
        );
      }
    }

    // 2. Lingkungan Lokal / VPS: Simpan ke folder public/uploads/
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', safeFolder);
      await fs.mkdir(uploadDir, { recursive: true });

      const destinationPath = path.join(uploadDir, filename);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(destinationPath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${filename}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        mimeType: file.type,
        message: 'Gambar berhasil diunggah dari perangkat!',
      });
    } catch (fsError: any) {
      // Jika berjalan di Vercel Serverless tanpa Vercel Blob, disk bersifat Read-Only (EROFS)
      if (fsError?.code === 'EROFS' || fsError?.message?.includes('read-only')) {
        return NextResponse.json(
          {
            error:
              'Penyimpanan disk serverless Vercel bersifat Read-Only. Untuk upload dari perangkat di Vercel, cukup klik 1-kali tombol "Create Blob" di tab Storage dashboard Vercel, ATAU gunakan tab "Tautan URL Gambar" untuk memasukkan tautan gambar langsung.',
          },
          { status: 500 }
        );
      }
      throw fsError;
    }
  } catch (error: any) {
    console.error('[API:Admin:Upload:POST] Error saat menyimpan file:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menyimpan file gambar ke server' },
      { status: 500 }
    );
  }
}
