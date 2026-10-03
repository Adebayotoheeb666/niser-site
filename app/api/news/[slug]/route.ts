import { NextResponse } from 'next/server';
import { getNewsBySlug } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const news = await getNewsBySlug(params.slug);
    if (!news) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (error) {
    console.error('[News API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}