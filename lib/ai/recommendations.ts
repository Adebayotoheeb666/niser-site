import { getEvents, getInsights, getNews, getPublications } from '@/lib/cms/client';
import { getEmbedding } from '@/lib/ai/embeddings';

export type RecommendationType = 'publication' | 'insight' | 'event' | 'news';

export interface UserSignals {
  viewedIds?: string[];
  preferredTypes?: RecommendationType[];
  interests?: string[];
}

export interface RecommendationSource {
  id: string;
  title: string;
  type: RecommendationType;
  slug?: string;
  excerpt?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  division?: string | null;
  publishedYear?: number | null;
  publishedDate?: string | null;
  contentType?: string | null;
  content?: string | null;
  pageContext?: string | null;
  userSignals?: UserSignals | null;
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: RecommendationType;
  url: string;
  excerpt: string;
  score: number;
  reason: string;
}

function normalizeText(value?: string | null): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenize(value?: string | null): Set<string> {
  return new Set(normalizeText(value).split(/\s+/).filter(Boolean));
}

function getExcerpt(value?: string | null, fallback = ''): string {
  const text = normalizeText(value ?? fallback);
  if (!text) return fallback;
  return text.length > 180 ? `${text.slice(0, 177)}...` : text;
}

function buildTextForEmbedding(source: RecommendationSource): string {
  const parts = [
    source.title,
    source.excerpt,
    source.content,
    (source.keywords ?? []).join(' '),
    (source.tags ?? []).join(' '),
    source.division,
    source.contentType,
    source.pageContext,
    (source.userSignals?.interests ?? []).join(' '),
  ];

  return normalizeText(parts.filter(Boolean).join(' '));
}

function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  const dot = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
  const normA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
  const normB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));

  if (!normA || !normB) return 0;
  return dot / (normA * normB);
}

function calculateMetadataScore(source: RecommendationSource, candidate: RecommendationSource): number {
  const sourceTokens = tokenize(
    `${source.title} ${source.excerpt ?? ''} ${(source.keywords ?? []).join(' ')} ${(source.tags ?? []).join(' ')} ${source.pageContext ?? ''}`,
  );
  const candidateTokens = tokenize(
    `${candidate.title} ${candidate.excerpt ?? ''} ${(candidate.keywords ?? []).join(' ')} ${(candidate.tags ?? []).join(' ')} ${candidate.pageContext ?? ''}`,
  );

  let score = 0;
  const overlap = Array.from(sourceTokens).filter((token) => candidateTokens.has(token));
  score += overlap.length * 0.5;

  if (source.division && candidate.division && source.division === candidate.division) {
    score += 1.0;
  }

  if (source.type === candidate.type) {
    score += 0.4;
  }

  if (source.contentType && candidate.contentType && source.contentType === candidate.contentType) {
    score += 0.5;
  }

  const sourceYear = source.publishedYear;
  const candidateYear = candidate.publishedYear;
  if (sourceYear && candidateYear && Math.abs(sourceYear - candidateYear) <= 2) {
    score += 0.3;
  }

  const sharedInterestCount = (source.userSignals?.interests ?? []).filter((interest) => {
    const normalized = normalizeText(interest);
    return normalizeText(candidate.title).includes(normalized) || normalizeText(candidate.excerpt).includes(normalized);
  }).length;
  score += sharedInterestCount * 0.4;

  return score;
}

function buildPersonalizationBoost(source: RecommendationSource, candidate: RecommendationSource): number {
  let boost = 0;
  const viewedIds = source.userSignals?.viewedIds ?? [];
  const preferredTypes = source.userSignals?.preferredTypes ?? [];

  if (viewedIds.includes(candidate.id)) {
    boost -= 1.2;
  }

  if (preferredTypes.includes(candidate.type)) {
    boost += 0.8;
  }

  if ((source.keywords ?? []).some((keyword) => (candidate.keywords ?? []).includes(keyword))) {
    boost += 0.5;
  }

  return boost;
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(async (text) => getEmbedding(text || '')));
}

function buildRecommendationReason(source: RecommendationSource, candidate: RecommendationSource, semanticScore: number, metadataScore: number): string {
  if (semanticScore > 0.6) return 'Strong semantic match to the current page context.';
  if (metadataScore > 2.5) return 'Related by topic and content metadata.';
  if (source.type === candidate.type) return 'Related content in the same format or research area.';
  return 'Suggested because it complements this page and your interests.';
}

