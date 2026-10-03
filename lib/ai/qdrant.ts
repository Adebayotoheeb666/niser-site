const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION ?? 'niser_documents';
// Large single-request upserts can be dropped by proxies/MTU-limited networks,
// so points are sent in modest batches.
const QDRANT_UPSERT_BATCH_SIZE = Math.max(1, Number(process.env.QDRANT_UPSERT_BATCH_SIZE ?? 100));

import { createHash } from 'node:crypto';

export function isQdrantEnabled(): boolean {
  return Boolean(QDRANT_URL);
}

/**
 * Qdrant only accepts positive integers or UUIDs as point IDs (string IDs are
 * rejected with a `Format error in JSON body` 400). Produce a deterministic
 * RFC-4122 (version 5) UUID from a stable identifier.
 */
export function qdrantPointId(identifier: string): string {
  const digest = createHash('sha256').update(identifier).digest();
  const bytes = Buffer.from(digest.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export interface QdrantPointPayload {
  sourceId: string;
  title: string;
  excerpt: string;
  content?: string;
  url: string;
  sourceType?: string;
  publishedYear?: number;
}

export interface QdrantSearchResult {
  id: string;
  score: number;
  payload?: QdrantPointPayload;
}

function buildHeaders(contentType = 'application/json'): Record<string, string> {
  return {
    'Content-Type': contentType,
    ...(QDRANT_API_KEY ? { 'X-API-Key': QDRANT_API_KEY } : {}),
  };
}

async function ensureQdrantCollection(vectorSize: number): Promise<void> {
  if (!QDRANT_URL) {
    throw new Error('QDRANT_URL is not configured. Set it in .env.local');
  }

  const collectionUrl = `${QDRANT_URL}/collections/${encodeURIComponent(QDRANT_COLLECTION)}`;
  const statusResponse = await fetch(collectionUrl, {
    method: 'GET',
    headers: buildHeaders(),
  });

  if (statusResponse.ok) {
    return;
  }

  if (statusResponse.status !== 404) {
    const text = await statusResponse.text();
    throw new Error(`Failed to verify Qdrant collection: ${statusResponse.status} ${text}`);
  }

  const createResponse = await fetch(collectionUrl, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify({
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    }),
  });

  if (!createResponse.ok) {
    const text = await createResponse.text();
    throw new Error(`Failed to create Qdrant collection: ${createResponse.status} ${text}`);
  }
}

export async function upsertEmbeddings(
  points: Array<{ id: string; vector: number[]; payload: QdrantPointPayload }>,
): Promise<void> {
  if (!QDRANT_URL) {
    throw new Error('QDRANT_URL is not configured. Set it in .env.local');
  }

  if (points.length === 0) {
    return;
  }

  for (let offset = 0; offset < points.length; offset += QDRANT_UPSERT_BATCH_SIZE) {
    const batch = points.slice(offset, offset + QDRANT_UPSERT_BATCH_SIZE);
    await ensureQdrantCollection(batch[0].vector.length);

    const url = `${QDRANT_URL}/collections/${encodeURIComponent(QDRANT_COLLECTION)}/points?wait=true`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify({ points: batch }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Qdrant upsert failed: ${response.status} ${text}`);
    }
  }
}

export async function deleteStaleEmbeddings(activeSourceIds: string[]): Promise<void> {
  if (!QDRANT_URL || activeSourceIds.length === 0) return;
  const url = `${QDRANT_URL}/collections/${encodeURIComponent(QDRANT_COLLECTION)}/points/delete?wait=true`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ filter: { must_not: [{ key: 'sourceId', match: { any: activeSourceIds } }] } }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qdrant stale-point deletion failed: ${response.status} ${text}`);
  }
}

export async function searchEmbeddings(
  vector: number[],
  topK = 5,
): Promise<QdrantSearchResult[]> {
  if (!QDRANT_URL) {
    throw new Error('QDRANT_URL is not configured. Set it in .env.local');
  }

  const url = `${QDRANT_URL}/collections/${encodeURIComponent(QDRANT_COLLECTION)}/points/search`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      vector,
      limit: topK,
      with_payload: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Qdrant search failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.result)) {
    throw new Error(`Unexpected Qdrant response: ${JSON.stringify(data)}`);
  }

  interface QdrantSearchResponseItem {
    id: string | number;
    score?: number;
    payload?: QdrantPointPayload;
  }

  return data.result.map((item: QdrantSearchResponseItem) => ({
    id: String(item.id),
    score: Number(item.score ?? 0),
    payload: item.payload as QdrantPointPayload,
  }));
}
