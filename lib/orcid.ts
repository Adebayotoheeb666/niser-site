/**
 * ORCID Public API client — auto-sync of researcher profile data.
 *
 * Fetches public record data (affiliations, recent works) for a researcher's
 * ORCID iD from the ORCID Public API v3.0. No authentication required for
 * public records; responses are cached at the Next.js data-cache layer.
 */

const ORCID_API_BASE = "https://pub.orcid.org/v3.0";
const ORCID_ID_PATTERN = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

export interface OrcidWork {
  title: string;
  year?: string;
  doi?: string;
  url?: string;
  type?: string;
}

export interface OrcidProfile {
  orcidId: string;
  affiliation?: { name: string; role?: string };
  recentWorks: OrcidWork[];
  worksCount: number;
}

interface OrcidExternalId {
  'external-id-type'?: string;
  'external-id-value'?: string;
  'external-id-url'?: { value?: string };
}

interface OrcidWorkSummary {
  title?: { title?: { value?: string } };
  'publication-date'?: { year?: { value?: string } };
  'external-ids'?: { 'external-id'?: OrcidExternalId[] };
  type?: string;
  url?: string;
}

interface OrcidWorksGroup {
  'work-summary'?: OrcidWorkSummary[];
}

interface OrcidRecordResponse {
  employments?: {
    'employment-summary'?: Array<{
      organization?: { name?: string };
      'role-title'?: string;
      'end-date'?: { year?: { value?: string } } | null;
    }>;
  };
}

interface OrcidWorksResponse {
  group?: OrcidWorksGroup[];
}

async function orcidFetch<T>(path: string, revalidateSeconds: number): Promise<T | null> {
  try {
    const res = await fetch(`${ORCID_API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function extractDoi(ids?: OrcidExternalId[]): string | undefined {
  const doi = ids?.find((id) => id['external-id-type'] === 'doi');
  return doi?.['external-id-value'] ?? undefined;
}

/**
 * Fetch the public ORCID profile for a researcher.
 * Returns null when the iD is absent/invalid, the record is private,
 * or the API is unreachable — callers must degrade gracefully.
 */
export async function getOrcidProfile(orcidId?: string | null): Promise<OrcidProfile | null> {
  const cleanId = orcidId?.trim();
  if (!cleanId || !ORCID_ID_PATTERN.test(cleanId)) return null;

  const [record, works] = await Promise.all([
    orcidFetch<OrcidRecordResponse>(`/${cleanId}/record`, 86_400),
    orcidFetch<OrcidWorksResponse>(`/${cleanId}/works`, 86_400),
  ]);

  if (!record && !works) return null;

  // Most current employment: first summary without an end-date
  const employment = record?.employments?.['employment-summary']?.find((e) => !e['end-date'])
    ?? record?.employments?.['employment-summary']?.[0];

  // Flatten work summaries, newest first, top 5
  const summaries = (works?.group ?? [])
    .map((g) => g['work-summary']?.[0])
    .filter((w): w is OrcidWorkSummary => Boolean(w))
    .sort((a, b) => Number(b['publication-date']?.year?.value ?? 0) - Number(a['publication-date']?.year?.value ?? 0));

  const recentWorks: OrcidWork[] = summaries.slice(0, 5).map((w) => ({
    title: w.title?.title?.value ?? 'Untitled work',
    year: w['publication-date']?.year?.value,
    doi: extractDoi(w['external-ids']?.['external-id']),
    url: w.url,
    type: w.type,
  }));

  return {
    orcidId: cleanId,
    affiliation: employment?.organization?.name
      ? { name: employment.organization.name, role: employment['role-title'] }
      : undefined,
    recentWorks,
    worksCount: summaries.length,
  };
}
