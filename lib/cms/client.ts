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
  Dataset,
  Job,
  JobParams,
  Internship,
  TrainingProgram,
  TrainingParams,
  AnnualReport,
  Partner,
  PartnerParams,
  ResearchCenter,
  WorkingGroup,
  GovernanceMember,
  GovernanceParams,
  FundingOpportunity,
  FundingParams,
  CaseStudy,
} from "@/types/cms";

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:10003/wp-json/niser/v1";

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function cmsGet<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${CMS_BASE}${path}`;
  const empty = [] as unknown as T;

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
      ...options,
    });
  } catch (err) {
    // Network error (e.g. CMS not running during build) — return safe empty value
    console.warn(
      `[CMS] Network error fetching ${url}:`,
      (err as Error).message,
    );
    return empty;
  }

  if (!res.ok) {
    console.error(`[CMS] ${res.status} ${res.statusText} — ${url}`);
    return empty;
  }

  return res.json() as Promise<T>;
}

// ─── Build query string ───────────────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
  const pairs: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return pairs.length ? `?${pairs.join("&")}` : "";
}

// ─── Publications ─────────────────────────────────────────────────────────────

export async function getPublications(
  params: PublicationParams = {},
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
  slug: string,
): Promise<Publication | null> {
  const result = await cmsGet<Publication | null>(`/publications/${slug}`);
  return result ?? null;
}

// ─── Researchers ─────────────────────────────────────────────────────────────

export async function getResearchers(
  params: ResearcherParams = {},
): Promise<Researcher[]> {
  const query = buildQuery({
    active: params.active,
    division: params.division,
  });
  return cmsGet<Researcher[]>(`/researchers${query}`);
}

export async function getResearcherBySlug(
  slug: string,
): Promise<Researcher | null> {
  const result = await cmsGet<Researcher | null>(`/researchers/${slug}`);
  return result ?? null;
}

// ─── Insights ────────────────────────────────────────────────────────────────

export async function getInsights(
  params: InsightParams = {},
): Promise<Insight[]> {
  const query = buildQuery({
    limit: params.limit ?? 20,
    page: params.page ?? 1,
    contentType: params.contentType,
  });
  return cmsGet<Insight[]>(`/insights${query}`, {
    next: { revalidate: 21600 },
  });
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const result = await cmsGet<Insight | null>(`/insights/${slug}`, {
    next: { revalidate: 21600 },
  });
  return result ?? null;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function getEvents(params: EventParams = {}): Promise<CMSEvent[]> {
  const query = buildQuery({
    upcoming: params.upcoming,
    limit: params.limit ?? 20,
  });
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
  const query = buildQuery({
    limit: params.limit ?? 20,
    category: params.category,
  });
  return cmsGet<NewsItem[]>(`/news${query}`, { next: { revalidate: 7200 } });
}

// ─── Divisions ───────────────────────────────────────────────────────────────

export async function getDivisions(): Promise<Division[]> {
  return cmsGet<Division[]>("/divisions", { next: { revalidate: 86400 } });
}

export async function getDivisionBySlug(
  slug: string,
): Promise<Division | null> {
  const result = await cmsGet<Division | null>(`/divisions/${slug}`, {
    next: { revalidate: 86400 },
  });
  return result ?? null;
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export async function getProcurements(): Promise<ProcurementNotice[]> {
  return cmsGet<ProcurementNotice[]>("/procurement", {
    next: { revalidate: 86400 },
  });
}

// ─── Datasets ───────────────────────────────────────────────────────────────

export async function getDatasets(): Promise<Dataset[]> {
  return cmsGet<Dataset[]>("/datasets", { next: { revalidate: 86400 } });
}

export async function getDatasetById(id: string): Promise<Dataset | null> {
  const result = await cmsGet<Dataset | null>(
    `/datasets/${encodeURIComponent(id)}`,
    {
      next: { revalidate: 86400 },
    },
  );
  return result ?? null;
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export async function getJobs(params: JobParams = {}): Promise<Job[]> {
  const query = buildQuery({
    limit: params.limit ?? 50,
    active: params.active !== undefined ? String(params.active) : undefined,
  });
  return cmsGet<Job[]>(`/jobs${query}`, { next: { revalidate: 3600 } });
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const result = await cmsGet<Job | null>(`/jobs/${slug}`, {
    next: { revalidate: 3600 },
  });
  return result ?? null;
}

// ─── Internships ──────────────────────────────────────────────────────────────

export async function getInternships(
  params: { limit?: number; active?: boolean } = {},
): Promise<Internship[]> {
  const query = buildQuery({
    limit: params.limit ?? 50,
    active: params.active !== undefined ? String(params.active) : undefined,
  });
  return cmsGet<Internship[]>(`/internships${query}`, {
    next: { revalidate: 3600 },
  });
}

// ─── Training ─────────────────────────────────────────────────────────────────

export async function getTrainingPrograms(
  params: TrainingParams = {},
): Promise<TrainingProgram[]> {
  const query = buildQuery({
    limit: params.limit ?? 50,
    status: params.status,
  });
  return cmsGet<TrainingProgram[]>(`/training${query}`, {
    next: { revalidate: 3600 },
  });
}

// ─── Annual Reports ───────────────────────────────────────────────────────────

export async function getAnnualReports(): Promise<AnnualReport[]> {
  return cmsGet<AnnualReport[]>("/annual-reports", {
    next: { revalidate: 86400 },
  });
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export async function getPartners(
  params: PartnerParams = {},
): Promise<Partner[]> {
  const query = buildQuery({ limit: params.limit ?? 100, type: params.type });
  return cmsGet<Partner[]>(`/partners${query}`, {
    next: { revalidate: 86400 },
  });
}

// ─── Research Centers ─────────────────────────────────────────────────────────

export async function getResearchCenters(): Promise<ResearchCenter[]> {
  return cmsGet<ResearchCenter[]>("/research-centers", {
    next: { revalidate: 86400 },
  });
}

// ─── Working Groups ───────────────────────────────────────────────────────────

export async function getWorkingGroups(): Promise<WorkingGroup[]> {
  return cmsGet<WorkingGroup[]>("/working-groups", {
    next: { revalidate: 86400 },
  });
}

// ─── Governance ───────────────────────────────────────────────────────────────

export async function getGovernanceMembers(
  params: GovernanceParams = {},
): Promise<GovernanceMember[]> {
  const query = buildQuery({ role_type: params.roleType });
  return cmsGet<GovernanceMember[]>(`/governance${query}`, {
    next: { revalidate: 86400 },
  });
}

// ─── Funding Opportunities ────────────────────────────────────────────────────

export async function getFundingOpportunities(
  params: FundingParams = {},
): Promise<FundingOpportunity[]> {
  const query = buildQuery({
    limit: params.limit ?? 50,
    active: params.active !== undefined ? String(params.active) : undefined,
  });
  return cmsGet<FundingOpportunity[]>(`/funding${query}`, {
    next: { revalidate: 3600 },
  });
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return cmsGet<CaseStudy[]>("/case-studies", { next: { revalidate: 86400 } });
}
