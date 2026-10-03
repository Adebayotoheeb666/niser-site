'use client';

import { useState, useMemo } from 'react';
import type { CMSEvent } from '@/types/cms';
import EventCard from '@/components/ui/EventCard';
import SectionHeader from '@/components/ui/SectionHeader';

interface EventsFilterProps {
  upcoming: CMSEvent[];
  past: CMSEvent[];
}

type EventTypeFilter = 'all' | 'seminar' | 'workshop' | 'conference' | 'webinar';

const TYPE_LABELS: Record<EventTypeFilter, string> = {
  all: 'All Types',
  seminar: 'Seminar',
  workshop: 'Workshop',
  conference: 'Conference',
  webinar: 'Webinar',
};

function downloadICal(slug: string, title: string) {
  const a = document.createElement('a');
  a.href = `/api/data/ical?id=${encodeURIComponent(slug)}`;
  a.download = `${slug}.ics`;
  a.setAttribute('aria-label', `Download iCal for ${title}`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function EventsFilter({ upcoming, past }: EventsFilterProps) {
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  // Derive unique months from all events
  const allEvents = useMemo(() => [...upcoming, ...past], [upcoming, past]);
  const months = useMemo(() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [{ value: 'all', label: 'All Months' }];
    allEvents.forEach((e) => {
      try {
        const d = new Date(e.startDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({
            value: key,
            label: d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }),
          });
        }
      } catch { /* skip invalid dates */ }
    });
    return result;
  }, [allEvents]);

  const filter = (evts: CMSEvent[]) =>
    evts.filter((e) => {
      const typeOk = typeFilter === 'all' || e.eventType === typeFilter;
      const monthOk = monthFilter === 'all' || (() => {
        try {
          const d = new Date(e.startDate);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === monthFilter;
        } catch { return false; }
      })();
      return typeOk && monthOk;
    });

  const filteredUpcoming = filter(upcoming);
  const filteredPast = filter(past);
  const hasResults = filteredUpcoming.length > 0 || filteredPast.length > 0;

  return (
    <>
      {/* Filter bar */}
      <div className="events-filter-bar" aria-label="Filter events">
        {/* Type filter */}
        <div className="events-filter-bar__group" role="group" aria-label="Filter by event type">
          {(Object.keys(TYPE_LABELS) as EventTypeFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`events-filter-btn${typeFilter === t ? ' events-filter-btn--active' : ''}`}
              aria-pressed={typeFilter === t}
              onClick={() => setTypeFilter(t)}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Month filter */}
        <div className="events-filter-bar__select-wrap">
          <label htmlFor="month-filter" className="sr-only">Filter by month</label>
          <select
            id="month-filter"
            className="events-filter-select"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {!hasResults && (
        <div className="events-empty" style={{ marginTop: '2rem' }}>
          <p>No events match your filters. Try changing the type or month.</p>
        </div>
      )}

      {/* Upcoming */}
      {filteredUpcoming.length > 0 && (
        <>
          <SectionHeader
            title="Upcoming Events"
            description={`${filteredUpcoming.length} event${filteredUpcoming.length !== 1 ? 's' : ''} coming up`}
          />
          <div className="grid--2" style={{ marginBottom: '3rem' }}>
            {filteredUpcoming.map((evt, idx) => (
              <div key={evt.id} className="animate-slide-up" style={{ animationDelay: `${(idx % 4) * 50}ms` }}>
                <EventCard event={evt} />
                {evt.slug && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm events-ical-btn"
                    onClick={() => downloadICal(evt.slug, evt.title)}
                    aria-label={`Add "${evt.title}" to calendar`}
                    title="Download iCal (.ics)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Add to Calendar
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Past */}
      {filteredPast.length > 0 && (
        <>
          <SectionHeader
            title="Past Events"
            description="Browse recordings and materials from previous NISER events."
          />
          <div className="grid--2">
            {filteredPast.map((evt, idx) => (
              <div key={evt.id} className="animate-slide-up" style={{ animationDelay: `${(idx % 4) * 50}ms` }}>
                <EventCard event={evt} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
