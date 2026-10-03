import { NextRequest, NextResponse } from 'next/server';
import { getInsights } from '@/lib/cms/client';
import type { InsightContentType } from '@/types/cms';

export const dynamic = 'force-dynamic';

const VALID_CONTENT_TYPES: InsightContentType[] = ['policy_brief', 'commentary', 'analysis', 'opinion', 'rapid_response'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const contentTypeParam = searchParams.get('contentType');
    const contentType: InsightContentType | undefined = VALID_CONTENT_TYPES.includes(contentTypeParam as InsightContentType)
      ? (contentTypeParam as InsightContentType)
      : undefined;
    const q = (searchParams.get('q') ?? '').trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10));

    const raw = await getInsights({ limit: 200, contentType });

    let items = Array.isArray(raw) ? raw : [];

    if (q) {
      items = items.filter((i) => {
        const hay = `${i.title} ${i.bodyPlaintext ?? ''} ${i.body ?? ''} ${i.author?.fullName ?? ''}`.toLowerCase();
        return hay.includes(q);
      });
    }

    items.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    return NextResponse.json({ items: paged, total, page, totalPages });
  } catch (err) {
    console.error('[API/insights] error', (err as Error).message);
    return NextResponse.json({ items: [], total: 0, page: 1, totalPages: 1 }, { status: 500 });
  }
}