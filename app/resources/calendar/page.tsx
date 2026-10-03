import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NISER Calendar of Activities | Resources',
  description: 'NISER calendar of activities, events, workshops, and important institutional dates for the year.',
};

const categoryColors = {
  Training: 'text-blue-700 bg-blue-50 border-blue-200',
  Seminar: 'text-green-700 bg-green-50 border-green-200',
  Workshop: 'text-orange-700 bg-orange-50 border-orange-200',
  Conference: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  Publication: 'text-purple-700 bg-purple-50 border-purple-200',
  Holiday: 'text-gray-700 bg-gray-50 border-gray-200',
  Meeting: 'text-red-700 bg-red-50 border-red-200',
  Lecture: 'text-teal-700 bg-teal-50 border-teal-200',
  Event: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  Administrative: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Celebration: 'text-rose-700 bg-rose-50 border-rose-200',
};

interface CmsEvent {
  id?: string;
  title?: string;
  startDate?: string;
  eventType?: string;
  location?: string;
  isOnline?: boolean;
}

interface CalendarEntry {
  date: string;
  title: string;
  category: string;
  color: string;
  location?: string;
}

interface CalendarMonth {
  month: string;
  events: CalendarEntry[];
}

export default async function CalendarPage() {
  const events = await (async () => {
    try {
      const ev = await import('@/lib/cms/client').then((m) => m.getEvents({ limit: 200 }));
      return ev as CmsEvent[];
    } catch {
      return [] as CmsEvent[];
    }
  })();

  // Group events by month name
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const calendarActivities: CalendarMonth[] = months.map((m) => ({ month: m, events: [] }));

  events.forEach((ev) => {
    if (!ev.startDate) return;
    const d = new Date(ev.startDate);
    if (isNaN(d.getTime())) return;
    const monthName = months[d.getMonth()];
    const entry = {
      date: ev.startDate ?? '',
      title: ev.title ?? 'Untitled Event',
      category: ev.eventType ? ev.eventType.charAt(0).toUpperCase() + ev.eventType.slice(1) : 'Event',
      color: 'bg-gray-100',
      location: ev.location ?? (ev.isOnline ? 'Virtual Event' : ''),
    };
    const slot = calendarActivities.find((c) => c.month === monthName);
    if (slot) slot.events.push(entry);
  });

  // For months with no events, calendarActivities already contains empty arrays

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Resource calendar
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">NISER Calendar of Activities</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">See the institute&apos;s scheduled seminars, trainings, workshops, and institutional milestones across the year.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Annual</p>
                <p className="mt-1 text-sm text-emerald-100">Research calendar</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Workshops</p>
                <p className="mt-1 text-sm text-emerald-100">Capacity building</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Events</p>
                <p className="mt-1 text-sm text-emerald-100">Seminars & meetings</p>
              </div>
            </div>
          </div>
        </section>

        <div className="section py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Activities</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Planned seminars, trainings, workshops, and highlights</h2>
            </div>

            <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <h3 className="mb-6 text-xl font-bold text-slate-900">Activity categories</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {Object.entries(categoryColors).map(([category, colors]) => (
                  <div key={category} className={`px-4 py-3 rounded-lg border text-sm font-medium ${colors}`}>
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12">
              {calendarActivities.map((monthData, idx) => (
                <div key={idx} className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]" id={monthData.month.toLowerCase()}>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{monthData.month}</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded"></div>
                  </div>

                  <div className="grid gap-4">
                    {monthData.events.map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className={`p-6 rounded-lg border-l-4 transition-all hover:shadow-md ${event.color}`}
                        style={{
                          borderLeftColor: event.color === 'bg-gray-100' ? '#9ca3af' : 
                                        event.color === 'bg-blue-50' ? '#0ea5e9' :
                                        event.color === 'bg-green-50' ? '#22c55e' :
                                        event.color === 'bg-orange-50' ? '#f97316' :
                                        event.color === 'bg-purple-50' ? '#a855f7' :
                                        event.color === 'bg-red-50' ? '#ef4444' :
                                        event.color === 'bg-pink-50' ? '#ec4899' :
                                        event.color === 'bg-indigo-50' ? '#6366f1' :
                                        event.color === 'bg-cyan-50' ? '#06b6d4' :
                                        event.color === 'bg-yellow-50' ? '#eab308' :
                                        event.color === 'bg-rose-50' ? '#f43f5e' : '#9ca3af'
                        }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                              {event.date}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-4 py-2 rounded-full text-xs font-semibold border ${
                                categoryColors[event.category as keyof typeof categoryColors]
                              }`}
                            >
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Quick navigation</h2>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                {calendarActivities.map((monthData) => (
                  <a
                    key={monthData.month}
                    href={`#${monthData.month.toLowerCase()}`}
                    className="px-4 py-2 text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-700 hover:text-white rounded-lg transition-colors"
                  >
                    {monthData.month.substring(0, 3)}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-3xl border border-blue-200 bg-blue-50/70 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Important notes</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex gap-3"><span className="font-bold">•</span><span>This calendar is subject to change based on operational requirements and unforeseen circumstances.</span></li>
                <li className="flex gap-3"><span className="font-bold">•</span><span>For specific details about each event, please visit the Events page or contact the relevant department.</span></li>
                <li className="flex gap-3"><span className="font-bold">•</span><span>Training programs require prior registration. Visit the Training page for application details.</span></li>
                <li className="flex gap-3"><span className="font-bold">•</span><span>Subscribe to our newsletter to receive updates about upcoming activities and new announcements.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
