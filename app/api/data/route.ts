import { NextResponse } from 'next/server';
import { getDatasets } from '@/lib/ckan';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const datasets = await getDatasets();
    return NextResponse.json(datasets);
  } catch (error) {
    console.error('[Data API Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
