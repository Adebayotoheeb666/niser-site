import { promises as fs } from 'fs';
import path from 'path';
import { isIP } from 'node:net';
import { sendEmail } from '@/lib/email-service';
import { createAiCompletion } from './llm';
import { getFirebaseFirestore, sendPushNotificationToTopic } from '@/lib/firebase-admin';

interface PolicyMonitorItem {
  title: string;
  link: string;
  description?: string;
  published?: string;
}

interface PolicyMonitorState {
  lastCheckedAt: string;
  seenLinks: string[];
  seenTitles: string[];
}

interface MonitorResult {
  status: 'updated' | 'no-new-items';
  sourceUrl: string;
  sources: string[];
  totalItems: number;
  newItems: PolicyMonitorItem[];
  message: string;
}

/**
 * High-impact events trigger an immediate rapid-response push notification
 * to the mobile app (topic: niser_rapid_response) in addition to the daily
 * schedule — Implementation Plan v1.1 §9 Capability 6 "urgency escalation".
 */
const URGENT_ITEM_PATTERN =
  /(monetary\s*policy\s*rate|\bmp\b|\bmpr\b|cpi|inflation\s*rate|budget\s*presentation|appropriation\s*bill|minimum\s*wage|fuel\s*subsidy|exchange\s*rate\s*policy)/i;

/** Keyword map standing in for zero-shot classification of division relevance. */
const DIVISION_KEYWORDS: Record<string, RegExp> = {
  macroeconomics: /(monetary|fiscal|inflation|cbn|central bank|exchange rate|tax|revenue|gdp|growth)/i,
  poverty_social: /(poverty|social protection|welfare|cash transfer|unemployment|education|health|gender)/i,
  agriculture: /(agricultur|food security|farm|fertilis|fertiliz|rural|livestock|crop)/i,
  governance: /(governance|procurement|anti-corruption|national assembly|legislation|bill|transparency|public sector)/i,
  industry: /(industr|manufactur|trade|sme|investment|competitiveness|privatisation| privatization)/i,
};

export function classifyDivisions(item: PolicyMonitorItem): string[] {
  const haystack = `${item.title} ${item.description ?? ''}`;
  return Object.entries(DIVISION_KEYWORDS)
    .filter(([, pattern]) => pattern.test(haystack))
    .map(([division]) => division);
}

export function isUrgentItem(item: PolicyMonitorItem): boolean {
  return URGENT_ITEM_PATTERN.test(`${item.title} ${item.description ?? ''}`);
}

interface BriefEntry {
  item: PolicyMonitorItem;
  summary?: string;
  score: number;
  urgent?: boolean;
}

/**
 * Format the structured daily brief: one section per research division,
 * each item with title, source host, summary, relevance score, and a
 * pre-filled rapid-response drafting link.
 */
