import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import { getEventBySlug, getEvents } from '@/lib/cms/client';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const events = await getEvents({ limit: 100 });
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.title,
    description: event.summary?.slice(0, 160) ?? undefined,
  };
}

const eventTypeLabels: Record<string, string> = {
  seminar: 'Seminar',
  workshop: 'Workshop',
  conference: 'Conference',
  webinar: 'Webinar',
};

const eventTypeColors: Record<string, string> = {
  seminar: 'badge--blue',
  workshop: 'badge--teal',
  conference: 'badge--purple',
  webinar: 'badge--green',
};

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Dev.',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-NG', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Africa/Lagos',
    }).format(new Date(dateStr)) + ' WAT';
  } catch { return dateStr; }
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const typeLabel = eventTypeLabels[event.eventType] ?? event.eventType;
  const typeColor = eventTypeColors[event.eventType] ?? 'badge--gray';
  const divisionLabel = event.division ? (divisionLabels[event.division] ?? event.division) : null;

  let isPast = false;
  try { isPast = new Date(event.startDate) < new Date(); } catch { /* ignore */ }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate ?? undefined,
    description: event.summary ?? undefined,
    location: event.isOnline
      ? { '@type': 'VirtualLocation', url: event.registrationUrl ?? `https://niser.gov.ng/events/${event.slug}` }
      : {
          '@type': 'Place',
          name: event.location ?? 'NISER, Ibadan',
          address: 'KM 17, Idiroko Road, Ibadan, Oyo State, Nigeria',
        },
    performer: (event.speakers ?? []).map((s) => ({
      '@type': 'Person', name: s.fullName,
      url: s.slug ? `https://niser.gov.ng/people/${s.slug}` : undefined,
    })),
    organizer: {
      '@type': 'Organization',
      name: 'National Institute of Social and Economic Research (NISER)',
      url: 'https://niser.gov.ng',
    },
    eventStatus: isPast ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/MixedEventAttendanceMode',
    url: `https://niser.gov.ng/events/${event.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection
        title={event.title}
        description={event.summary?.slice(0, 160) ?? 'NISER seminar, workshop, or conference bringing research and policy together.'}
        subtitle={`${typeLabel}${isPast ? ' · Past event' : ''}`}
      />

      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="pub-detail-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li><Link href="/events">Events</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li aria-current="page">{event.title.slice(0, 50)}{event.title.length > 50 ? '…' : ''}</li>
            </ol>
          </div>
        </nav>

        <div className="section">
          <div className="container pub-detail-body">
            <div className="pub-detail-main">
              {/* Badges + meta */}
              <div className="pub-detail-header__badges">
                <span className={`badge ${typeColor}`}>{typeLabel}</span>
                {event.isOnline && <span className="badge badge--teal">🌐 Online</span>}
                {!event.isOnline && event.location && (
                  <span className="badge badge--gray">{event.location}</span>
                )}
                {divisionLabel && <span className="badge badge--gray">{divisionLabel}</span>}
                {isPast && <span className="badge badge--gold">Past event</span>}
              </div>

              <h1 className="pub-detail-title" style={{ marginTop: '1rem' }}>{event.title}</h1>

              <div className="pub-detail-meta" style={{ marginTop: '1rem' }}>
                <span className="pub-detail-meta__item">
                  📅 {formatDateTime(event.startDate)}
                  {event.endDate ? ` – ${formatDateTime(event.endDate)}` : ''}
                </span>
                {!event.isOnline && event.location && (
                  <span className="pub-detail-meta__item">📍 {event.location}</span>
                )}
              </div>

              {/* Summary / body */}
              {event.summary ? (
                <section style={{ marginTop: '2rem' }} aria-labelledby="event-about-heading">
                  <h2 id="event-about-heading" className="pub-detail-section-title">About this event</h2>
                  <div className="pub-detail-abstract">
                    {event.summary.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <section style={{ marginTop: '2rem' }} aria-labelledby="event-speakers-heading">
                  <h2 id="event-speakers-heading" className="pub-detail-section-title">Speakers</h2>
                  <div className="home-topics__list" role="list" style={{ listStyle: 'none' }}>
                    {event.speakers.map((speaker) => {
                      const content = (
                        <>
                          <span className="home-topics__num" aria-hidden="true">
                            {speaker.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </span>
                          <span className="home-topics__body">
                            <span className="home-topics__title">{speaker.fullName}</span>
                            <span className="home-topics__desc">Speaker</span>
                          </span>
                        </>
                      );
                      return speaker.slug ? (
                        <li key={speaker.id ?? speaker.fullName}>
                          <Link href={`/people/${speaker.slug}`} className="home-topics__row">{content}</Link>
                        </li>
                      ) : (
                        <li key={speaker.id ?? speaker.fullName}>
                          <span className="home-topics__row" role="presentation">{content}</span>
                        </li>
                      );
                    })}
                  </div>
                </section>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2.5rem' }}>
                {!isPast && event.registrationUrl && (
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                    Register for this event →
                  </a>
                )}
                {isPast && event.recordingUrl && (
                  <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                    ▶ Watch the recording
                  </a>
                )}
                <Link href="/events" className="btn btn--outline">Browse all events</Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="pub-detail-sidebar" aria-label="Event details">
              <div className="card pub-detail-sidebar__card">
                <div className="card__body">
                  <h3 className="pub-detail-sidebar__heading">Details</h3>
                  <dl className="pub-detail-dl">
                    <dt>Type</dt>
                    <dd><span className={`badge ${typeColor}`}>{typeLabel}</span></dd>
                    <dt>Starts</dt>
                    <dd>{formatDateTime(event.startDate)}</dd>
                    {event.endDate ? (<><dt>Ends</dt><dd>{formatDateTime(event.endDate)}</dd></>) : null}
                    <dt>Format</dt>
                    <dd>{event.isOnline ? '🌐 Online' : '🏛️ In person'}</dd>
                    {!event.isOnline && (<><dt>Venue</dt><dd>{event.location ?? 'NISER, Ibadan'}</dd></>)}
                    {divisionLabel ? (<><dt>Division</dt><dd>{divisionLabel}</dd></>) : null}
                  </dl>

                  <hr className="divider" style={{ margin: '1.25rem 0' }} />
                  {!isPast && event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Register now
                    </a>
                  ) : null}
                  {isPast && event.recordingUrl ? (
                    <a
                      href={event.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--outline"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      ▶ Watch recording
                    </a>
                  ) : null}
                  <a
                    href={`/api/data/ical?id=${encodeURIComponent(event.slug)}`}
                    className="btn btn--outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                    download
                  >
                    📅 Download calendar (.ics)
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
