import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const scope = searchParams.get('scope') ?? 'all'; // all | upcoming | past
    const type = searchParams.get('type') ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10));

    const raw = await getEvents({
      limit: 500,
      upcoming: scope === 'upcoming' ? true : undefined,
    });

    const now = new Date();
    let items = Array.isArray(raw) ? raw : [];

    if (scope === 'past') {
      items = items.filter((e) => {
        const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
        return end < now;
      });
    } else if (scope === 'upcoming') {
      items = items.filter((e) => new Date(e.startDate) >= now);
    }

    if (type) {
      items = items.filter((e) => e.eventType === type);
    }

    items.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    return NextResponse.json({ items: paged, total, page, totalPages, scope });
  } catch (err) {
    console.error('[API/events] error', (err as Error).message);
    return NextResponse.json({ items: [], total: 0, page: 1, totalPages: 1, scope: 'all' }, { status: 500 });
  }
}