export function buildDailyBrief(entries: BriefEntry[]): { subject: string; html: string } {
  const dateLabel = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const byDivision = new Map<string, BriefEntry[]>();
  for (const entry of entries) {
    const divisions = classifyDivisions(entry.item);
    const targets = divisions.length > 0 ? divisions : ['general'];
    for (const division of targets) {
      if (!byDivision.has(division)) byDivision.set(division, []);
      byDivision.get(division)!.push(entry);
    }
  }

  const sectionTitles: Record<string, string> = {
    macroeconomics: 'Macroeconomic Policy',
    poverty_social: 'Poverty & Social Development',
    agriculture: 'Agriculture & Food Policy',
    governance: 'Governance & Institutions',
    industry: 'Industry & Enterprise',
    general: 'General / Cross-cutting',
  };

  let html = `<p><strong>${entries.length}</strong> relevant item${entries.length === 1 ? '' : 's'} detected across <strong>${byDivision.size}</strong> division area${byDivision.size === 1 ? '' : 's'}.</p>`;
  html += `<p style="color:#666;font-size:13px">Delivered by the NISER Policy Monitor · ${escapeHtml(dateLabel)} WAT</p>`;

  for (const division of Array.from(byDivision.keys())) {
    const divisionEntries = byDivision.get(division) ?? [];
    html += `<h3 style="margin:18px 0 6px;color:#006B3F">${escapeHtml(sectionTitles[division] ?? division)}</h3>`;
    for (const entry of divisionEntries) {
      let host = '';
      try { host = new URL(entry.item.link || '').hostname.replace(/^www\./, ''); } catch { /* no link */ }
      const draftLink = entry.item.link
        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://niser.gov.ng'}/insights?draftTitle=${encodeURIComponent(`Rapid response: ${entry.item.title}`)}`
        : '';
      html += `<div style="margin-bottom:12px">`;
      html += `<p style="margin:0"><strong>${escapeHtml(entry.item.title)}</strong>${entry.urgent ? ' 🔴<span style="color:#c0392b;font-size:12px"> HIGH IMPACT</span>' : ''}<br/>`;
      html += `<span style="color:#666;font-size:13px">${escapeHtml(host)} · relevance ${entry.score.toFixed(1)}</span></p>`;
      if (entry.summary) {
        html += `<p style="margin:4px 0 0;font-size:14px">${escapeHtml(entry.summary)}</p>`;
      }
      if (entry.item.link) {
        html += `<p style="margin:4px 0 0;font-size:13px"><a href="${escapeHtml(entry.item.link)}">Read source</a>${draftLink ? ` · <a href="${escapeHtml(draftLink)}">Write rapid response?</a>` : ''}</p>`;
      }
      html += `</div>`;
    }
  }

  const urgentCount = entries.filter((e) => e.urgent).length;
  const subject = `NISER Policy Monitor — ${dateLabel} — ${entries.length} item${entries.length === 1 ? '' : 's'} across ${byDivision.size} division${byDivision.size === 1 ? '' : 's'}${urgentCount > 0 ? ` (${urgentCount} urgent)` : ''}`;

  return { subject, html };
}

async function escalatePush(entry: BriefEntry): Promise<void> {
  try {
    await sendPushNotificationToTopic('niser_rapid_response', {
      title: `Policy alert: ${entry.item.title.slice(0, 80)}`,
      body: entry.summary || 'High-impact policy development detected. Review now.',
      data: {
        type: 'rapid_response',
        url: entry.item.link,
      },
    });
  } catch (err) {
    console.warn('[policy-monitor] Urgent push escalation failed', err);
  }
}

const statePath = path.join(process.cwd(), '.cache', 'policy-monitor-state.json');

const DEFAULT_SOURCE_WEIGHT = 1;

export function parseSourceWeights(): Record<string, number> {
  const raw = process.env.POLICY_MONITOR_SOURCE_WEIGHTS || '';
  // expected format: hostname=2,other.example=0.5
  return raw.split(',').map((s) => s.trim()).filter(Boolean).reduce((acc, pair) => {
    const [k, v] = pair.split('=');
    if (!k) return acc;
    const host = k.trim().toLowerCase();
    const weight = Number(v ?? '') || DEFAULT_SOURCE_WEIGHT;
    acc[host] = weight;
    return acc;
  }, {} as Record<string, number>);
}

async function persistAlert(item: PolicyMonitorItem, summary: string, score: number) {
  try {
    const db = getFirebaseFirestore();
    const now = new Date();
    await db.collection('policy_alerts').add({
      title: item.title,
      link: item.link,
      description: item.description || null,
      published: item.published || null,
      summary,
      score,
      createdAt: now.toISOString(),
      notified: false,
    });
  } catch (err) {
    console.warn('[policy-monitor] Failed to persist alert to Firestore', err);
  }
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseFeedItems(feed: string): PolicyMonitorItem[] {
  const itemMatches = Array.from(feed.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi));
  const items: PolicyMonitorItem[] = [];

  for (const match of itemMatches) {
    const block = match[2] ?? '';
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
    const linkTag = block.match(/<link\b[^>]*>/i)?.[0] ?? '';
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? linkTag.match(/href=["']([^"']+)["']/i)?.[1] ?? '';
    const description = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? '';
    const published = block.match(/<(pubDate|published|updated)[^>]*>([\s\S]*?)<\/\1>/i)?.[2] ?? '';
    const cleanTitle = title.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    const cleanLink = link.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    const cleanDescription = description.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();

    if (cleanTitle || cleanLink) {
      items.push({ title: cleanTitle, link: cleanLink, description: cleanDescription, published: published.trim() });
    }
  }

  return items;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character));
}

