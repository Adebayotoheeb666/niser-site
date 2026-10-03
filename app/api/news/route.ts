import { NextRequest, NextResponse } from 'next/server';
import { getNews } from '@/lib/cms/client';
import type { NewsCategory } from '@/types/cms';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: NewsCategory[] = ['institutional', 'media', 'external'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const categoryParam = searchParams.get('category');
    const category: NewsCategory | undefined = VALID_CATEGORIES.includes(categoryParam as NewsCategory)
      ? (categoryParam as NewsCategory)
      : undefined;
    const q = (searchParams.get('q') ?? '').trim().toLowerCase();
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10));

    const raw = await getNews({ limit: 200, category });

    let items = Array.isArray(raw) ? raw : [];

    if (q) {
      items = items.filter((n) => {
        const hay = `${n.title} ${n.summary ?? ''} ${n.body ?? ''}`.toLowerCase();
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
    console.error('[API/news] error', (err as Error).message);
    return NextResponse.json({ items: [], total: 0, page: 1, totalPages: 1 }, { status: 500 });
  }
}