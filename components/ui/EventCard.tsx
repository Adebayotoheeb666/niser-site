import Link from 'next/link';
import type { CMSEvent } from '@/types/cms';

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

interface EventCardProps {
  event: CMSEvent;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  try { return new Date(dateStr); } catch { return null; }
}

export default function EventCard({ event }: EventCardProps) {
  const typeLabel = eventTypeLabels[event.eventType] ?? event.eventType;
  const typeColor = eventTypeColors[event.eventType] ?? 'badge--gray';
  const startDate = parseDate(event.startDate);
  const isPast = startDate ? startDate < new Date() : false;

  const month = startDate
    ? new Intl.DateTimeFormat('en', { month: 'short' }).format(startDate)
    : '';
  const day = startDate
    ? new Intl.DateTimeFormat('en', { day: 'numeric' }).format(startDate)
    : '';
  const fullDate = startDate
    ? new Intl.DateTimeFormat('en-NG', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }).format(startDate)
    : '';

  const speakerNames = event.speakers?.map((s) => s.fullName).join(', ') ?? '';

  return (
    <article className={`event-card card ${isPast ? 'event-card--past' : ''}`}>
      <div className="event-card__layout">
        {/* Date callout */}
        <div className="event-card__date-block" aria-label={fullDate}>
          <span className="event-card__month" aria-hidden="true">{month}</span>
          <span className="event-card__day" aria-hidden="true">{day}</span>
          {isPast && <span className="event-card__past-label">Past</span>}
        </div>

        {/* Content */}
        <div className="event-card__content">
          <div className="event-card__badges">
            <span className={`badge ${typeColor}`}>{typeLabel}</span>
            {event.isOnline ? (
              <span className="badge badge--teal">🌐 Online</span>
            ) : event.location ? (
              <span className="badge badge--gray">{event.location}</span>
            ) : null}
          </div>

          <Link href={`/events/${event.slug}`} className="event-card__title-link">
            <h3 className="event-card__title">{event.title}</h3>
          </Link>

          {event.summary && (
            <p className="event-card__summary">{event.summary.slice(0, 120)}…</p>
          )}

          {speakerNames && (
            <p className="event-card__speakers">Speakers: {speakerNames}</p>
          )}

          {!isPast && event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary btn--sm event-card__register"
            >
              Register →
            </a>
          )}
          {isPast && event.recordingUrl && (
            <a
              href={event.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline btn--sm event-card__recording"
            >
              ▶ Watch Recording
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

