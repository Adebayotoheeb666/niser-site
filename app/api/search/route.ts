import { NextRequest, NextResponse } from 'next/server';
import {
  getPublications,
  getResearchers,
  getInsights,
  getEvents,
  getNews,
} from '@/lib/cms/client';
import { getEmbedding } from '@/lib/ai/embeddings';
import { isQdrantEnabled, searchEmbeddings } from '@/lib/ai/qdrant';
import { isElasticsearchEnabled, searchDocuments } from '@/lib/search/elasticsearch';

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
  relevanceScore?: number;
  matchReason?: string;
}

function normalizeQueryTerms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((term) => term.length > 2),
    ),
  );
}

function scoreKeywordMatch(text: string, terms: string[]): number {
  if (!text || terms.length === 0) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (lower.includes(term)) {
      score += 1;
    }
  }
  return Math.min(1, score / terms.length);
}

function computeRecencyScore(year?: number): number {
  if (!year || Number.isNaN(year)) return 0;
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age <= 0) return 1;
  if (age >= 10) return 0;
  return 1 - age / 10;
}

function buildMatchReason(
  payloadTitle: string,
  payloadExcerpt: string,
  payloadContent: string | undefined,
  queryTerms: string[],
  vectorScore: number,
  keywordScore: number,
  recencyScore: number,
): string {
  const reasons: string[] = [];
  if (queryTerms.length) {
    const matchedTerms = queryTerms.filter((term) =>
      payloadTitle.toLowerCase().includes(term)
      || payloadExcerpt.toLowerCase().includes(term)
      || (payloadContent?.toLowerCase().includes(term) ?? false),
    );
    if (matchedTerms.length > 0) {
      reasons.push(`Contains '${matchedTerms.slice(0, 3).join("', '")}'`);
    }
  }

  if (vectorScore >= 0.45) {
    reasons.push('Strong semantic similarity');
  } else if (vectorScore > 0) {
    reasons.push('Related concept match');
  }

  if (recencyScore >= 0.5) {
    reasons.push('Recent source');
  }

  if (keywordScore >= 0.65) {
    reasons.push('Good keyword match');
  }

  return reasons.length > 0 ? reasons.join('; ') : 'Semantic match';
}

