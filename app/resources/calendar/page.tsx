import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'NISER Calendar of Activities | Resources',
  description: 'NISER calendar of activities and events for the year.',
};

export default function CalendarPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="NISER Calendar of Activities"
              description="Upcoming events and scheduled activities"
            />
            <div className="prose max-w-3xl">
              <p>
                View NISER's calendar of activities, seminars, workshops, and events throughout the year.
              </p>
              <p>
                The calendar will display upcoming events, training programs, and important institutional dates.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
