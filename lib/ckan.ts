/**
 * CKAN 2.10 open-data portal client.
 *
 * When CKAN_API_URL is configured (self-hosted portal, e.g. data.niser.gov.ng),
 * dataset listings and details are served from CKAN's Action API. All functions
 * degrade gracefully — returning empty results so callers can fall back to CMS
 * datasets without user-visible errors.
 */

const DEFAULT_TIMEOUT_MS = 8_000;

export interface CkanConfig {
  baseUrl: string;
  apiKey?: string;
}

export function getCkanConfig(): CkanConfig | null {
  const raw = process.env.CKAN_API_URL?.trim();
  if (!raw) return null;
  return {
    baseUrl: raw.replace(/\/$/, ''),
    apiKey: process.env.CKAN_API_KEY?.trim() || undefined,
  };
}

export function isCkanConfigured(): boolean {
  return getCkanConfig() !== null;
}

async function ckanAction<T>(action: string, params?: Record<string, string>): Promise<T | null> {
  const config = getCkanConfig();
  if (!config) return null;

  try {
    const url = new URL(`${config.baseUrl}/api/3/action/${action}`);
    for (const [key, value] of Object.entries(params ?? {})) {
      url.searchParams.set(key, value);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        ...(config.apiKey ? { Authorization: config.apiKey } : {}),
      },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      next: { revalidate: action === 'package_show' ? 3_600 : 86_400 },
    });

    if (!res.ok) return null;
    const body = (await res.json()) as { success?: boolean; result?: T };
    if (!body.success || body.result === undefined || body.result === null) return null;
    return body.result;
  } catch {
    return null;
  }
}

// ─── CKAN → NISER Dataset mapping ─────────────────────────────────────────────

type DatasetFormat = 'CSV' | 'JSON' | 'PDF' | 'XLSX';

function coerceFormat(raw?: string): DatasetFormat {
  const value = (raw ?? '').toLowerCase();
  if (value.includes('json')) return 'JSON';
  if (value.includes('pdf')) return 'PDF';
  if (value.includes('xls') || value.includes('excel')) return 'XLSX';
  return 'CSV';
}

interface CkanResource {
  id?: string;
  name?: string;
  format?: string;
  url?: string;
  size?: number;
  description?: string;
}

interface CkanPackage {
  id?: string;
  name?: string;
  title?: string;
  notes?: string;
  author?: string | { name?: string };
  maintainer?: string | { name?: string };
  tags?: Array<{ name?: string; display_name?: string }>;
  resources?: CkanResource[];
  organization?: { id?: string; name?: string; title?: string; description?: string };
  metadata_created?: string;
  metadata_modified?: string;
  license_title?: string;
  num_resources?: number;
}

function formatBytes(bytes?: number): string | undefined {
  if (!bytes || bytes <= 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function personName(value: CkanPackage['author'] | CkanPackage['maintainer']): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.name;
}

export interface CkanDatasetSummary {
  id: string;
  title: string;
  notes: string;
  formatCount: number;
  metadataModified: string;
  tags: string[];
}

export interface NormalizedResource {
  id: string;
  name: string;
  format: DatasetFormat;
  url: string;
  size?: string;
  description?: string;
}

/**
 * Map a raw CKAN package to the NISER Dataset shape used by the /data
 * pages (camelCase metadata, coerced resource formats, byte sizes humanised).
 */
export function mapCkanPackageToDataset(pkg: CkanPackage): {
  id: string;
  title: string;
  notes: string;
  author: string;
  tags: string[];
  resources: NormalizedResource[];
  organization: { name: string; title: string; description?: string };
  metadataCreated: string;
  metadataModified: string;
  maintainer?: string;
  licenseTitle?: string;
} | null {
  const id = pkg.name ?? pkg.id;
  const title = pkg.title ?? pkg.name ?? pkg.id;
  if (!id || !title) return null;

  const resources: NormalizedResource[] = (pkg.resources ?? [])
    .filter((resource) => resource.url)
    .map((resource) => ({
      id: resource.id ?? resource.url ?? '',
      name: resource.name ?? 'Dataset resource',
      format: coerceFormat(resource.format),
      url: resource.url ?? '',
      size: formatBytes(resource.size),
      description: resource.description,
    }));

  return {
    id,
    title,
    notes: (pkg.notes ?? '').replace(/<[^>]*>/g, ''),
    author: personName(pkg.author) ?? 'NISER',
    tags: (pkg.tags ?? []).map((tag) => tag.display_name ?? tag.name ?? '').filter(Boolean),
    resources,
    organization: {
      name: pkg.organization?.name ?? 'niser',
      title: pkg.organization?.title ?? 'NISER',
      description: pkg.organization?.description,
    },
    metadataCreated: pkg.metadata_created ?? '',
    metadataModified: pkg.metadata_modified ?? '',
    maintainer: personName(pkg.maintainer),
    licenseTitle: pkg.license_title,
  };
}

/**
 * List datasets from the CKAN portal (newest-modified first).
 * Returns [] when CKAN is not configured or unreachable.
 */
export async function getCkanDatasets(limit = 100): Promise<CkanDatasetSummary[]> {
  const names = await ckanAction<string[]>('package_list', { limit: String(Math.max(limit, 50)) });
  if (!names || !Array.isArray(names)) return [];

  // package_list returns only names — hydrate core fields via package_search
  const search = await ckanAction<{ results?: CkanPackage[] }>('package_search', {
    rows: String(limit),
  });

  if (search?.results && Array.isArray(search.results)) {
    return search.results
      .filter((pkg) => pkg.name || pkg.id)
      .slice(0, limit)
      .map((pkg) => ({
        id: pkg.name ?? pkg.id ?? '',
        title: pkg.title ?? pkg.name ?? pkg.id ?? '',
        notes: (pkg.notes ?? '').replace(/<[^>]*>/g, '').slice(0, 300),
        formatCount: pkg.num_resources ?? pkg.resources?.length ?? 0,
        metadataModified: pkg.metadata_modified ?? '',
        tags: (pkg.tags ?? []).map((t) => t.display_name ?? t.name ?? '').filter(Boolean),
      }));
  }

  // Fallback when search is unavailable but the list works
  return names.slice(0, limit).map((name) => ({
    id: name,
    title: name,
    notes: '',
    formatCount: 0,
    metadataModified: '',
    tags: [],
  }));
}

/** Fetch a single dataset with full resources from CKAN. Returns null on any failure. */
export async function getCkanDataset(id: string): Promise<CkanPackage | null> {
  if (!id || /[^\w.\-@]/.test(id)) return null; // iD sanity check (SSRF/injection guard)
  return ckanAction<CkanPackage>('package_show', { id });
}
