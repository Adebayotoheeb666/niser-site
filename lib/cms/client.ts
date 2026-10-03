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
  DatasetResource,
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

const DEFAULT_CMS_BASE = "http://localhost:10003/wp-json/niser/v1";
const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL ?? DEFAULT_CMS_BASE;

interface ResearcherContactTemplate {
  email?: string;
  phone?: string;
}

let researcherContactTemplatePromise: Promise<ResearcherContactTemplate | null> | null = null;

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function cmsGet<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${CMS_BASE}${path}`;
  const empty = [] as unknown as T;

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
    headers: { Accept: "application/json" },
    ...options,
  };

  if (options?.cache === "no-store") {
    fetchOptions.cache = "no-store";
    delete fetchOptions.next;
  } else if (!fetchOptions.next) {
    fetchOptions.next = { revalidate: 3600 };
  }

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    console.warn(
      `[CMS] Network error fetching ${url}:`,
      (err as Error).message,
    );

    if (process.env.NODE_ENV !== "production" && CMS_BASE !== DEFAULT_CMS_BASE) {
      const fallbackUrl = `${DEFAULT_CMS_BASE}${path}`;
      try {
        res = await fetch(fallbackUrl, fetchOptions);
      } catch (fallbackErr) {
        console.warn(
          `[CMS] Fallback network error fetching ${fallbackUrl}:`,
          (fallbackErr as Error).message,
        );
        return empty;
      }
    } else {
      return empty;
    }
  }

  if (!res.ok) {
    console.error(`[CMS] ${res.status} ${res.statusText} — ${res.url}`);
    return empty;
  }

  try {
    return await res.json() as T;
  } catch (err) {
    console.warn(`[CMS] Failed to parse JSON from ${res.url}:`, (err as Error).message);
    return empty;
  }
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

function toNullableRecord<T>(result: T | T[] | null): T | null {
  return Array.isArray(result) ? null : result ?? null;
}

function getFirstString(value: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return undefined;
}

function normalizeResearcherContactTemplate(value: unknown): ResearcherContactTemplate | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const nested = record.researcherContactTemplate ??
    record.researcher_contact_template ??
    record.defaultResearcherContact ??
    record.default_researcher_contact ??
    record.contactTemplate ??
    record.contact_template;

  if (nested && typeof nested === "object") {
    const nestedRecord = nested as Record<string, unknown>;
    const email = getFirstString(nestedRecord, ["email", "contactEmail", "defaultEmail", "researcherEmail"]);
    const phone = getFirstString(nestedRecord, ["phone", "contactPhone", "defaultPhone", "researcherPhone"]);
    if (email || phone) {
      return { email, phone };
    }
  }

  const email = getFirstString(record, ["email", "contactEmail", "defaultEmail", "researcherEmail"]);
  const phone = getFirstString(record, ["phone", "contactPhone", "defaultPhone", "researcherPhone"]);
  if (email || phone) {
    return { email, phone };
  }

  return null;
}

async function getResearcherContactTemplate(): Promise<ResearcherContactTemplate | null> {
  if (researcherContactTemplatePromise) {
    return researcherContactTemplatePromise;
  }

  researcherContactTemplatePromise = (async () => {
    const candidatePaths = [
      "/site-settings",
      "/settings",
      "/researcher-contact-template",
      "/contact-template",
    ];

    for (const path of candidatePaths) {
      const payload = await cmsGet<unknown>(path, { next: { revalidate: 3600 } });
      const template = normalizeResearcherContactTemplate(payload);
      if (template?.email || template?.phone) {
        return template;
      }
    }

    return {
      email: process.env.NEXT_PUBLIC_RESEARCHER_CONTACT_TEMPLATE_EMAIL || process.env.RESEARCHER_CONTACT_TEMPLATE_EMAIL || undefined,
      phone: process.env.NEXT_PUBLIC_RESEARCHER_CONTACT_TEMPLATE_PHONE || process.env.RESEARCHER_CONTACT_TEMPLATE_PHONE || undefined,
    };
  })();

  return researcherContactTemplatePromise;
}

function applyResearcherContactTemplate(researcher: Researcher, template: ResearcherContactTemplate | null): Researcher {
  const email = typeof researcher.email === "string" && researcher.email.trim()
    ? researcher.email.trim()
    : template?.email?.trim() || undefined;
  const phone = typeof researcher.phone === "string" && researcher.phone.trim()
    ? researcher.phone.trim()
    : template?.phone?.trim() || undefined;

  return {
    ...researcher,
    email,
    phone,
  };
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
  return toNullableRecord(result);
}

// ─── Researchers ─────────────────────────────────────────────────────────────

export async function getResearchers(
  params: ResearcherParams = {},
): Promise<Researcher[]> {
  const query = buildQuery({
    active: params.active,
    division: params.division,
  });
  const [researchers, template] = await Promise.all([
    cmsGet<Researcher[]>(`/researchers${query}`, { next: { revalidate: 3600 } }),
    getResearcherContactTemplate(),
  ]);

  return researchers.map((researcher) => applyResearcherContactTemplate(researcher, template));
}

export async function getResearcherBySlug(
  slug: string,
): Promise<Researcher | null> {
  const [result, template] = await Promise.all([
    cmsGet<Researcher | null>(`/researchers/${slug}`, {
      next: { revalidate: 3600 },
    }),
    getResearcherContactTemplate(),
  ]);

  const researcher = toNullableRecord(result);
  return researcher ? applyResearcherContactTemplate(researcher, template) : null;
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
    next: { revalidate: 3600 },
  });
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const result = await cmsGet<Insight | null>(`/insights/${slug}`, {
    next: { revalidate: 3600 },
  });
  return toNullableRecord(result);
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
  return toNullableRecord(result);
}

// ─── News ────────────────────────────────────────────────────────────────────

export async function getNews(params: NewsParams = {}): Promise<NewsItem[]> {
  const query = buildQuery({
    limit: params.limit ?? 20,
    category: params.category,
  });
  return cmsGet<NewsItem[]>(`/news${query}`, { next: { revalidate: 7200 } });
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const result = await cmsGet<NewsItem | null>(`/news/${slug}`, {
    next: { revalidate: 7200 },
  });
  return toNullableRecord(result);
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
  return toNullableRecord(result);
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export async function getProcurements(): Promise<ProcurementNotice[]> {
  return cmsGet<ProcurementNotice[]>("/procurement", {
    next: { revalidate: 86400 },
  });
}

// ─── Datasets ───────────────────────────────────────────────────────────────

function parseDatasetFormat(format: unknown): DatasetResource['format'] {
  if (typeof format !== 'string') return 'CSV';
  const normalized = format.toLowerCase();
  if (normalized.includes('csv')) return 'CSV';
  if (normalized.includes('json')) return 'JSON';
  if (normalized.includes('pdf')) return 'PDF';
  if (normalized.includes('xls')) return 'XLSX';
  return 'CSV';
}

function normalizeDatasetResource(raw: unknown): DatasetResource | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const url = getFirstString(record, ['url', 'downloadUrl']);
  if (!url) return null;
  const name = getFirstString(record, ['name', 'title', 'label']) ?? 'Dataset resource';
  const format = parseDatasetFormat(getFirstString(record, ['format']) ?? '');
  const size = getFirstString(record, ['size', 'fileSize']);
  const description = getFirstString(record, ['description', 'notes']);

  return {
    id: getFirstString(record, ['id', 'resourceId', 'name']) ?? url,
    name,
    format,
    url,
    size,
    description: description ?? undefined,
  };
}

function normalizeDataset(raw: unknown): Dataset | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const id = getFirstString(record, ['id', 'datasetId', 'slug']);
  const title = getFirstString(record, ['title', 'name']);
  if (!id || !title) return null;

  const notes = getFirstString(record, ['notes', 'description']) ?? '';
  const author = getFirstString(record, ['author', 'dataSource']) ?? 'NISER';
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  const resources: DatasetResource[] = [];
  if (Array.isArray(record.resources)) {
    for (const item of record.resources) {
      const normalized = normalizeDatasetResource(item);
      if (normalized) resources.push(normalized);
    }
  }

  const downloadUrl = getFirstString(record, ['downloadUrl', 'url']);
  if (!resources.length && downloadUrl) {
    resources.push({
      id: downloadUrl,
      name: 'Dataset download',
      format: parseDatasetFormat(getFirstString(record, ['format']) ?? ''),
      url: downloadUrl,
      size: getFirstString(record, ['size']),
      description: getFirstString(record, ['description', 'notes']) ?? undefined,
    });
  }

  const orgName = getFirstString(record, ['category', 'organization', 'dataSource']) ?? 'NISER';
  const orgRecord =
    record.organization && typeof record.organization === 'object'
      ? (record.organization as Record<string, unknown>)
      : undefined;

  const metadataCreated =
    getFirstString(record, ['metadataCreated', 'createdAt', 'createdOn', 'lastUpdated']) ?? '';
  const metadataModified =
    getFirstString(record, ['metadataModified', 'updatedAt', 'lastUpdated']) ?? metadataCreated;

  return {
    id,
    title,
    notes,
    author,
    tags,
    resources,
    organization: {
      name: getFirstString(orgRecord ?? {}, ['name', 'title']) ?? orgName,
      title: getFirstString(orgRecord ?? {}, ['title', 'name']) ?? orgName,
      description: getFirstString(orgRecord ?? {}, ['description']) ?? undefined,
    },
    metadataCreated,
    metadataModified,
    maintainer: getFirstString(record, ['maintainer', 'maintainerName']) ?? undefined,
    licenseTitle: getFirstString(record, ['license', 'licenseTitle']) ?? undefined,
    rowsCount:
      typeof record.recordsCount === 'number'
        ? record.recordsCount
        : typeof record.recordsCount === 'string'
        ? Number(record.recordsCount) || undefined
        : undefined,
    previewData: Array.isArray(record.previewData)
      ? record.previewData.filter(
          (item): item is Record<string, string | number> =>
            typeof item === 'object' && item !== null,
        )
      : undefined,
  };
}

export async function getDatasets(): Promise<Dataset[]> {
  const raw = await cmsGet<unknown[]>("/datasets", { next: { revalidate: 86400 } });
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeDataset).filter((dataset): dataset is Dataset => dataset !== null);
}

export async function getDatasetById(id: string): Promise<Dataset | null> {
  const result = await cmsGet<unknown>(`/datasets/${encodeURIComponent(id)}`, {
    next: { revalidate: 86400 },
  });
  return normalizeDataset(result);
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
  return toNullableRecord(result);
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
