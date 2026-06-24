import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/ui/EventCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { getEvents } from '@/lib/cms/client';

export const revalidate = 3600; // 1 hour ISR

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past NISER seminars, workshops, conferences, and webinars. Register or watch recordings.',
};

export default async function EventsPage() {
  const events = await getEvents({ limit: 30 });
  const now = new Date();

  const upcoming = events.filter((e) => {
    try { return new Date(e.startDate) >= now; } catch { return false; }
  });
  const past = events.filter((e) => {
    try { return new Date(e.startDate) < now; } catch { return false; }
  });

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="events-hero">
          <div className="container">
            <h1 className="events-hero__title">Events & Seminars</h1>
            <p className="events-hero__desc">
              NISER seminars, public lectures, workshops, and international conferences.
              Register to attend or watch recordings of past events.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="container">
            {/* Upcoming */}
            {upcoming.length > 0 ? (
              <>
                <SectionHeader
                  title="Upcoming Events"
                  description={`${upcoming.length} event${upcoming.length !== 1 ? 's' : ''} coming up`}
                />
                <div className="grid--2" style={{ marginBottom: '3rem' }}>
                  {upcoming.map((evt) => <EventCard key={evt.id} event={evt} />)}
                </div>
              </>
            ) : (
              <div className="events-empty" style={{ marginBottom: '3rem' }}>
                <p>No upcoming events scheduled at this time. Check back soon.</p>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <>
                <SectionHeader
                  title="Past Events"
                  description="Browse recordings and materials from previous NISER events."
                />
                <div className="grid--2">
                  {past.map((evt) => <EventCard key={evt.id} event={evt} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