function buildUrl(type: RecommendationType, slug?: string): string {
  if (type === 'publication') return slug ? `/publications/${slug}` : '/publications';
  if (type === 'insight') return slug ? `/insights/${slug}` : '/insights';
  if (type === 'event') return '/events';
  return slug ? `/news/${slug}` : '/news';
}

export async function getRecommendationsForContent(source: RecommendationSource): Promise<RecommendationItem[]> {
  const [publications, insights, events, news] = await Promise.all([
    getPublications({ limit: 100 }),
    getInsights({ limit: 100 }),
    getEvents({ limit: 100 }),
    getNews({ limit: 100 }),
  ]);

  const candidates: RecommendationSource[] = [
    ...publications.map((item) => ({
      id: `publication:${item.id}`,
      title: item.title,
      type: 'publication' as const,
      slug: item.slug,
      excerpt: item.abstract ?? '',
      keywords: item.keywords ?? [],
      division: item.researchDivision,
      publishedYear: item.publishedYear,
      contentType: item.publicationType,
      content: item.abstract ?? '',
    })),
    ...insights.map((item) => ({
      id: `insight:${item.id}`,
      title: item.title,
      type: 'insight' as const,
      slug: item.slug,
      excerpt: item.socialSummary ?? item.bodyPlaintext ?? item.body ?? '',
      tags: item.tags ?? [],
      publishedDate: item.publishedDate,
      contentType: item.contentType,
      content: item.bodyPlaintext ?? item.body ?? '',
    })),
    ...events.map((item) => ({
      id: `event:${item.id}`,
      title: item.title,
      type: 'event' as const,
      excerpt: item.summary ?? '',
      content: item.summary ?? '',
      publishedDate: item.startDate,
    })),
    ...news.map((item) => ({
      id: `news:${item.id}`,
      title: item.title,
      type: 'news' as const,
      slug: item.slug,
      excerpt: item.summary ?? item.body ?? '',
      content: item.body ?? '',
      publishedDate: item.publishedDate,
    })),
  ];

  const filteredCandidates = candidates.filter((candidate) => candidate.id !== source.id);
  const sourceEmbeddingText = buildTextForEmbedding(source);

  const candidateTexts = filteredCandidates.map(buildTextForEmbedding);
  let candidateEmbeddings: number[][] = [];
  let sourceEmbedding: number[] | undefined;

  try {
    sourceEmbedding = await getEmbedding(sourceEmbeddingText || '');
    candidateEmbeddings = await embedTexts(candidateTexts);
  } catch (error) {
    console.warn('[recommendations] embedding service unavailable or failed, using metadata fallback:', (error as Error).message);
    sourceEmbedding = undefined;
    candidateEmbeddings = [];
  }

  const results = filteredCandidates.map((candidate, index) => {
    const semanticScore = sourceEmbedding && candidateEmbeddings[index]
      ? Math.max(0, cosineSimilarity(sourceEmbedding, candidateEmbeddings[index]))
      : 0;

    const metadataScore = calculateMetadataScore(source, candidate);
    const personalizationBoost = buildPersonalizationBoost(source, candidate);
    const finalScore = semanticScore > 0
      ? semanticScore * 5 + metadataScore * 0.8 + personalizationBoost
      : metadataScore + personalizationBoost * 0.5;

    return {
      candidate,
      semanticScore,
      metadataScore,
      finalScore,
    };
  });

  const scored = results
    .filter(({ finalScore }) => finalScore > 0.8)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 6)
    .map(({ candidate, semanticScore, metadataScore, finalScore }) => ({
      id: candidate.id,
      title: candidate.title,
      type: candidate.type,
      url: buildUrl(candidate.type, candidate.slug),
      excerpt: getExcerpt(candidate.excerpt, candidate.title),
      score: Number(finalScore.toFixed(2)),
      reason: buildRecommendationReason(source, candidate, semanticScore, metadataScore),
    }));

  if (scored.length === 0) {
    return filteredCandidates
      .sort((a, b) => calculateMetadataScore(source, b) - calculateMetadataScore(source, a))
      .slice(0, 4)
      .map((candidate) => ({
        id: candidate.id,
        title: candidate.title,
        type: candidate.type,
        url: buildUrl(candidate.type, candidate.slug),
        excerpt: getExcerpt(candidate.excerpt, candidate.title),
        score: Number(calculateMetadataScore(source, candidate).toFixed(2)),
        reason: 'Fallback recommendations based on available page metadata.',
      }));
  }

  return scored;
}
