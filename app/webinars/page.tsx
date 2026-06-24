import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Webinars & Events | NISER',
  description: 'Join NISER webinars, seminars, and virtual events featuring leading researchers and policymakers.',
};

export default function WebinarsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Webinars & Events</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Join us for webinars, seminars, and roundtable discussions featuring leading researchers and policy experts.
            </p>
          </div>
        </section>

        {/* Upcoming & Past Events */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-12 border-b border-surface-gray">
              <button className="px-4 py-3 font-label-md text-label-md border-b-2 border-nigeria-green-deep text-nigeria-green-deep">
                Upcoming
              </button>
              <button className="px-4 py-3 font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant hover:text-on-surface">
                Past Events
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-6">
              {[
                { title: 'Fiscal Policy in Post-Pandemic Era', date: 'June 15, 2024', time: '10:00 AM WAT', speakers: 'Prof. Adekunle, Dr. Omoromoke' },
                { title: 'Agricultural Value Chains: Unlocking Growth', date: 'June 22, 2024', time: '2:00 PM WAT', speakers: 'Dr. Zainab Mohammed' },
                { title: 'Governance & Institutional Reform', date: 'July 5, 2024', time: '10:30 AM WAT', speakers: 'Prof. Adeyemi Okuntuyi' },
              ].map((event, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center min-w-[80px] bg-nigeria-green-deep text-on-primary rounded-lg p-3">
                      <span className="font-label-sm">JUN</span>
                      <span className="font-display-md text-display-md">{event.date.split(',')[0].split(' ')[1]}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">{event.title}</h3>
                      <p className="text-body-md text-on-surface-variant mb-1">{event.time}</p>
                      <p className="text-label-md text-on-surface-variant">Speakers: {event.speakers}</p>
                    </div>
                  </div>
                  <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                    Register <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
