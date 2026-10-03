import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSourceWeights, fetchWithRetry } from '@/lib/ai/policy-monitor';

test('parseSourceWeights should parse weights from env string', () => {
  process.env.POLICY_MONITOR_SOURCE_WEIGHTS = 'example.com=2,OTHER.org=0.5,invalid'
  const weights = parseSourceWeights();
  assert.deepEqual(weights, { 'example.com': 2, 'other.org': 0.5, invalid: 1 });
});

test('fetchWithRetry should retry until success', async () => {
  let attempts = 0;
  const responses = [
    { ok: false, status: 500, text: async () => 'fail' },
    { ok: false, status: 502, text: async () => 'fail' },
    { ok: true, status: 200, text: async () => 'ok' },
  ];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const res = responses[attempts] ?? responses[responses.length - 1];
    attempts += 1;
    return res as Response;
  };

  const result = await fetchWithRetry('https://example.com', {}, 3, 1);
  assert.equal(result.status, 200);
  const body = await result.text();
  assert.equal(body, 'ok');

  globalThis.fetch = originalFetch;
});
