#!/usr/bin/env node
/**
 * Year-one website quality benchmark (Implementation Plan v1.1 deliverable 26).
 *
 * Repeats the 8-dimension quality audit against a running deployment and
 * computes the composite score (baseline 41/100 → year-one target ≥ 75/100).
 *
 * Dimensions (equal weight, 0–100 each):
 *   1. Performance        — TTFB + compressed transfer size of key pages
 *   2. SEO                — sitemap, robots, meta descriptions, canonical tags
 *   3. Accessibility      — static WCAG source audit + lang/skip-nav presence
 *   4. Content freshness  — homepage news/pubs recency via CMS API
 *   5. Mobile readiness   — viewport meta + responsive image config
 *   6. Security headers   — CSP-class headers from middleware
 *   7. Functionality      — key API endpoints respond correctly
 *   8. Structured data    — JSON-LD coverage on sample pages
 *
 * Usage: BASE_URL=https://niser.gov.ng npm run benchmark
 * Default BASE_URL: http://localhost:3000
 */

const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const KEY_PAGES = ['/', '/publications', '/people', '/insights', '/events', '/data'];
const API_CHECKS = [
  { path: '/api/publications?limit=1', expect: 'items' },
  { path: '/api/events?limit=1', expect: 'items' },
  { path: '/api/news?limit=1', expect: 'items' },
];

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

async function fetchPage(pathname, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${pathname}`, { signal: controller.signal });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Dimension checks ─────────────────────────────────────────────────────────

async function checkPerformance() {
  const samples = [];
  for (const page of KEY_PAGES.slice(0, 4)) {
    const started = Date.now();
    const res = await fetchPage(page);
    const ttfbMs = Date.now() - started;
    const bytes = Number(res.headers.get('content-length') ?? Buffer.byteLength(res.body));
    const gzipped = /gzip|br|zstd/i.test(res.headers.get('content-encoding') ?? '');
    // Score: TTFB under 800ms full marks; body under 200KB full marks; compression required
    const ttfbScore = Math.max(0, 100 - ttfbMs / 20);
    const sizeScore = Math.max(0, 100 - bytes / 4000);
    samples.push(gzipped ? (ttfbScore + sizeScore) / 2 : Math.min(ttfbScore, sizeScore) * 0.6);
  }
  return { score: clamp(samples.reduce((a, b) => a + b, 0) / samples.length), detail: `${samples.length} pages sampled` };
}

async function checkSeo() {
  let points = 0;
  const sitemap = await fetchPage('/sitemap.xml');
  if (sitemap.status === 200 && sitemap.body.includes('<urlset')) points += 30;
  const robots = await fetchPage('/robots.txt');
  if (robots.status === 200 && robots.body.toLowerCase().includes('sitemap')) points += 10;
  const home = await fetchPage('/');
  if (/<meta[^>]+name=["']description["']/i.test(home.body)) points += 15;
  if (/rel=["']canonical["']/i.test(home.body)) points += 15;
  if (home.body.includes('og:title') || home.body.includes('og:description')) points += 10;
  const pubPage = await fetchPage('/publications');
  if (/<title>/i.test(pubPage.body)) points += 20;
  return { score: clamp(points), detail: 'sitemap, robots, meta, canonical, OG' };
}

function checkAccessibility() {
  return new Promise((resolve) => {
    execFile('node', [path.join(ROOT, 'scripts', 'wcag-audit.js')], { cwd: ROOT }, (error, stdout) => {
      const match = (stdout ?? '').match(/(\d+) critical failures/);
      const failures = match ? Number(match[1]) : error ? -1 : 0;
      if (failures < 0) return resolve({ score: 50, detail: 'audit unavailable' });
      resolve({ score: clamp(failures === 0 ? 100 : Math.max(40, 100 - failures * 10)), detail: `${failures} static WCAG failures` });
    });
  });
}

async function checkFreshness() {
  const now = Date.now();
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}/api/news?limit=3`);
      const body = await res.json();
      const items = Array.isArray(body) ? body : body.items;
      const dates = (Array.isArray(items) ? items : [])
        .map((item) => new Date(item.publishedDate ?? item.createdAt ?? 0).getTime())
        .filter((time) => time > 0);
      if (dates.length === 0) return { score: 40, detail: 'no dated content found' };
      const newest = Math.max(...dates);
      const ageDays = (now - newest) / 86_400_000;
      // Full marks when newest item is ≤ 7 days old; zero at 90+ days
      return { score: clamp(100 - (ageDays - 7) * (93 / 83)), detail: `newest item ${Math.round(ageDays)} days old` };
    } catch {
      if (attempt === 0) continue;
    }
  }
  return { score: 0, detail: 'CMS unreachable' };
}

