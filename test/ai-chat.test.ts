import test from 'node:test';
import assert from 'node:assert/strict';
import { isNiserSpecificQuestion, prepareChatResponse, cmsSourceIsRelevant, niserSourceIsConfident } from '@/lib/ai/chat';
import type { WebSource } from '@/lib/ai/websearch';

// ─── NISER-specific question detection ───────────────────────────────────────

test('isNiserSpecificQuestion flags questions about NISER content', () => {
  const examples = [
    'What has NISER published on trade?',
    'Tell me about the institute research divisions.',
    'List NISER working papers on poverty.',
    'Who are the researchers at the institute?',
    'Has NISER published any policy brief on subsidies?',
    'What are the profiles of NISER staff?',
  ];
  for (const message of examples) {
    assert.equal(isNiserSpecificQuestion(message), true, `expected true for: ${message}`);
  }
});

test('isNiserSpecificQuestion treats general questions as non-NISER', () => {
  const examples = [
    'What is GDP?',
    'How does inflation affect the economy?',
    'Define monetary policy.',
    'Who is the current Central Bank governor of Nigeria?',
    'What is the difference between micro and macro economics?',
  ];
  for (const message of examples) {
    assert.equal(isNiserSpecificQuestion(message), false, `expected false for: ${message}`);
  }
});

// ─── CMS keyword fallback relevance ──────────────────────────────────────────

test('cmsSourceIsRelevant rejects sources matching only generic terms', () => {
  const terms = ['president', 'nigeria'];
  assert.equal(
    cmsSourceIsRelevant('Assessment of Social Safety Net Programs in Southwest Nigeria', terms),
    false,
    'matching "nigeria" alone must not qualify a source',
  );
  assert.equal(
    cmsSourceIsRelevant('Nigeria Economic Outlook 2026: Navigating Fiscal Transition', terms),
    false,
  );
  assert.equal(
    cmsSourceIsRelevant('The Nigerian President: Continuity and Change', terms),
    true,
    'matching a specific term ("president") should qualify the source',
  );
});

test('cmsSourceIsRelevant requires at least two terms when none are specific', () => {
  const terms = ['nigerian', 'economy'];
  assert.equal(
    cmsSourceIsRelevant('Nigerian Economy Under Review', terms),
    true,
    'two generic terms together qualify a source',
  );
  assert.equal(
    cmsSourceIsRelevant('Agricultural Production and Export in Nigeria', terms),
    false,
    'a single generic term must not qualify a source',
  );
});

// ─── Vector/retrieval confidence gate for general questions ──────────────────

test('niserSourceIsConfident accepts strong semantic matches without term overlap', () => {
  assert.equal(
    niserSourceIsConfident({ title: 'GDP in Nigeria', url: '/x', excerpt: 'gross domestic product', score: 0.72, origin: 'niser' as const }, 'What is GDP?'),
    true,
    'a high vector similarity alone should qualify',
  );
});

test('niserSourceIsConfident accepts weak matches only when terms overlap', () => {
  const weak = { title: 'Agricultural Production in Nigeria', url: '/x', excerpt: 'farming output', score: 0.45, origin: 'niser' as const };
  assert.equal(
    niserSourceIsConfident(weak, 'Who is the president of Nigeria?'),
    false,
    'weak similarity with only generic-term overlap must not qualify',
  );
  const topical = { title: 'The Nigerian President and Fiscal Policy', url: '/x', excerpt: 'presidential budget', score: 0.45, origin: 'niser' as const };
  assert.equal(
    niserSourceIsConfident(topical, 'Who is the president of Nigeria?'),
    true,
    'weak similarity plus a specific-term match should qualify',
  );
});

// ─── Tiered fallback selection ───────────────────────────────────────────────

const webSource: WebSource = {
  title: 'External article',
  url: 'https://example.com/article',
  excerpt: 'External content about the topic.',
  score: 0.9,
};

/** Force CMS retrieval to return nothing so tier selection is deterministic. */
async function withNoNiserSources<T>(fn: () => Promise<T>): Promise<T> {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => Promise.reject(new Error('stubbed network for tests'))) as typeof fetch;
  try {
    return await fn();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('prepareChatResponse falls back to external web search for general questions', async () => {
  const preparation = await withNoNiserSources(() =>
    prepareChatResponse('What is GDP?', {
      webSearch: async (query) => {
        assert.match(query, /gdp/i);
        return [webSource];
      },
    }),
  );
  assert.equal(preparation.mode, 'web');
  assert.equal(preparation.sources.length, 1);
  assert.equal(preparation.sources[0].origin, 'web');
  assert.ok(preparation.prompt && /EXTERNAL web search/i.test(preparation.prompt));
});

test('prepareChatResponse uses general knowledge when web search returns nothing', async () => {
  const preparation = await withNoNiserSources(() =>
    prepareChatResponse('Define monetary policy.', {
      webSearch: async () => [],
    }),
  );
  assert.equal(preparation.mode, 'general');
  assert.equal(preparation.sources.length, 0);
  assert.ok(preparation.prompt);
});

test('prepareChatResponse never uses external sources for NISER-specific questions', async () => {
  let called = false;
  const preparation = await withNoNiserSources(() =>
    prepareChatResponse('What has NISER published on subsidies?', {
      webSearch: async () => {
        called = true;
        return [webSource];
      },
    }),
  );
  assert.equal(called, false, 'web search must not run for NISER-specific questions');
  assert.equal(preparation.mode, 'none');
  assert.ok(preparation.fallback);
});
