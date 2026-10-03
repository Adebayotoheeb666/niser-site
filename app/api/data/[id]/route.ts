import { NextResponse } from 'next/server';
import { getDatasetById } from '@/lib/cms/client';
import { getCkanDataset, isCkanConfigured, mapCkanPackageToDataset } from '@/lib/ckan';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    // CKAN portal first (when configured), CMS dataset as fallback
    if (isCkanConfigured()) {
      const pkg = await getCkanDataset(params.id);
      const dataset = pkg ? mapCkanPackageToDataset(pkg) : null;
      if (dataset) {
        return NextResponse.json(dataset, { headers: { 'X-Data-Source': 'ckan' } });
      }
    }

    const dataset = await getDatasetById(params.id);
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }
    return NextResponse.json(dataset, { headers: { 'X-Data-Source': 'cms' } });
  } catch (error) {
    console.error('[Dataset API Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
