import type {
  Publication,
  PublicationParams,
  Researcher,
  ResearcherParams,
  Insight,
  InsightParams,
  CMSEvent,
  EventParams,
  NewsItem,
  NewsParams,
  Division,
  ProcurementNotice,
} from '@/types/cms';

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_URL ??
  'http://localhost:10003/wp-json/niser/v1';

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function cmsGet<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${CMS_BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: 'application/json' },
    ...options,
  });

  if (!res.ok) {
    // Return empty-ish fallback rather than throwing to prevent page crashes
    console.error(`[CMS] ${res.status} ${res.statusText} — ${url}`);
    return (Array.isArray([] as unknown) ? [] : {}) as T;
  }

  return res.json() as Promise<T>;
}

// ─── Build query string ───────────────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
  const pairs: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return pairs.length ? `?${pairs.join('&')}` : '';
}

// ─── Publications ─────────────────────────────────────────────────────────────

export async function getPublications(
  params: PublicationParams = {}
): Promise<Publication[]> {
  const query = buildQuery({
    limit: params.limit ?? 20,
    page: params.page ?? 1,
    type: params.type,
    division: params.division,
    year: params.year,
  });
  return cmsGet<Publication[]>(`/publications${query}`);
}

export async function getPublicationBySlug(
  slug: string
): Promise<Publication | null> {
  const result = await cmsGet<Publication | null>(`/publications/${slug}`);
  return result ?? null;
}

// ─── Researchers ─────────────────────────────────────────────────────────────

export async function getResearchers(
  params: ResearcherParams = {}
): Promise<Researcher[]> {
  const query = buildQuery({ active: params.active, division: params.division });
  return cmsGet<Researcher[]>(`/researchers${query}`);
}

export async function getResearcherBySlug(
  slug: string
): Promise<Researcher | null> {
  const result = await cmsGet<Researcher | null>(`/researchers/${slug}`);
  return result ?? null;
}

// ─── Insights ────────────────────────────────────────────────────────────────

export async function getInsights(
  params: InsightParams = {}
): Promise<Insight[]> {
  const query = buildQuery({
    limit: params.limit ?? 20,
    page: params.page ?? 1,
    contentType: params.contentType,
  });
  return cmsGet<Insight[]>(`/insights${query}`, { next: { revalidate: 21600 } });
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const result = await cmsGet<Insight | null>(`/insights/${slug}`, {
    next: { revalidate: 21600 },
  });
  return result ?? null;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(params: EventParams = {}): Promise<CMSEvent[]> {
  const query = buildQuery({ upcoming: params.upcoming, limit: params.limit ?? 20 });
  return cmsGet<CMSEvent[]>(`/events${query}`, { next: { revalidate: 3600 } });
}

export async function getEventBySlug(slug: string): Promise<CMSEvent | null> {
  const result = await cmsGet<CMSEvent | null>(`/events/${slug}`, {
    next: { revalidate: 3600 },
  });
  return result ?? null;
}

// ─── News ────────────────────────────────────────────────────────────────────

export async function getNews(params: NewsParams = {}): Promise<NewsItem[]> {
  const query = buildQuery({ limit: params.limit ?? 20, category: params.category });
  return cmsGet<NewsItem[]>(`/news${query}`, { next: { revalidate: 7200 } });
}

// ─── Divisions ───────────────────────────────────────────────────────────────

export async function getDivisions(): Promise<Division[]> {
  return cmsGet<Division[]>('/divisions', { next: { revalidate: 86400 } });
}

export async function getDivisionBySlug(slug: string): Promise<Division | null> {
  const result = await cmsGet<Division | null>(`/divisions/${slug}`, {
    next: { revalidate: 86400 },
  });
  return result ?? null;
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export async function getProcurements(): Promise<ProcurementNotice[]> {
  return cmsGet<ProcurementNotice[]>('/procurement', {
    next: { revalidate: 86400 },
  });
}
