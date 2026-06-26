import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'NISER Calendar of Activities | Resources',
  description: 'NISER calendar of activities, events, workshops, and important institutional dates for the year.',
};

const calendarActivities = [
  {
    month: 'January',
    events: [
      { date: 'Jan 1', title: 'New Year Holiday', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Jan 15-20', title: 'Research Methodology Training (Intensive)', category: 'Training', color: 'bg-blue-50' },
      { date: 'Jan 25', title: 'Monthly Research Seminar', category: 'Seminar', color: 'bg-green-50' },
    ],
  },
  {
    month: 'February',
    events: [
      { date: 'Feb 5', title: 'Policy Brief Launch - Economic Analysis', category: 'Publication', color: 'bg-purple-50' },
      { date: 'Feb 14', title: 'Valentine\'s Day', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Feb 18-22', title: 'Workshop on Data Analytics', category: 'Workshop', color: 'bg-orange-50' },
      { date: 'Feb 28', title: 'Quarterly Board Meeting', category: 'Meeting', color: 'bg-red-50' },
    ],
  },
  {
    month: 'March',
    events: [
      { date: 'Mar 8', title: 'International Women\'s Day Lecture', category: 'Seminar', color: 'bg-pink-50' },
      { date: 'Mar 15-17', title: 'Annual Research Conference', category: 'Conference', color: 'bg-indigo-50' },
      { date: 'Mar 25', title: 'Staff Retreat & Development', category: 'Event', color: 'bg-cyan-50' },
    ],
  },
  {
    month: 'April',
    events: [
      { date: 'Apr 1', title: 'New Financial Year Begins', category: 'Administrative', color: 'bg-yellow-50' },
      { date: 'Apr 10-12', title: 'Training: Policy Analysis for Beginners', category: 'Training', color: 'bg-blue-50' },
      { date: 'Apr 20', title: 'Public Lecture Series - Macroeconomics', category: 'Lecture', color: 'bg-green-50' },
    ],
  },
  {
    month: 'May',
    events: [
      { date: 'May 1', title: 'International Workers\' Day', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'May 5-7', title: 'Regional Workshop - Environmental Policy', category: 'Workshop', color: 'bg-orange-50' },
      { date: 'May 29', title: 'Democracy Day', category: 'Holiday', color: 'bg-gray-100' },
    ],
  },
  {
    month: 'June',
    events: [
      { date: 'Jun 12', title: 'Founders\' Day Celebration', category: 'Celebration', color: 'bg-rose-50' },
      { date: 'Jun 18-20', title: 'International Workshop on Research Methods', category: 'Workshop', color: 'bg-orange-50' },
      { date: 'Jun 25', title: 'Mid-Year Review Meeting', category: 'Meeting', color: 'bg-red-50' },
    ],
  },
  {
    month: 'July',
    events: [
      { date: 'Jul 1', title: 'Mid-Year Break Begins', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Jul 15-17', title: 'Crash Training: Research Proposal Writing', category: 'Training', color: 'bg-blue-50' },
      { date: 'Jul 25', title: 'Research Seminar Series Resumes', category: 'Seminar', color: 'bg-green-50' },
    ],
  },
  {
    month: 'August',
    events: [
      { date: 'Aug 5-9', title: 'Advanced Data Analytics Workshop', category: 'Workshop', color: 'bg-orange-50' },
      { date: 'Aug 15', title: 'Independence Day', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Aug 25-27', title: 'National Research Forum', category: 'Conference', color: 'bg-indigo-50' },
    ],
  },
  {
    month: 'September',
    events: [
      { date: 'Sep 10-12', title: 'Capacity Building: GIS and Spatial Analysis', category: 'Training', color: 'bg-blue-50' },
      { date: 'Sep 20', title: 'Policy Brief Launch - Agricultural Sector', category: 'Publication', color: 'bg-purple-50' },
      { date: 'Sep 28-30', title: 'Inter-institutional Research Collaboration Forum', category: 'Conference', color: 'bg-indigo-50' },
    ],
  },
  {
    month: 'October',
    events: [
      { date: 'Oct 1', title: 'National Independence Day', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Oct 8-10', title: 'Training: Gender-Sensitive Research Methods', category: 'Training', color: 'bg-blue-50' },
      { date: 'Oct 24', title: 'Quarterly Board Meeting', category: 'Meeting', color: 'bg-red-50' },
    ],
  },
  {
    month: 'November',
    events: [
      { date: 'Nov 5-7', title: 'International Seminar on Economic Policy', category: 'Seminar', color: 'bg-green-50' },
      { date: 'Nov 15', title: 'NISER Appreciation Day', category: 'Celebration', color: 'bg-rose-50' },
      { date: 'Nov 28-30', title: 'Year-End Research Symposium', category: 'Conference', color: 'bg-indigo-50' },
    ],
  },
  {
    month: 'December',
    events: [
      { date: 'Dec 10', title: 'Human Rights Day Seminar', category: 'Seminar', color: 'bg-green-50' },
      { date: 'Dec 15', title: 'Christmas Party & Awards Ceremony', category: 'Celebration', color: 'bg-rose-50' },
      { date: 'Dec 25', title: 'Christmas Day', category: 'Holiday', color: 'bg-gray-100' },
      { date: 'Dec 31', title: 'New Year\'s Eve', category: 'Holiday', color: 'bg-gray-100' },
    ],
  },
];

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

export default function CalendarPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection
          title="NISER Calendar of Activities"
          description="Comprehensive schedule of events, trainings, seminars, and important dates"
          subtitle="Plan your engagement with NISER's institutional activities throughout the year"
        />

        <div className="section">
          <div className="container">
            {/* Legend */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Activity Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(categoryColors).map(([category, colors]) => (
                  <div key={category} className={`px-4 py-3 rounded-lg border text-sm font-medium ${colors}`}>
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar by Month */}
            <div className="space-y-12">
              {calendarActivities.map((monthData, idx) => (
                <div key={idx} className="scroll-mt-20" id={monthData.month.toLowerCase()}>
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

            {/* Quick Navigation */}
            <div className="mt-16 pt-12 border-t">
              <h2 className="text-2xl font-bold mb-6">Quick Navigation</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {calendarActivities.map((monthData) => (
                  <a
                    key={monthData.month}
                    href={`#${monthData.month.toLowerCase()}`}
                    className="px-4 py-2 text-center text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-green-600 hover:text-white rounded-lg transition-colors"
                  >
                    {monthData.month.substring(0, 3)}
                  </a>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-12 p-8 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Important Notes</h3>
              <ul className="text-blue-800 space-y-2">
                <li className="flex gap-3">
                  <span className="font-bold">•</span>
                  <span>This calendar is subject to change based on operational requirements and unforeseen circumstances.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">•</span>
                  <span>For specific details about each event, please visit the Events page or contact the relevant department.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">•</span>
                  <span>Training programs require prior registration. Visit the Training page for application details.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold">•</span>
                  <span>Subscribe to our newsletter to receive updates about upcoming activities and new announcements.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
