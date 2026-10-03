const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX ?? 'niser_content';
// Large single-request bulk payloads can be dropped by proxies/MTU-limited networks,
// so documents are sent in modest batches.
const ELASTICSEARCH_BULK_BATCH_SIZE = Math.max(1, Number(process.env.ELASTICSEARCH_BULK_BATCH_SIZE ?? 100));

export interface ElasticsearchDocument {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  sourceType: string;
  division?: string;
  publishedYear?: number;
  text: string;
}

export function isElasticsearchEnabled(): boolean {
  return Boolean(ELASTICSEARCH_URL);
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (ELASTICSEARCH_API_KEY) {
    headers.Authorization = `ApiKey ${ELASTICSEARCH_API_KEY}`;
  }

  return headers;
}

async function ensureIndexExists(): Promise<void> {
  if (!ELASTICSEARCH_URL) {
    throw new Error('ELASTICSEARCH_URL is not configured. Set it in .env.local');
  }

  const indexUrl = `${ELASTICSEARCH_URL.replace(/\/$/, '')}/${encodeURIComponent(ELASTICSEARCH_INDEX)}`;
  const headResponse = await fetch(indexUrl, {
    method: 'HEAD',
    headers: getHeaders(),
  });

  if (headResponse.status === 404) {
    const response = await fetch(indexUrl, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        mappings: {
          properties: {
            title: { type: 'text' },
            excerpt: { type: 'text' },
            text: { type: 'text' },
            url: { type: 'keyword' },
            sourceType: { type: 'keyword' },
            division: { type: 'keyword' },
            publishedYear: { type: 'integer' },
          },
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create Elasticsearch index: ${response.status} ${body}`);
    }
  } else if (!headResponse.ok && headResponse.status !== 200) {
    const body = await headResponse.text();
    throw new Error(`Elasticsearch index health check failed: ${headResponse.status} ${body}`);
  }
}

export async function bulkIndexDocuments(documents: ElasticsearchDocument[]): Promise<void> {
  if (!ELASTICSEARCH_URL) {
    throw new Error('ELASTICSEARCH_URL is not configured. Set it in .env.local');
  }

  await ensureIndexExists();

  for (let offset = 0; offset < documents.length; offset += ELASTICSEARCH_BULK_BATCH_SIZE) {
    const batch = documents.slice(offset, offset + ELASTICSEARCH_BULK_BATCH_SIZE);
    const bulkLines: string[] = [];
    for (const document of batch) {
      bulkLines.push(JSON.stringify({ index: { _index: ELASTICSEARCH_INDEX, _id: document.id } }));
      bulkLines.push(JSON.stringify(document));
    }

    const response = await fetch(`${ELASTICSEARCH_URL.replace(/\/$/, '')}/_bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: bulkLines.join('\n') + '\n',
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Elasticsearch bulk indexing failed: ${response.status} ${body}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(`Elasticsearch bulk indexing returned errors: ${JSON.stringify(data.items)}`);
    }
  }
}

export interface ElasticsearchSearchResult {
  id: string;
  score: number;
  sourceType: string;
  title: string;
  excerpt: string;
  url: string;
  division?: string;
  publishedYear?: number;
}

export async function searchDocuments(
  query: string,
  page = 1,
  limit = 10,
  type: string | 'all' = 'all',
  division: string | 'all' = 'all',
  year: string | 'all' = 'all',
): Promise<{ results: ElasticsearchSearchResult[]; total: number }> {
  if (!ELASTICSEARCH_URL) {
    throw new Error('ELASTICSEARCH_URL is not configured. Set it in .env.local');
  }

  type QueryClause = Record<string, unknown>;
  const must: QueryClause[] = [];
  const filter: QueryClause[] = [];

  if (query) {
    must.push({
      multi_match: {
        query,
        type: 'best_fields',
        fields: ['title^3', 'excerpt^2', 'text'],
        operator: 'or',
        fuzziness: 'AUTO',
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (type !== 'all') {
    filter.push({ term: { sourceType: type } });
  }

  if (division !== 'all') {
    filter.push({ term: { division } });
  }

  if (year !== 'all') {
    const yearInt = parseInt(year, 10);
    if (!Number.isNaN(yearInt)) {
      filter.push({ term: { publishedYear: yearInt } });
    }
  }

  const body = {
    query: {
      bool: {
        must,
        filter,
      },
    },
    from: (page - 1) * limit,
    size: limit,
  };

  const response = await fetch(`${ELASTICSEARCH_URL.replace(/\/$/, '')}/${encodeURIComponent(ELASTICSEARCH_INDEX)}/_search`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Elasticsearch search failed: ${response.status} ${text}`);
  }

  interface ElasticsearchHit {
    _id: string;
    _score?: number;
    _source: {
      sourceType: string;
      title: string;
      excerpt: string;
      url: string;
      division?: string;
      publishedYear?: number;
    };
  }

  interface ElasticsearchSearchResponse {
    hits?: {
      total?: { value: number };
      hits: ElasticsearchHit[];
    };
  }

  const data = (await response.json()) as ElasticsearchSearchResponse;
  const hits = data.hits?.hits ?? [];
  return {
    total: data.hits?.total?.value ?? 0,
    results: hits.map((hit) => ({
      id: hit._id,
      score: hit._score ?? 0,
      sourceType: hit._source.sourceType,
      title: hit._source.title,
      excerpt: hit._source.excerpt,
      url: hit._source.url,
      division: hit._source.division,
      publishedYear: hit._source.publishedYear,
    })),
  };
}
