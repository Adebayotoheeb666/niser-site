import { NextResponse } from 'next/server';
import { getPublicationBySlug } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const publication = await getPublicationBySlug(params.slug);
    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }
    return NextResponse.json(publication);
  } catch (error) {
    console.error('[Publication API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}