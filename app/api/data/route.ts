import { NextResponse } from 'next/server';
import { getDatasets } from '@/lib/cms/client';
import { getCkanDatasets, isCkanConfigured } from '@/lib/ckan';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // CKAN portal first (when configured), CMS datasets as fallback
    if (isCkanConfigured()) {
      const ckan = await getCkanDatasets(100);
      if (ckan.length > 0) {
        return NextResponse.json(ckan, { headers: { 'X-Data-Source': 'ckan' } });
      }
    }

    const datasets = await getDatasets();
    return NextResponse.json(datasets ?? [], { headers: { 'X-Data-Source': 'cms' } });
  } catch (error) {
    console.error('[Data API Error]:', error);
    return NextResponse.json([], { status: 200 });
  }
}
