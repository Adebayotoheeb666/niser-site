import { NextRequest, NextResponse } from 'next/server';
import { isQdrantEnabled } from '@/lib/ai/qdrant';
import { isElasticsearchEnabled } from '@/lib/search/elasticsearch';
import { syncCmsContentToVectorStore } from '@/lib/ai/indexing';
import { requireAdminIfEnabled } from '@/lib/ai/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { secret?: string };
    const headerSecret = req.headers.get('x-webhook-secret') ?? '';
    const bodySecret = body.secret ?? '';
    const providedSecret = headerSecret || bodySecret;

    const access = await requireAdminIfEnabled(req, 'AI_ADMIN_ONLY_INGEST', providedSecret);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });
    }

    const hasVectorStore = isQdrantEnabled();
    const hasSearchIndex = isElasticsearchEnabled();

    if (!hasVectorStore && !hasSearchIndex) {
      return NextResponse.json({ error: 'No AI search backends are configured. Set QDRANT_URL or ELASTICSEARCH_URL in .env.local.' }, { status: 501 });
    }

    const result = await syncCmsContentToVectorStore();
    return NextResponse.json({
      ...result,
      backends: {
        qdrant: hasVectorStore,
        elasticsearch: hasSearchIndex,
      },
    });
  } catch (error) {
    console.error('[Admin Ingest API Error]:', error);
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Indexing failed: ${detail}` }, { status: 500 });
  }
}
