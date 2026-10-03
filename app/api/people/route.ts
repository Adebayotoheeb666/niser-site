import { NextRequest, NextResponse } from 'next/server';
import { getResearchers } from '@/lib/cms/client';
import type { ResearchDivision } from '@/types/cms';

export const dynamic = 'force-dynamic';

const VALID_DIVISIONS: ResearchDivision[] = ['macroeconomics', 'poverty_social', 'agriculture', 'governance', 'industry'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const divisionParam = searchParams.get('division');
    const division: ResearchDivision | undefined = VALID_DIVISIONS.includes(divisionParam as ResearchDivision)
      ? (divisionParam as ResearchDivision)
      : undefined;
    const q = (searchParams.get('q') ?? '').trim().toLowerCase();

    const raw = await getResearchers({ active: true, division });

    let items = Array.isArray(raw) ? raw : [];

    if (q) {
      items = items.filter((r) => {
        const hay = `${r.titlePrefix ?? ''} ${r.fullName} ${r.biography ?? ''} ${r.researchInterests?.join(' ') ?? ''} ${r.position}`.toLowerCase();
        return hay.includes(q);
      });
    }

    items.sort((a, b) => a.fullName.localeCompare(b.fullName));

    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error('[API/people] error', (err as Error).message);
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}