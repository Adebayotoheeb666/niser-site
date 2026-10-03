import { NextRequest, NextResponse } from 'next/server';
import { getPublications } from '@/lib/cms/client';
import type { PublicationType, ResearchDivision } from '@/types/cms';

export const dynamic = 'force-dynamic';

const VALID_TYPES: PublicationType[] = ['working_paper', 'policy_brief', 'journal_article', 'book_chapter', 'annual_report', 'conference_paper'];
const VALID_DIVISIONS: ResearchDivision[] = ['macroeconomics', 'poverty_social', 'agriculture', 'governance', 'industry'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = (searchParams.get('q') ?? '').trim().toLowerCase();
    const typeParam = searchParams.get('type');
    const type: PublicationType | undefined = VALID_TYPES.includes(typeParam as PublicationType)
      ? (typeParam as PublicationType)
      : undefined;
    const divisionParam = searchParams.get('division');
    const division: ResearchDivision | undefined = VALID_DIVISIONS.includes(divisionParam as ResearchDivision)
      ? (divisionParam as ResearchDivision)
      : undefined;
    const yearStr = searchParams.get('year') ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') ?? '9', 10));

    // Fetch a larger batch from CMS (CMS does not currently provide totals).
    const raw = await getPublications({ limit: 500, type, division, year: yearStr ? Number(yearStr) : undefined });

    let items = Array.isArray(raw) ? raw : [];

    if (q) {
      items = items.filter((p) => {
        const hay = `${p.title} ${p.abstract ?? ''} ${p.authors?.map((a) => a.fullName).join(' ') ?? ''}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit);

    return NextResponse.json({ items: paged, total, page, totalPages });
  } catch (err) {
    console.error('[API/publications] error', (err as Error).message);
    return NextResponse.json({ items: [], total: 0, page: 1, totalPages: 1 }, { status: 500 });
  }
}
