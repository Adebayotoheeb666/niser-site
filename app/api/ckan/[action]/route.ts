import { NextRequest, NextResponse } from 'next/server';
import { getDatasets, getDatasetById } from '@/lib/cms/client';
import { getCkanDataset, isCkanConfigured, type CkanDatasetSummary } from '@/lib/ckan';

/**
 * CKAN-compatible public data API.
 *
 * Exposes NISER's open-data catalogue using CKAN Action API response shapes
 * so that external consumers can integrate without changes when the portal
 * is fronted by this service. Supported actions:
 *
 *   GET /api/ckan/package_list            → { success, result: string[] }
 *   GET /api/ckan/package_show?id=...     → { success, result: dataset }
 *   GET /api/ckan/tag_list                → { success, result: string[] }
 *
 * Backed by the self-hosted CKAN portal when CKAN_API_URL is configured;
 * otherwise synthesised from CMS-managed datasets.
 */

export const dynamic = 'force-dynamic';

const ALLOWED_ACTIONS = new Set(['package_list', 'package_show', 'tag_list']);

function ok(result: unknown) {
  return NextResponse.json({ success: true, result });
}

export async function GET(req: NextRequest, { params }: { params: { action: string } }) {
  const action = params.action;

  if (!ALLOWED_ACTIONS.has(action)) {
    return NextResponse.json(
      { success: false, error: { __type: 'Action Error', message: `Action "${action}" is not available` } },
      { status: 404 },
    );
  }

  try {
    if (action === 'package_show') {
      const id = req.nextUrl.searchParams.get('id');
      if (!id) {
        return NextResponse.json(
          { success: false, error: { __type: 'Validation Error', message: "'id' parameter is required" } },
          { status: 400 },
        );
      }

      if (isCkanConfigured()) {
        const pkg = await getCkanDataset(id);
        if (pkg) return ok(pkg);
      }

      const dataset = await getDatasetById(id);
      if (!dataset) {
        return NextResponse.json(
          { success: false, error: { __type: 'Not Found Error', message: `Couldn't find dataset '${id}'` } },
          { status: 404 },
        );
      }
      return ok(dataset);
    }

    // package_list / tag_list — synthesised from CMS datasets when no backend
    const datasets = await getDatasets();

    if (action === 'tag_list') {
      const tagSet = new Set<string>();
      for (const d of datasets) {
        for (const tag of d.tags ?? []) tagSet.add(tag);
      }
      return ok(Array.from(tagSet).sort());
    }

    const names: CkanDatasetSummary[] = datasets.map((d) => ({
      id: d.id,
      title: d.title,
      notes: d.notes?.slice(0, 300) ?? '',
      formatCount: d.resources?.length ?? 0,
      metadataModified: d.metadataModified,
      tags: d.tags ?? [],
    }));
    return ok(names.map((d) => d.id));
  } catch (error) {
    console.error('[CKAN API Error]:', error);
    return NextResponse.json(
      { success: false, error: { __type: 'API Error', message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