function validateFeedUrl(sourceUrl: string): URL {
  let parsed: URL;
  try { parsed = new URL(sourceUrl); } catch { throw new Error('POLICY_MONITOR_FEED_URL must be a valid URL'); }
  if (parsed.protocol !== 'https:') throw new Error('POLICY_MONITOR_FEED_URL must use HTTPS');
  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.local') || isIP(hostname)) throw new Error('POLICY_MONITOR_FEED_URL must not target a local or IP address');
  const allowlist = (process.env.POLICY_MONITOR_ALLOWED_HOSTS ?? '').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean);
  if (allowlist.length > 0 && !allowlist.includes(hostname)) throw new Error('POLICY_MONITOR_FEED_URL host is not allowlisted');
  return parsed;
}

async function readState(): Promise<PolicyMonitorState> {
  try {
    const raw = await fs.readFile(statePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { lastCheckedAt: '', seenLinks: [], seenTitles: [] };
  }
}

async function writeState(state: PolicyMonitorState) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
}

function shouldTrackItem(item: PolicyMonitorItem): boolean {
  const haystack = `${item.title} ${item.description ?? ''}`.toLowerCase();
  return /(policy|budget|research|innovation|governance|health|education|agriculture|energy|economy|climate)/i.test(haystack);
}

