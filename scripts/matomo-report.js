#!/usr/bin/env node
/**
 * Monthly analytics report generator (Matomo Reporting API).
 *
 * Pulls the previous month's core metrics from the self-hosted Matomo
 * instance and writes a markdown report for the Director's office.
 *
 * Required environment variables (see .env.local / .env.production.example):
 *   MATOMO_URL or NEXT_PUBLIC_MATOMO_URL — e.g. http://localhost:8081
 *   MATOMO_SITE_ID or NEXT_PUBLIC_MATOMO_SITE_ID — usually 1
 *   MATOMO_TOKEN_AUTH — API token with at least "view" access
 *
 * Usage:
 *   npm run matomo-report                 # report for last month → stdout
 *   npm run matomo-report -- --out docs   # write to docs/matomo-report-YYYY-MM.md
 */

const fs = require('fs');
const path = require('path');

function env(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

async function main() {
  const baseUrl = env('MATOMO_URL', 'NEXT_PUBLIC_MATOMO_URL');
  const siteId = env('MATOMO_SITE_ID', 'NEXT_PUBLIC_MATOMO_SITE_ID') ?? '1';
  const token = env('MATOMO_TOKEN_AUTH');

  if (!baseUrl || !token) {
    console.error(
      'Missing configuration. Set MATOMO_URL (or NEXT_PUBLIC_MATOMO_URL) and MATOMO_TOKEN_AUTH in the environment.',
    );
    process.exit(2);
  }

  // Previous calendar month, Matomo style
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthLabel = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
  const date = `${monthLabel}-01,last-day-of-month`;

  async function callApi(methods, extraParams = {}) {
    const url = new URL(`${baseUrl.replace(/\/$/, '')}/index.php`);
    url.searchParams.set('module', 'API');
    url.searchParams.set('format', 'JSON');
    url.searchParams.set('idSite', siteId);
    url.searchParams.set('period', 'month');
    url.searchParams.set('date', date);
    url.searchParams.set('token_auth', token);
    if (Array.isArray(methods)) {
      url.searchParams.set('method', 'API.getBulkRequest');
      url.searchParams.set(
        'requests',
        methods.map((m) => `method=${m}&format=JSON`).join(','),
      );
      url.searchParams.delete('period');
      url.searchParams.delete('date');
    } else {
      url.searchParams.set('method', methods);
    }
    for (const [key, value] of Object.entries(extraParams)) {
      url.searchParams.set(key, String(value));
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Matomo API returned ${res.status} for ${methods}`);
    return res.json();
  }

  console.error(`Fetching Matomo metrics for ${monthLabel} (site ${siteId})…`);

  const [visitOverview, topPages, topDownloads, devices] = await Promise.all([
    callApi('VisitsSummary.get'),
    callApi('Actions.getPageUrls', { filter_limit: 10, flat: 1 }),
    callApi('Actions.getDownloads', { filter_limit: 10, flat: 1 }),
    callApi('DevicesDetection.getType', { filter_limit: 5 }),
  ]);

  const firstEntry = (obj) => obj?.[Object.keys(obj ?? {})[0]] ?? obj;
  const overview = Array.isArray(visitOverview)
    ? visitOverview[0]?.[Object.keys(visitOverview[0] ?? {})[0]]
    : visitOverview;

  const fmt = (value) => (value === undefined || value === null ? '—' : value);

  const lines = [];
  lines.push(`# NISER Website Analytics Report — ${monthLabel}`);
  lines.push('');
  lines.push(`_Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · Source: self-hosted Matomo (site ${siteId})_`);
  lines.push('');
  lines.push('## Headline metrics');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('| --- | --- |');
  lines.push(`| Visits | ${fmt(overview?.nb_visits)} |`);
  lines.push(`| Unique visitors | ${fmt(overview?.nb_uniq_visitors)} |`);
  lines.push(`| Page views | ${fmt(overview?.nb_pageviews)} |`);
  lines.push(`| Downloads | ${fmt(overview?.nb_downloads)} |`);
  lines.push(`| Bounce rate | ${fmt(overview?.bounce_rate)} |`);
  lines.push(`| Avg. visit duration | ${fmt(overview?.avg_time_on_site)}s |`);
  lines.push('');

  const pages = Array.isArray(topPages) ? topPages : [];
  if (pages.length > 0) {
    lines.push('## Top pages');
    lines.push('');
    lines.push('| URL | Views |');
    lines.push('| --- | --- |');
    for (const page of pages.slice(0, 10)) {
      lines.push(`| ${page.label} | ${page.nb_hits ?? '—'} |`);
    }
    lines.push('');
  }

  const downloads = Array.isArray(topDownloads) ? topDownloads : [];
  if (downloads.length > 0) {
    lines.push('## Top downloads');
    lines.push('');
    lines.push('| File | Downloads |');
    lines.push('| --- | --- |');
    for (const file of downloads.slice(0, 10)) {
      lines.push(`| ${file.label} | ${file.nb_hits ?? '—'} |`);
    }
    lines.push('');
  }

  if (devices && typeof devices === 'object') {
    lines.push('## Visits by device type');
    lines.push('');
    for (const [label, visits] of Object.entries(devices)) {
      lines.push(`- **${label}:** ${visits}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('_Deliverable 23 (Implementation Plan v1.1 §8): monthly analytics reporting to the Director._');

  const report = lines.join('\n');
  const outIndex = process.argv.indexOf('--out');
  if (outIndex !== -1 && process.argv[outIndex + 1]) {
    const outDir = path.resolve(process.cwd(), process.argv[outIndex + 1]);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `matomo-report-${monthLabel}.md`);
    fs.writeFileSync(outPath, report + '\n');
    console.log(report);
    console.error(`Report written to ${outPath}`);
  } else {
    console.log(report);
  }
}

main().catch((error) => {
  console.error('[Matomo Report Error]:', error.message ?? error);
  process.exit(1);
});
