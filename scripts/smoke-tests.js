#!/usr/bin/env node
const BASE = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const endpoints = [
  { method: 'GET', path: `/api/search?q=poverty` },
  { method: 'POST', path: `/api/chatbot`, body: { message: 'What has NISER published on poverty?' } },
  { method: 'POST', path: `/api/literature-assistant`, body: { query: 'poverty' } },
  { method: 'POST', path: `/api/policy-monitor`, body: { sendAlerts: false } },
  { method: 'POST', path: `/api/admin/ingest`, body: { secret: process.env.WEBHOOK_SECRET || '' } },
];

async function run() {
  console.log('Base URL:', BASE);
  let failed = 0;
  for (const ep of endpoints) {
    const url = `${BASE.replace(/\/$/, '')}${ep.path}`;
    try {
      const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
      if (ep.body) opts.body = JSON.stringify(ep.body);
      const res = await fetch(url, opts);
      const text = await res.text();
      const ok = res.status >= 200 && res.status < 500; // accept 4xx as app-level but reachable
      console.log(`\n[${ep.method}] ${url} -> ${res.status} ${res.statusText} ${ok ? 'OK' : 'FAIL'}`);
      console.log(text.slice(0, 800));
      if (!ok) failed += 1;
    } catch (err) {
      console.error(`\n[${ep.method}] ${url} -> ERROR:`, err.message || err);
      failed += 1;
    }
  }

  if (failed > 0) {
    console.error(`\nSmoke tests completed: ${failed} failed`);
    process.exit(2);
  }

  console.log('\nSmoke tests completed: all reachable endpoints responded');
  process.exit(0);
}

run();
