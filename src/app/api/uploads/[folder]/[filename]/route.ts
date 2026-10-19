import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { db } from '@/lib/db';
import { uploadedFiles } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function getMimeTypeFromExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

/**
 * GET /api/uploads/[folder]/[filename]
 * Menyajikan gambar secara dinamis baik dari penyimpanan disk lokal maupun dari database TiDB Cloud.
 * Dilengkapi header Cache-Control immutable agar di-cache oleh browser dan CDN edge.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { folder: string; filename: string } }
) {
  const { folder, filename } = params;

  if (!folder || !filename) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // 1. Coba baca dari disk lokal jika file ada
  try {
    const localPath = path.join(process.cwd(), 'public', 'uploads', folder, filename);
    const fileBuffer = await fs.readFile(localPath);
    const mime = getMimeTypeFromExt(filename);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    // Abaikan jika tidak ada di disk, lanjutkan pencarian di database TiDB Cloud
  }

  // 2. Baca dari database TiDB Cloud (Penyimpanan Serverless)
  try {
    const records = await db
      .select({
        mimeType: uploadedFiles.mimeType,
        data: uploadedFiles.data,
      })
      .from(uploadedFiles)
      .where(and(eq(uploadedFiles.folder, folder), eq(uploadedFiles.filename, filename)))
      .limit(1);

    if (records.length === 0) {
      return new NextResponse('File tidak ditemukan', { status: 404 });
    }

    const record = records[0];
    const imageBuffer = Buffer.from(record.data, 'base64');

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': record.mimeType || getMimeTypeFromExt(filename),
        'Content-Length': String(imageBuffer.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (dbError) {
    console.error('[API:Uploads:GET] Error retrieving image from DB:', dbError);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
