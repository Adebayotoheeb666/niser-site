import { NextRequest, NextResponse } from 'next/server';
import { getRecommendationsForContent } from '@/lib/ai/recommendations';
import { getPublicationBySlug, getInsightBySlug } from '@/lib/cms/client';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const recommendations = await getRecommendationsForContent(body);
  return NextResponse.json({ recommendations });
}

/**
 * GET /api/recommendations?slug=...&type=publication|insight&limit=6
 *
 * Mobile-friendly lookup: resolves a CMS slug into recommendation signals
 * and returns related content (used by the Flutter app's carousel).
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  const type = req.nextUrl.searchParams.get('type') ?? 'publication';
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '6') || 6, 12);

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  try {
    let source = null;
    if (type === 'insight') {
      const insight = await getInsightBySlug(slug);
      if (insight) {
        source = {
          id: `insight:${insight.id}`,
          title: insight.title,
          type: 'insight' as const,
          slug: insight.slug,
          excerpt: insight.socialSummary ?? insight.bodyPlaintext?.slice(0, 400) ?? '',
          tags: insight.tags ?? [],
          publishedDate: insight.publishedDate,
          contentType: insight.contentType,
        };
      }
    } else {
      const publication = await getPublicationBySlug(slug);
      if (publication) {
        source = {
          id: `publication:${publication.id}`,
          title: publication.title,
          type: 'publication' as const,
          slug: publication.slug,
          excerpt: publication.abstract ?? '',
          keywords: publication.keywords ?? [],
          division: publication.researchDivision,
          publishedYear: publication.publishedYear,
          contentType: publication.publicationType,
        };
      }
    }

    if (!source) {
      return NextResponse.json({ error: 'Content not found', recommendations: [] }, { status: 404 });
    }

    const recommendations = await getRecommendationsForContent(source);
    return NextResponse.json({
      recommendations: recommendations.slice(0, limit).map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        slug: (r.url ?? '').replace(/^\/[^/]+\//, '') || null,
        url: r.url,
        excerpt: r.excerpt ?? null,
        score: r.score ?? null,
      })),
    });
  } catch (error) {
    console.error('[Recommendations API Error]:', error);
    return NextResponse.json({ recommendations: [] }, { status: 200 });
  }
}
