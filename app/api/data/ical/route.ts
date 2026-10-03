import { NextRequest, NextResponse } from 'next/server';
import { getEventBySlug, getEvents } from '@/lib/cms/client';

/**
 * GET /api/data/ical?id={slug}
 * Returns an iCalendar (.ics) file for a given event slug.
 * Works with CMS event data; gracefully handles missing events.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('id');

  if (!slug) {
    return NextResponse.json({ error: 'id (event slug) is required' }, { status: 400 });
  }

  // Try to fetch the specific event
  let event = await getEventBySlug(slug);

  // Fallback: search all events if direct slug lookup is unsupported
  if (!event) {
    const all = await getEvents({ limit: 200 });
    event = all.find((e) => e.slug === slug || e.id === slug) ?? null;
  }

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 3600 * 1000);

  const formatDate = (d: Date): string =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const uid = `event-${event.id ?? slug}@niser.gov.ng`;
  const url = event.slug ? `https://niser.gov.ng/events/${event.slug}` : 'https://niser.gov.ng/events';
  const description = (event.summary ?? '').replace(/\n/g, '\\n').slice(0, 500);
  const location = event.location ?? 'NISER, Ibadan, Nigeria';
  const now = formatDate(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NISER Digital Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:NISER Events',
    'X-WR-TIMEZONE:Africa/Lagos',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    description ? `DESCRIPTION:${description}` : '',
    `LOCATION:${location}`,
    `URL:${url}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const filename = `${slug.replace(/[^a-z0-9-]/gi, '_')}.ics`;

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600, s-maxage=21600',
    },
  });
}