function resolveFeedSources(): string[] {
  const multi = (process.env.POLICY_MONITOR_FEED_URLS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const legacy = process.env.POLICY_MONITOR_FEED_URL?.trim();
  if (legacy && !multi.includes(legacy)) multi.push(legacy);
  return multi;
}

export async function monitorPolicyFeed(options: {
  sendAlerts?: boolean;
} = {}): Promise<MonitorResult> {
  const sourceUrls = resolveFeedSources();
  if (sourceUrls.length === 0) {
    return {
      status: 'no-new-items',
      sourceUrl: '',
      sources: [],
      totalItems: 0,
      newItems: [],
      message: 'No policy feed URLs configured. Set POLICY_MONITOR_FEED_URLS.',
    };
  }

  // Fetch all configured feeds (CBN, NBS, FMF, NASS, IMF/World Bank Nigeria…)
  const feedItems: PolicyMonitorItem[] = [];
  for (const sourceUrl of sourceUrls) {
    try {
      const feedUrl = validateFeedUrl(sourceUrl);
      const response = await fetchWithRetry(feedUrl.toString(), { headers: { Accept: 'application/rss+xml, application/xml, text/xml' }, redirect: 'error' }, 3, 500);

      const contentLength = Number(response.headers.get('content-length') ?? '0');
      if (contentLength > 2_000_000) throw new Error('Policy feed exceeds the 2 MB limit');
      const feed = await response.text();
      if (feed.length > 2_000_000) throw new Error('Policy feed exceeds the 2 MB limit');
      feedItems.push(...parseFeedItems(feed).filter(shouldTrackItem));
    } catch (err) {
      // One broken source must not take down the whole briefing
      console.warn(`[policy-monitor] Feed failed (${sourceUrl}):`, err);
    }
  }

  const previous = await readState();
  const seenLinks = new Set(previous.seenLinks ?? []);
  const seenTitles = new Set(previous.seenTitles ?? []);
  const newEntries: BriefEntry[] = [];

  const sourceWeights = parseSourceWeights();

  for (const item of feedItems) {
    const linkKey = normalizeText(item.link || item.title);
    const titleKey = normalizeText(item.title);
    if (!linkKey || seenLinks.has(linkKey) || seenTitles.has(titleKey)) continue;
    // compute a simple score based on source weight and heuristics
    let score = 1;
    try {
      const hostname = new URL(item.link || '').hostname.toLowerCase();
      score = sourceWeights[hostname] ?? DEFAULT_SOURCE_WEIGHT;
    } catch {
      score = DEFAULT_SOURCE_WEIGHT;
    }
    if (classifyDivisions(item).length > 0) score += 0.5;
    const urgent = isUrgentItem(item);
    if (urgent) score += 1;

    // Summarize item (best-effort, non-blocking)
    let summary = '';
    try {
      const prompt = `Summarize this news item in one short sentence for a policy monitoring digest:\nTitle: ${item.title}\nLink: ${item.link}\nDescription: ${item.description ?? ''}`;
      summary = await createAiCompletion({ prompt, maxTokens: 200 });
    } catch (err) {
      console.warn('[policy-monitor] Summarization failed', err);
      summary = '';
    }

    newEntries.push({ item, summary, score, urgent });
    void persistAlert(item, summary, score);
    seenLinks.add(linkKey);
    seenTitles.add(titleKey);
  }

  const nextState: PolicyMonitorState = {
    lastCheckedAt: new Date().toISOString(),
    seenLinks: Array.from(seenLinks).slice(-200),
    seenTitles: Array.from(seenTitles).slice(-200),
  };

  await writeState(nextState);

  if (newEntries.length && options.sendAlerts !== false) {
    // Structured daily brief grouped by research division
    const { subject, html } = buildDailyBrief(newEntries);

    // Legacy single-address alerts
    const recipients = (process.env.POLICY_MONITOR_ALERT_EMAIL || '').split(',').map((value) => value.trim()).filter(Boolean);
    if (recipients.length) {
      await sendEmail({
        to: recipients[0],
        subject,
        html,
      });
    }

    // Send to stored subscribers in Firestore (if configured to send alerts)
    const sendAlertsEnabled = options.sendAlerts ?? true;
    if (sendAlertsEnabled) {
      try {
        const db = getFirebaseFirestore();
        const subsSnap = await db.collection('policy_subscriptions').get();
        const subs = subsSnap.docs.map((d) => d.data());
        for (const s of subs) {
          if (!s.email) continue;
          try {
            await sendEmail({
              to: s.email,
              subject,
              html,
            });
          } catch (err) {
            console.warn('[policy-monitor] Failed to email subscriber', s.email, err);
          }
        }
      } catch (err) {
        console.warn('[policy-monitor] Failed to read subscribers', err);
      }
    }

    // Urgency escalation: immediate push for high-impact items
    for (const entry of newEntries.filter((e) => e.urgent)) {
      await escalatePush(entry);
    }
  }

  return {
    status: newEntries.length ? 'updated' : 'no-new-items',
    sourceUrl: sourceUrls[0],
    sources: sourceUrls,
    totalItems: feedItems.length,
    newItems: newEntries.map((entry) => entry.item),
    message: newEntries.length
      ? `Detected ${newEntries.length} new policy item${newEntries.length === 1 ? '' : 's'} across ${sourceUrls.length} source${sourceUrls.length === 1 ? '' : 's'}.`
      : 'No new policy items were detected.',
  };
}

// Simple retry with exponential backoff around fetches — exported for tests
export async function fetchWithRetry(url: string, opts: RequestInit = {}, retries = 3, backoffMs = 500) {
  let attempt = 0;
  while (true) {
    try {
      const abort = new AbortController();
      const timeout = setTimeout(() => abort.abort(), 10_000);
      const response = await fetch(url, { ...opts, signal: abort.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`Fetch failed with ${response.status}`);
      return response;
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const wait = backoffMs * Math.pow(2, attempt - 1);
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}
