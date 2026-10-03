const WEB_SEARCH_API_KEY = process.env.WEB_SEARCH_API_KEY;
const WEB_SEARCH_MAX_RESULTS = Math.min(Math.max(Number(process.env.WEB_SEARCH_MAX_RESULTS ?? 5), 1), 10);

export interface WebSource {
  title: string;
  url: string;
  excerpt: string;
  score?: number;
}

export function isWebSearchEnabled(): boolean {
  return Boolean(WEB_SEARCH_API_KEY);
}

function compact(value: string, maxLength: number): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

interface TavilyResult {
  title?: unknown;
  url?: unknown;
  content?: unknown;
  score?: unknown;
}

interface TavilyResponse {
  results?: TavilyResult[];
  error?: unknown;
}

/**
 * External web search used only as a tiered fallback when the NISER repository
 * has no relevant results. Powered by the Tavily search API.
 */
export async function searchWeb(query: string, limit = WEB_SEARCH_MAX_RESULTS): Promise<WebSource[]> {
  if (!WEB_SEARCH_API_KEY) {
    throw new Error('WEB_SEARCH_API_KEY is not configured. Set it in .env.local');
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: WEB_SEARCH_API_KEY,
      query: compact(query, 500),
      max_results: limit,
      search_depth: 'basic',
      include_answer: false,
      topic: 'general',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tavily web search failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as TavilyResponse;
  if (data.error) {
    throw new Error(`Tavily web search error: ${String(data.error)}`);
  }

  return (data.results ?? [])
    .filter((result) => typeof result.title === 'string' && typeof result.url === 'string' && typeof result.content === 'string')
    .map((result) => ({
      title: compact(result.title as string, 240),
      url: result.url as string,
      excerpt: compact(result.content as string, 1_200),
      score: typeof result.score === 'number' ? result.score : undefined,
    }));
}
