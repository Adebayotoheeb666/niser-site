import { NextResponse } from 'next/server';
import { getResearcherBySlug } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const researcher = await getResearcherBySlug(params.slug);
    if (!researcher) {
      return NextResponse.json({ error: 'Researcher not found' }, { status: 404 });
    }
    return NextResponse.json(researcher);
  } catch (error) {
    console.error('[People API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}