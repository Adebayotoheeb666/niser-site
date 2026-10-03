import test from 'node:test';
import assert from 'node:assert/strict';
import { createInMemoryStore } from '@/lib/ai/memory';
import { extractMemory } from '@/lib/ai/facts';
import { reciprocalRankFusion, rerankByQuery, rewriteSearchQuery } from '@/lib/ai/chat';

// ─── Memory store ────────────────────────────────────────────────────────────

test('memory store persists and clears conversation messages', async () => {
  const store = createInMemoryStore();
  const sessionId = 'session-1';
  assert.deepEqual(await store.getMessages(sessionId), []);

  await store.appendMessages(sessionId, [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'hi' },
  ]);
  assert.deepEqual(await store.getMessages(sessionId), [
    { role: 'user', content: 'hello' },
    { role: 'assistant', content: 'hi' },
  ]);

  await store.appendMessages(sessionId, [{ role: 'user', content: 'second' }]);
  assert.equal((await store.getMessages(sessionId)).length, 3);

  await store.replaceMessages(sessionId, [{ role: 'user', content: 'reset' }]);
  assert.deepEqual(await store.getMessages(sessionId), [{ role: 'user', content: 'reset' }]);

  await store.clearMessages(sessionId);
  assert.deepEqual(await store.getMessages(sessionId), []);
});

test('memory store keeps sessions isolated', async () => {
  const store = createInMemoryStore();
  await store.appendMessages('session-a', [{ role: 'user', content: 'x' }]);
  assert.deepEqual(await store.getMessages('session-b'), []);
  assert.equal((await store.getMessages('session-a')).length, 1);
});

test('memory store persists conversation summaries', async () => {
  const store = createInMemoryStore();
  assert.equal(await store.getSummary('session-1'), null);
  await store.setSummary('session-1', 'discussed poverty research');
  assert.equal(await store.getSummary('session-1'), 'discussed poverty research');
  await store.clearMessages('session-1');
  assert.equal(await store.getSummary('session-1'), null);
});

test('visitor profile stores facts and interests with latest-wins + dedupe', async () => {
  const store = createInMemoryStore();
  const profile = await store.getProfile('visitor-1');
  assert.deepEqual(profile.facts, []);
  assert.deepEqual(profile.interests, []);

  await store.saveFact('visitor-1', 'name', 'Ada');
  await store.saveFact('visitor-1', 'role', 'researcher');
  await store.saveFact('visitor-1', 'name', 'Ada Obi');
  await store.addInterests('visitor-1', ['agriculture', 'poverty']);
  await store.addInterests('visitor-1', ['agriculture']);

  const updated = await store.getProfile('visitor-1');
  assert.equal(updated.facts.length, 2);
  assert.equal(updated.facts.find((fact) => fact.key === 'name')?.value, 'Ada Obi');
  assert.deepEqual(updated.interests, ['agriculture', 'poverty']);
});

test('fingerprint links resolve to a visitor', async () => {
  const store = createInMemoryStore();
  assert.equal(await store.getVisitorByFingerprint('fp-1'), null);
  await store.linkFingerprint('fp-1', 'visitor-1');
  assert.equal(await store.getVisitorByFingerprint('fp-1'), 'visitor-1');
});

// ─── Fact extraction ─────────────────────────────────────────────────────────

test('extractMemory extracts facts and interests from a message', () => {
  const message =
    'My name is Ada Obi and I am a researcher interested in agriculture and poverty. I am based in Ibadan.';
  const { facts, interests } = extractMemory(message);
  assert.ok(facts.some((fact) => fact.key === 'name' && fact.value === 'Ada Obi'));
  assert.ok(facts.some((fact) => fact.key === 'role' && fact.value === 'researcher'));
  assert.ok(facts.some((fact) => fact.key === 'location' && fact.value === 'Ibadan'));
  assert.ok(interests.includes('agriculture'));
  assert.ok(interests.includes('poverty'));
});

test('extractMemory ignores messages without extractable facts', () => {
  const { facts, interests } = extractMemory('What has NISER published on trade?');
  assert.equal(facts.length, 0);
  assert.ok(interests.includes('trade'));
});

// ─── RAG fusion & reranking ──────────────────────────────────────────────────

test('reciprocalRankFusion combines ranked lists, favouring cross-list hits', () => {
  const listA = [
    { title: 'A', url: '/a', excerpt: 'x', score: 0.9, origin: 'niser' as const },
    { title: 'B', url: '/b', excerpt: 'y', score: 0.5, origin: 'niser' as const },
  ];
  const listB = [
    { title: 'B', url: '/b', excerpt: 'y', score: 0.4, origin: 'niser' as const },
    { title: 'C', url: '/c', excerpt: 'z', score: 0.3, origin: 'niser' as const },
  ];
  const fused = reciprocalRankFusion([listA, listB]);
  assert.equal(fused.length, 3);
  assert.equal(fused[0].url, '/b');
});

test('rerankByQuery boosts sources that match query terms', () => {
  const sources = [
    { title: 'Unrelated topic', url: '/x', excerpt: 'nothing relevant here', origin: 'niser' as const },
    { title: 'Poverty reduction policies', url: '/p', excerpt: 'poverty reduction in Nigeria', origin: 'niser' as const },
  ];
  const ranked = rerankByQuery(sources, 'poverty reduction policies in nigeria');
  assert.equal(ranked[0].url, '/p');
});

// ─── Query rewriting ─────────────────────────────────────────────────────────

test('rewriteSearchQuery leaves a standalone first question untouched', async () => {
  const { query, rewritten } = await rewriteSearchQuery('What does NISER do?', []);
  assert.equal(query, 'What does NISER do?');
  assert.equal(rewritten, false);
});

test('rewriteSearchQuery falls back to combining context without an LLM', async () => {
  const { query, rewritten } = await rewriteSearchQuery('And the economy?', [
    { role: 'user', content: 'What research does NISER do on agriculture?' },
    { role: 'assistant', content: 'NISER researches agriculture policy.' },
  ]);
  assert.equal(rewritten, true);
  assert.match(query, /agriculture/);
});
