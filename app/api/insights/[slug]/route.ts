import { NextResponse } from 'next/server';
import { getInsightBySlug } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const insight = await getInsightBySlug(params.slug);
    if (!insight) {
      return NextResponse.json({ error: 'Insight not found' }, { status: 404 });
    }
    return NextResponse.json(insight);
  } catch (error) {
    console.error('[Insight API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}