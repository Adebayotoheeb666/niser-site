import { NextRequest, NextResponse } from 'next/server';
import {
  getPublications,
  getResearchers,
  getInsights,
  getEvents,
  getNews,
} from '@/lib/cms/client';

export const dynamic = 'force-dynamic';

interface SearchHit {
  id: string;
  type: 'publication' | 'researcher' | 'insight' | 'event' | 'news';
  title: string;
  excerpt: string;
  url: string;
  division?: string;
  year?: number;
  extraInfo?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q')?.toLowerCase() ?? '';
    const type = searchParams.get('type') ?? 'all';
    const division = searchParams.get('division') ?? 'all';
    const yearStr = searchParams.get('year') ?? 'all';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = 10;

    // Fetch data from CMS in parallel
    const [pubs, researchers, insights, events, news] = await Promise.all([
      getPublications({ limit: 200 }),
      getResearchers({ active: true }),
      getInsights({ limit: 100 }),
      getEvents({ limit: 100 }),
      getNews({ limit: 100 }),
    ]);

    let hits: SearchHit[] = [];

    // 1. Process Publications
    if (type === 'all' || type === 'publication') {
      pubs.forEach((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const abstractMatch = p.abstract.toLowerCase().includes(q);
        const authorMatch = p.authors?.some((a) =>
          a.fullName.toLowerCase().includes(q)
        );
        const keywordsMatch = p.keywords?.some((k) =>
          k.toLowerCase().includes(q)
        );

        if (!q || titleMatch || abstractMatch || authorMatch || keywordsMatch) {
          hits.push({
            id: p.id,
            type: 'publication',
            title: p.title,
            excerpt: p.abstract.substring(0, 180) + '...',
            url: `/publications/${p.slug}`,
            division: p.researchDivision,
            year: p.publishedYear,
            extraInfo: `${p.publicationType.replace('_', ' ')} • ${p.publishedYear}`,
          });
        }
      });
    }

    // 2. Process Researchers
    if (type === 'all' || type === 'researcher') {
      researchers.forEach((r) => {
        const nameMatch = r.fullName.toLowerCase().includes(q);
        const bioMatch = r.biography?.toLowerCase().includes(q);
        const interestsMatch = r.researchInterests?.some((i) =>
          i.toLowerCase().includes(q)
        );

        if (!q || nameMatch || bioMatch || interestsMatch) {
          hits.push({
            id: r.id,
            type: 'researcher',
            title: `${r.titlePrefix ? r.titlePrefix + ' ' : ''}${r.fullName}`,
            excerpt: r.position + (r.biography ? ` — ${r.biography.substring(0, 140)}...` : ''),
            url: `/people/${r.slug}`,
            division: r.division,
            extraInfo: r.position,
          });
        }
      });
    }

    // 3. Process Insights
    if (type === 'all' || type === 'insight') {
      insights.forEach((i) => {
        const titleMatch = i.title.toLowerCase().includes(q);
        const bodyMatch = i.bodyPlaintext?.toLowerCase().includes(q) || i.body?.toLowerCase().includes(q);
        const authorMatch = i.author?.fullName.toLowerCase().includes(q);

        if (!q || titleMatch || bodyMatch || authorMatch) {
          hits.push({
            id: i.id,
            type: 'insight',
            title: i.title,
            excerpt: i.socialSummary || (i.bodyPlaintext ? i.bodyPlaintext.substring(0, 180) + '...' : ''),
            url: `/insights/${i.slug}`,
            extraInfo: `Policy Insight • ${new Date(i.publishedDate).toLocaleDateString()}`,
          });
        }
      });
    }

    // 4. Process Events
    if (type === 'all' || type === 'event') {
      events.forEach((e) => {
        const titleMatch = e.title.toLowerCase().includes(q);
        const summaryMatch = e.summary?.toLowerCase().includes(q);
        const locationMatch = e.location?.toLowerCase().includes(q);

        if (!q || titleMatch || summaryMatch || locationMatch) {
          hits.push({
            id: e.id,
            type: 'event',
            title: e.title,
            excerpt: e.summary || `Event at ${e.location || 'Online'} starting ${new Date(e.startDate).toLocaleDateString()}`,
            url: `/events`,
            division: e.division,
            extraInfo: `${e.eventType} • ${new Date(e.startDate).toLocaleDateString()}`,
          });
        }
      });
    }

    // 5. Process News
    if (type === 'all' || type === 'news') {
      news.forEach((n) => {
        const titleMatch = n.title.toLowerCase().includes(q);
        const bodyMatch = n.body?.toLowerCase().includes(q);

        if (!q || titleMatch || bodyMatch) {
          hits.push({
            id: n.id,
            type: 'news',
            title: n.title,
            excerpt: n.summary || (n.body ? n.body.substring(0, 180) + '...' : ''),
            url: n.externalUrl || `/news/${n.slug}`,
            extraInfo: `News • ${new Date(n.publishedDate).toLocaleDateString()}`,
          });
        }
      });
    }

    // Apply Division filter
    if (division !== 'all') {
      hits = hits.filter((h) => h.division === division);
    }

    // Apply Year filter (for publications only)
    if (yearStr !== 'all') {
      const year = parseInt(yearStr, 10);
      hits = hits.filter((h) => h.type !== 'publication' || h.year === year);
    }

    // Paginate
    const total = hits.length;
    const startIndex = (page - 1) * limit;
    const paginatedHits = hits.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      hits: paginatedHits,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[Search API Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
