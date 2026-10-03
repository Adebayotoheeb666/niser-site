import { NextRequest, NextResponse } from 'next/server';
import { isQdrantEnabled } from '@/lib/ai/qdrant';
import { syncCmsContentToVectorStore } from '@/lib/ai/indexing';
import { requireAdminIfEnabled } from '@/lib/ai/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { secret?: string };
    const headerSecret = req.headers.get('x-webhook-secret') ?? '';
    const bodySecret = body.secret ?? '';
    const providedSecret = headerSecret || bodySecret;

    const access = await requireAdminIfEnabled(req, 'AI_ADMIN_ONLY_EMBED', providedSecret);
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 401 });
    }

    if (!isQdrantEnabled()) {
      return NextResponse.json({ error: 'Qdrant is not configured' }, { status: 501 });
    }

    const result = await syncCmsContentToVectorStore();

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Embed API Error]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
