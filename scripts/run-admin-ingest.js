#!/usr/bin/env node
async function main() {
  const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${base.replace(/\/$/, '')}/api/admin/ingest`;
  console.log(`Calling admin ingest: ${url}`);

  try {
    const body = { secret: process.env.WEBHOOK_SECRET || '' };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    process.exit(res.ok ? 0 : 2);
  } catch (err) {
    console.error('Admin ingest runner failed:', err);
    process.exit(1);
  }
}

main();
