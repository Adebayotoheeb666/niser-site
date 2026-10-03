import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import EventsFilter from '@/components/ui/EventsFilter';
import { getEvents } from '@/lib/cms/client';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past NISER seminars, workshops, conferences, and webinars. Register or watch recordings.',
};

export default async function EventsPage() {
  const events = await getEvents({ limit: 50 });
  const now = new Date();

  const upcoming = events.filter((e) => {
    try { return new Date(e.startDate) >= now; } catch { return false; }
  });
  const past = events.filter((e) => {
    try { return new Date(e.startDate) < now; } catch { return false; }
  });

  // JSON-LD for upcoming events
  const jsonLd = upcoming.slice(0, 10).map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startDate,
    endDate: e.endDate ?? undefined,
    description: e.summary ?? undefined,
    location: {
      '@type': 'Place',
      name: e.location ?? 'NISER, Ibadan, Nigeria',
      address: 'KM 17, Idiroko Road, Ibadan, Oyo State, Nigeria',
    },
    organizer: {
      '@type': 'Organization',
      name: 'National Institute of Social and Economic Research (NISER)',
      url: 'https://niser.gov.ng',
    },
    url: e.slug ? `https://niser.gov.ng/events/${e.slug}` : 'https://niser.gov.ng/events',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <HeroSection
          title="Events & Seminars"
          description="Join webinars, workshops, and research seminars that connect NISER with policymakers and partners."
          subtitle="Discover upcoming gatherings and past recordings in one place"
        />
        <div className="events-hero animate-fade-in">
          <div className="container">
            <h1 className="events-hero__title animate-slide-up-stagger-1">Events & Seminars</h1>
            <p className="events-hero__desc animate-slide-up-stagger-2">
              NISER seminars, public lectures, workshops, and international conferences.
              Register to attend or watch recordings of past events.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="container">
            {/* Client-side filter component */}
            <EventsFilter upcoming={upcoming} past={past} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
