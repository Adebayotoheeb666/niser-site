import { NextResponse } from 'next/server';
import { getDatasetById } from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const dataset = await getDatasetById(params.id);
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    return NextResponse.json(dataset);
  } catch (error) {
    console.error('[Dataset API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
