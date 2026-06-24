import Link from 'next/link';
import type { Insight } from '@/types/cms';

const contentTypeLabels: Record<string, string> = {
  policy_brief: 'Policy Brief',
  commentary: 'Commentary',
  analysis: 'Analysis',
  opinion: 'Opinion',
  rapid_response: 'Rapid Response',
};

const contentTypeColors: Record<string, string> = {
  policy_brief: 'badge--green',
  commentary: 'badge--blue',
  analysis: 'badge--purple',
  opinion: 'badge--teal',
  rapid_response: 'badge--red',
};

interface InsightCardProps {
  insight: Insight;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function InsightCard({ insight }: InsightCardProps) {
  const typeLabel = contentTypeLabels[insight.contentType] ?? insight.contentType;
  const typeColor = contentTypeColors[insight.contentType] ?? 'badge--gray';
  const excerpt = insight.socialSummary ?? insight.bodyPlaintext?.slice(0, 160) ?? '';

  return (
    <article className="insight-card card">
      <div className="card__body insight-card__body">
        <header className="insight-card__header">
          <div className="insight-card__meta-top">
            <span className={`badge ${typeColor}`}>{typeLabel}</span>
            {insight.isBreaking && (
              <span className="badge badge--red insight-card__breaking">🔴 Breaking</span>
            )}
          </div>

          <Link href={`/insights/${insight.slug}`} className="insight-card__title-link">
            <h3 className="insight-card__title">{insight.title}</h3>
          </Link>
        </header>

        {excerpt && (
          <p className="insight-card__excerpt">
            {excerpt.length > 160 ? excerpt.slice(0, 160) + '…' : excerpt}
          </p>
        )}

        <footer className="insight-card__footer">
          <div className="insight-card__byline">
            {insight.author && (
              <>
                <div className="insight-card__author-avatar" aria-hidden="true">
                  {insight.author.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="insight-card__author-info">
                  <span className="insight-card__author-name">{insight.author.fullName}</span>
                  <time dateTime={insight.publishedDate} className="insight-card__date">
                    {formatDate(insight.publishedDate)}
                  </time>
                </div>
              </>
            )}
          </div>
          <Link href={`/insights/${insight.slug}`} className="btn btn--ghost btn--sm insight-card__cta">
            Read →
          </Link>
        </footer>
      </div>
    </article>
  );
}

