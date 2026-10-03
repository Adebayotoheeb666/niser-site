#!/usr/bin/env node
/**
 * Matomo goals provisioning (Implementation Plan v1.1 §8 KPIs).
 *
 * Idempotently creates conversion goals in the self-hosted Matomo instance
 * matching the events the platform actually tracks:
 *
 *   search / query                  → Search performed
 *   chatbot / message_sent          → AI assistant engagement
 *   policy_brief / generated        → Policy brief generated (AI tool usage)
 *   policy_brief / published        → Policy brief published (human approval)
 *   translation / requested         → Translation requested
 *   any file download               → Publication/download conversions
 *
 * Required environment variables:
 *   MATOMO_URL / NEXT_PUBLIC_MATOMO_URL
 *   MATOMO_SITE_ID / NEXT_PUBLIC_MATOMO_SITE_ID
 *   MATOMO_TOKEN_AUTH  (token with admin access — needed to create goals)
 *
 * Usage: npm run matomo-goals
 */

const GOALS = [
  { name: 'Search performed', matchAttribute: 'event_category', pattern: 'search' },
  { name: 'Chatbot engagement', matchAttribute: 'event_category', pattern: 'chatbot' },
  { name: 'Policy brief generated (AI draft)', matchAttribute: 'event_category', pattern: 'policy_brief' },
  { name: 'Content translation requested', matchAttribute: 'event_category', pattern: 'translation' },
  { name: 'File download', matchAttribute: 'file_download', pattern: '', patternOptional: 1 },
];

function env(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

async function callApi(method, params = {}) {
  const url = new URL(`${baseUrl.replace(/\/$/, '')}/index.php`);
  url.searchParams.set('module', 'API');
  url.searchParams.set('format', 'JSON');
  url.searchParams.set('method', method);
  url.searchParams.set('idSite', siteId);
  url.searchParams.set('token_auth', token);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Matomo API ${method} failed with ${res.status}`);
  const body = await res.json();
  if (body.result === 0 || body.result === '0') {
    throw new Error(body.message ?? `Matomo API ${method} rejected the request`);
  }
  return body;
}

let baseUrl;
let siteId;
let token;

async function main() {
  baseUrl = env('MATOMO_URL', 'NEXT_PUBLIC_MATOMO_URL');
  siteId = env('MATOMO_SITE_ID', 'NEXT_PUBLIC_MATOMO_SITE_ID') ?? '1';
  token = env('MATOMO_TOKEN_AUTH');

  if (!baseUrl || !token) {
    console.error('Missing MATOMO_URL (or NEXT_PUBLIC_MATOMO_URL) and MATOMO_TOKEN_AUTH.');
    process.exit(2);
  }

  console.error(`Provisioning goals on Matomo site ${siteId}…`);

  const existingResponse = await callApi('Goals.getGoals');
  const existing = Object.values(existingResponse ?? {});
  const existingNames = new Set(existing.map((goal) => goal.name));

  let created = 0;
  let skipped = 0;

  for (const goal of GOALS) {
    if (existingNames.has(goal.name)) {
      skipped++;
      console.log(`= exists: ${goal.name}`);
      continue;
    }
    await callApi('Goals.addGoal', {
      name: goal.name,
      matchAttribute: goal.matchAttribute,
      pattern: goal.pattern,
      patternType: goal.matchAttribute === 'file_download' ? 'contains' : 'exact',
      caseSensitive: 0,
      allowMultipleConversionsPerVisit: 0,
    });
    created++;
    console.log(`+ created: ${goal.name} (${goal.matchAttribute}${goal.pattern ? `:${goal.pattern}` : ', any'})`);
  }

  // Funnel-style reporting hint: page-level funnels require Matomo 4.x Funnels plugin
  // (premium). Event goals above cover the §8 KPI reporting requirements.
  console.log(`\nDone. ${created} created, ${skipped} already present.`);
}

main().catch((error) => {
  console.error('[Matomo Goals Error]:', error.message ?? error);
  process.exit(1);
});