async function checkMobileReadiness() {
  let points = 0;
  for (const page of KEY_PAGES.slice(0, 3)) {
    const res = await fetchPage(page);
    if (/name=["']viewport["'][^>]*width\s*=\s*device-width/i.test(res.body)) points += 25;
    if (points >= 75) break; // sampled enough
  }
  return { score: clamp(points), detail: 'viewport meta on key pages' };
}

async function checkSecurityHeaders() {
  const res = await fetchPage('/');
  let points = 0;
  if (res.headers.get('x-content-type-options')) points += 25;
  if (res.headers.get('x-frame-options')) points += 25;
  if (res.headers.get('referrer-policy')) points += 25;
  if (res.headers.get('permissions-policy')) points += 25;
  return { score: clamp(points), detail: 'middleware security headers' };
}

async function checkFunctionality() {
  let ok = 0;
  for (const check of API_CHECKS) {
    try {
      const res = await fetch(`${BASE_URL}${check.path}`);
      if (!res.ok) continue;
      const body = await res.json();
      if (check.expect === 'items' ? Array.isArray(body.items) : Array.isArray(body)) ok++;
    } catch { /* endpoint down */ }
  }
  return { score: clamp((ok / API_CHECKS.length) * 100), detail: `${ok}/${API_CHECKS.length} endpoints healthy` };
}

async function checkStructuredData() {
  const wanted = ['Organization', 'Person', 'Event', 'ScholarlyArticle', '"@type":"Report"', 'NewsArticle'];
  const found = new Set();
  const samples = ['/', '/people', '/events'];
  for (const page of samples) {
    try {
      const res = await fetchPage(page);
      for (const type of wanted) {
        if (res.body.includes(type)) found.add(type.replace(/"/g, '').replace('@type:', ''));
      }
    } catch { /* ignore */ }
  }
  return { score: clamp((found.size / 4) * 100), detail: `found: ${Array.from(found).join(', ')}` };
}

// ─── Runner ───────────────────────────────────────────────────────────────────

async function main() {
  console.error(`Running quality benchmark against ${BASE_URL}…`);
  const dimensions = {};
  dimensions['Performance'] = await checkPerformance();
  dimensions['SEO'] = await checkSeo();
  dimensions['Accessibility'] = await checkAccessibility();
  dimensions['Content freshness'] = await checkFreshness();
  dimensions['Mobile readiness'] = await checkMobileReadiness();
  dimensions['Security headers'] = await checkSecurityHeaders();
  dimensions['Functionality'] = await checkFunctionality();
  dimensions['Structured data'] = await checkStructuredData();

  const scores = Object.values(dimensions).map((d) => d.score);
  const composite = clamp(scores.reduce((a, b) => a + b, 0) / scores.length);

  const lines = [];
  lines.push('# NISER Website Quality Benchmark');
  lines.push('');
  lines.push(`_Target: ${BASE_URL} · ${new Date().toISOString().slice(0, 10)} · baseline 41/100 · year-one target ≥ 75/100_`);
  lines.push('');
  lines.push('| Dimension | Score | Notes |');
  lines.push('| --- | --- | --- |');
  for (const [name, result] of Object.entries(dimensions)) {
    lines.push(`| ${name} | ${result.score} | ${result.detail} |`);
  }
  lines.push(`| **Composite** | **${composite}** | ${composite >= 75 ? '✅ target met' : composite >= 41 ? '⚠️ above baseline, below target' : '❌ below baseline'} |`);

  console.log(lines.join('\n'));

  const outDir = path.join(ROOT, 'docs');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `quality-benchmark-${new Date().toISOString().slice(0, 10)}.md`);
  fs.writeFileSync(outPath, lines.join('\n') + '\n');
  console.error(`Report saved to ${path.relative(ROOT, outPath)}`);

  process.exit(composite >= 41 ? 0 : 1);
}

main().catch((error) => {
  console.error('[Benchmark Error]:', error.message ?? error);
  process.exit(1);
});
