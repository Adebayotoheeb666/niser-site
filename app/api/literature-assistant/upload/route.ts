import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'node:crypto';
import { requireInternalAccess } from '@/lib/ai/auth';
import { extractTextFromDocument } from '@/lib/ai/document-parser';
import { getEmbedding } from '@/lib/ai/embeddings';
import { buildDocumentChunks } from '@/lib/ai/indexing';
import { isQdrantEnabled, upsertEmbeddings } from '@/lib/ai/qdrant';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'literature');
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = 25 * 1024 * 1024;

function isSupportedFile(name: string, buffer: Buffer): boolean {
  const extension = path.extname(name).toLowerCase();
  if (extension === '.pdf') return buffer.subarray(0, 5).toString() === '%PDF-';
  if (extension === '.docx') return buffer.subarray(0, 4).toString() === 'PK\x03\x04';
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const access = await requireInternalAccess(req);
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });
    if (req.headers.get('content-type')?.split(';')[0] !== 'application/json') {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }
    const contentLength = Number(req.headers.get('content-length') ?? '0');
    if (contentLength > MAX_REQUEST_BYTES) return NextResponse.json({ error: 'Upload request exceeds the 25 MB limit' }, { status: 413 });
    const body = (await req.json().catch(() => ({}))) as {
      files?: Array<{ filename: string; contentBase64: string }>;
    };

    if (!body.files || !Array.isArray(body.files) || body.files.length === 0 || body.files.length > MAX_FILES) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true, mode: 0o700 });
    const saved: Array<{ id: string; name: string; indexed: boolean }> = [];
    let totalBytes = 0;

    for (const file of body.files) {
      if (typeof file.filename !== 'string' || typeof file.contentBase64 !== 'string') {
        return NextResponse.json({ error: 'Each file requires a filename and base64 content' }, { status: 400 });
      }

      const name = path.basename(file.filename).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
      const buffer = Buffer.from(file.contentBase64, 'base64');
      if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES || !isSupportedFile(name, buffer)) {
        return NextResponse.json({ error: 'Only valid PDF or DOCX files up to 10 MB are accepted' }, { status: 400 });
      }

      totalBytes += buffer.length;
      if (totalBytes > 20 * 1024 * 1024) return NextResponse.json({ error: 'Combined upload size exceeds the 20 MB limit' }, { status: 413 });

      const id = randomUUID();
      const target = path.join(UPLOAD_DIR, `${id}${path.extname(name).toLowerCase()}`);
      await fs.writeFile(target, buffer, { mode: 0o600 });

      let indexed = false;
      try {
        if (isQdrantEnabled()) {
          const parsedText = await extractTextFromDocument(name, buffer);
          if (parsedText.trim()) {
            const chunks = buildDocumentChunks({
              id: `upload-${id}`,
              title: name,
              excerpt: parsedText.slice(0, 400),
              url: `uploaded://${name}`,
              sourceType: 'publication',
              content: parsedText,
            });

            const points = await Promise.all(
              chunks.map(async (chunk, chunkIndex) => ({
                id: `upload-${id}:${chunkIndex}`,
                vector: await getEmbedding(chunk.text),
                payload: chunk.payload,
              })),
            );

            await upsertEmbeddings(points);
            indexed = true;
          }
        }
      } catch (err) {
        console.warn('[Literature Upload] Failed to index uploaded file:', err);
      }

      saved.push({ id, name, indexed });
    }

    return NextResponse.json({ message: 'Files saved', files: saved });
  } catch (err) {
    console.error('[Literature Upload API Error]:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
