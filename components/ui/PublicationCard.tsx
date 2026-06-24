import Link from 'next/link';
import type { Publication } from '@/types/cms';

// ─── Label maps ──────────────────────────────────────────────────────────────

const typeLabels: Record<string, string> = {
  working_paper: 'Working Paper',
  policy_brief: 'Policy Brief',
  journal_article: 'Journal Article',
  book_chapter: 'Book Chapter',
  annual_report: 'Annual Report',
  conference_paper: 'Conference Paper',
};

const typeColors: Record<string, string> = {
  working_paper: 'badge--blue',
  policy_brief: 'badge--green',
  journal_article: 'badge--purple',
  book_chapter: 'badge--teal',
  annual_report: 'badge--gold',
  conference_paper: 'badge--gray',
};

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

// ─── Component ───────────────────────────────────────────────────────────────

interface PublicationCardProps {
  publication: Publication;
  featured?: boolean;
}

export default function PublicationCard({ publication, featured = false }: PublicationCardProps) {
  const typeLabel = typeLabels[publication.publicationType] ?? publication.publicationType;
  const typeColor = typeColors[publication.publicationType] ?? 'badge--gray';
  const divisionLabel = divisionLabels[publication.researchDivision] ?? publication.researchDivision;
  const authorNames = publication.authors?.map((a) => a.fullName).join(', ') ?? '';
  const abstractExcerpt = publication.abstract
    ? publication.abstract.slice(0, 180).trimEnd() + (publication.abstract.length > 180 ? '…' : '')
    : '';

  return (
    <article className={`pub-card card ${featured ? 'pub-card--featured' : ''}`}>
      <div className="card__body pub-card__body">
        <header className="pub-card__header">
          <div className="pub-card__badges">
            <span className={`badge ${typeColor}`}>{typeLabel}</span>
            <span className="badge badge--gray">{divisionLabel}</span>
            {publication.isOpenAccess && (
              <span className="badge badge--gold" title="Open Access">⊙ Open Access</span>
            )}
          </div>

          <Link href={`/publications/${publication.slug}`} className="pub-card__title-link">
            <h3 className="pub-card__title">{publication.title}</h3>
          </Link>
        </header>

        {authorNames && (
          <p className="pub-card__authors">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true" style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {authorNames}
          </p>
        )}

        {abstractExcerpt && (
          <p className="pub-card__abstract">{abstractExcerpt}</p>
        )}

        <footer className="pub-card__footer">
          <div className="pub-card__meta">
            <time dateTime={String(publication.publishedYear)} className="pub-card__year">
              {publication.publishedYear}
            </time>
            {publication.citationCount ? (
              <span className="pub-card__citations" title="Citation count">
                {publication.citationCount} citations
              </span>
            ) : null}
          </div>
          <Link href={`/publications/${publication.slug}`} className="btn btn--ghost btn--sm pub-card__read-more">
            Read more →
          </Link>
        </footer>
      </div>
    </article>
  );
}