function getFallbackSearchData() {
  return {
    pubs: [
      {
        id: 'fallback-pub-1',
        title: 'Policy Response to Agricultural Productivity in Nigeria',
        abstract: 'This paper examines government agricultural policies and their impact on productivity.',
        authors: [{ fullName: 'Dr. Adekunle Okafor' }],
        keywords: ['agriculture', 'policy', 'productivity'],
        researchDivision: 'Agricultural Policy',
        publishedYear: 2024,
        publicationType: 'working_paper',
        slug: 'policy-response-to-agricultural-productivity-in-nigeria',
      },
    ],
    researchers: [
      {
        id: 'fallback-researcher-1',
        fullName: 'Dr. Adekunle Okafor',
        biography: 'Researcher focused on agricultural policy, productivity, and rural livelihoods.',
        researchInterests: ['agriculture', 'policy', 'productivity'],
        position: 'Senior Research Fellow',
        division: 'Agricultural Policy',
        slug: 'dr-adekunle-okafor',
      },
    ],
    insights: [
      {
        id: 'fallback-insight-1',
        title: 'Agricultural policy reforms and smallholder resilience',
        bodyPlaintext: 'Recent insights show that agricultural policy reforms can improve resilience for smallholder farmers.',
        body: 'Recent insights show that agricultural policy reforms can improve resilience for smallholder farmers.',
        author: { fullName: 'Dr. Zainab Muhammad' },
        socialSummary: 'Agricultural policy reforms can improve resilience for smallholder farmers.',
        publishedDate: '2024-01-15',
        slug: 'agricultural-policy-reforms-and-smallholder-resilience',
      },
    ],
    events: [
      {
        id: 'fallback-event-1',
        title: 'National Forum on Agricultural Policy',
        summary: 'A forum discussing agricultural policy reforms and implementation.',
        location: 'Ibadan',
        division: 'Agricultural Policy',
        eventType: 'Forum',
        startDate: '2024-03-20',
      },
    ],
    news: [
      {
        id: 'fallback-news-1',
        title: 'NISER highlights new agricultural policy research',
        summary: 'NISER shares recent findings on agricultural policy and rural productivity.',
        body: 'NISER shares recent findings on agricultural policy and rural productivity.',
        publishedDate: '2024-02-10',
        slug: 'niser-highlights-new-agricultural-policy-research',
      },
    ],
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q')?.trim() ?? '';
    const type = searchParams.get('type') ?? 'all';
    const division = searchParams.get('division') ?? 'all';
    const yearStr = searchParams.get('year') ?? 'all';
    const mode = searchParams.get('mode') ?? 'keyword';
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

    const fallbackData = getFallbackSearchData();
    const hasCmsData = pubs.length > 0 || researchers.length > 0 || insights.length > 0 || events.length > 0 || news.length > 0;
    const effectivePubs = hasCmsData ? pubs : (fallbackData.pubs as typeof pubs);
    const effectiveResearchers = hasCmsData ? researchers : (fallbackData.researchers as typeof researchers);
    const effectiveInsights = hasCmsData ? insights : (fallbackData.insights as typeof insights);
    const effectiveEvents = hasCmsData ? events : (fallbackData.events as typeof events);
    const effectiveNews = hasCmsData ? news : (fallbackData.news as typeof news);

    let hits: SearchHit[] = [];

    const isSemantic = mode === 'semantic' && q.length > 0 && isQdrantEnabled();
    const isElasticKeyword = mode === 'keyword' && isElasticsearchEnabled();

    if (isElasticKeyword) {
      try {
        const { results, total } = await searchDocuments(q, page, 10, type, division, yearStr);
        const elasticHits: SearchHit[] = results.map((result) => ({
          id: result.id,
          type: result.sourceType as SearchHit['type'],
          title: result.title,
          excerpt: result.excerpt,
          url: result.url,
          division: result.division,
          year: result.publishedYear,
          extraInfo: result.sourceType,
        }));

        return NextResponse.json({
          hits: elasticHits,
          total,
          page,
          totalPages: Math.ceil(total / limit),
          mode: 'keyword',
        });
      } catch (error) {
        console.warn('[Search API] Elasticsearch search unavailable:', (error as Error).message);
      }
    }

    if (isSemantic) {
      try {
        const queryVector = await getEmbedding(q);
        const results = await searchEmbeddings(queryVector, 20);
        const queryTerms = normalizeQueryTerms(q);

        const sourceMap = new Map<string, SearchHit>();
        for (const result of results) {
          const payload = result.payload;
          if (!payload) continue;

          const title = payload.title;
          const excerpt = payload.excerpt;
          const content = payload.content ?? '';
          const vectorScore = Math.max(0, Math.min(1, result.score));
          const keywordScore = Math.max(
            scoreKeywordMatch(title, queryTerms) * 1.5,
            scoreKeywordMatch(excerpt, queryTerms),
            scoreKeywordMatch(content, queryTerms) * 0.8,
          );
          const recencyScore = computeRecencyScore(payload.publishedYear);
          const relevanceScore = Math.min(
            1,
            0.55 * vectorScore + 0.3 * keywordScore + 0.15 * recencyScore,
          );
          const matchReason = buildMatchReason(
            title,
            excerpt,
            content,
            queryTerms,
            vectorScore,
            keywordScore,
            recencyScore,
          );

          const hit: SearchHit = {
            id: result.id,
            type: (payload.sourceType as SearchHit['type']) ?? 'publication',
            title,
            excerpt,
            url: payload.url,
            division: payload.sourceType === 'publication' ? payload.sourceType : undefined,
            year: payload.publishedYear,
            extraInfo: payload.sourceType ? payload.sourceType : undefined,
            relevanceScore,
            matchReason,
          };

          const existing = sourceMap.get(hit.url);
          if (!existing || (hit.relevanceScore ?? 0) > (existing.relevanceScore ?? 0)) {
            sourceMap.set(hit.url, hit);
          }
        }

        hits = Array.from(sourceMap.values()).sort(
          (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0),
        );
      } catch (error) {
        console.warn('[Search API] Semantic search unavailable:', (error as Error).message);
      }
    }

    // Fallback to keyword search when semantic mode is not available or fails
    if (!isSemantic || hits.length === 0) {
      // 1. Process Publications
    if (type === 'all' || type === 'publication') {
      effectivePubs.forEach((p) => {
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
      effectiveResearchers.forEach((r) => {
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
      effectiveInsights.forEach((i) => {
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
      effectiveEvents.forEach((e) => {
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
      effectiveNews.forEach((n) => {
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
            year: n.publishedDate ? new Date(n.publishedDate).getFullYear() : undefined,
          });
        }
      });
    }

    }

    if (!isSemantic && q) {
      const queryTerms = normalizeQueryTerms(q);
      hits = hits.map((hit) => {
        const keywordScore = scoreKeywordMatch(`${hit.title} ${hit.excerpt}`, queryTerms);
        const recencyScore = computeRecencyScore(hit.year);
        return {
          ...hit,
          relevanceScore: Math.min(1, keywordScore * 0.85 + recencyScore * 0.15),
          matchReason: buildMatchReason(hit.title, hit.excerpt, undefined, queryTerms, 0, keywordScore, recencyScore),
        };
      });
      hits.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
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
      mode: isSemantic ? 'semantic' : 'keyword',
    });
  } catch (error) {
    console.error('[Search API Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
