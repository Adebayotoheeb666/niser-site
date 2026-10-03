import type { CMSEvent } from '@/types/cms';
import { getEvents } from '@/lib/cms/client';

/**
 * GET /api/podcast/feed.xml
 *
 * NISER Seminar & Events podcast feed (RSS 2.0 + iTunes tags).
 * Episodes are generated from published CMS events that have a recording URL,
 * newest first. Submit this URL to podcast platforms (Spotify, Apple Podcasts)
 * to distribute NISER's multimedia channel.
 */

export const revalidate = 3600;

const SITE = 'https://niser.gov.ng';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let events: CMSEvent[] = [];
  try {
    events = await getEvents({ limit: 100 });
  } catch {
    events = [];
  }

  const episodes = events
    .filter((e) => e.recordingUrl?.trim())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const items = episodes
    .map((event) => {
      const title = escapeXml(event.title);
      const description = escapeXml(event.summary ?? event.title);
      const pubDate = new Date(event.startDate || Date.now()).toUTCString();
      const link = event.recordingUrl ?? `${SITE}/events/${event.slug}`;
      const guid = `niser-event-${event.id ?? event.slug}`;
      return `    <item>
      <title>${title}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <itunes:summary>${description}</itunes:summary>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NISER Research Seminars</title>
    <link>${SITE}/webinars</link>
    <language>en-ng</language>
    <copyright>© ${new Date().getFullYear()} National Institute of Social and Economic Research</copyright>
    <description>Recorded seminars, workshops, and policy conversations from the Nigerian Institute of Social and Economic Research.</description>
    <itunes:author>NISER Nigeria</itunes:author>
    <itunes:category text="Government" />
    <itunes:explicit>false</itunes:explicit>
    <atom:link href="${SITE}/api/podcast/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600',
    },
  });
}
