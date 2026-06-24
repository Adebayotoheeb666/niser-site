import Link from 'next/link';
import type { Researcher } from '@/types/cms';

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Dev.',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

interface ResearcherCardProps {
  researcher: Researcher;
}

export default function ResearcherCard({ researcher }: ResearcherCardProps) {
  const initials = researcher.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const divisionLabel =
    divisionLabels[researcher.division] ?? researcher.division;

  return (
    <article className="researcher-card card">
      <div className="card__body researcher-card__body">
        {/* Avatar */}
        <div className="researcher-card__avatar-wrap">
          {researcher.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={researcher.photo}
              alt={`Photo of ${researcher.fullName}`}
              className="researcher-card__avatar researcher-card__avatar--img"
            />
          ) : (
            <div
              className="researcher-card__avatar researcher-card__avatar--initials"
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="researcher-card__info">
          {researcher.titlePrefix && (
            <span className="researcher-card__prefix">{researcher.titlePrefix}.</span>
          )}
          <Link href={`/people/${researcher.slug}`} className="researcher-card__name-link">
            <h3 className="researcher-card__name">{researcher.fullName}</h3>
          </Link>
          <p className="researcher-card__position">{researcher.position}</p>
          <span className="badge badge--green researcher-card__division">
            {divisionLabel}
          </span>

          {researcher.researchInterests && researcher.researchInterests.length > 0 && (
            <ul className="researcher-card__interests" role="list" aria-label="Research interests">
              {researcher.researchInterests.slice(0, 3).map((interest) => (
                <li key={interest}>
                  <span className="badge badge--gray">{interest}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Links */}
        <div className="researcher-card__links">
          <Link href={`/people/${researcher.slug}`} className="btn btn--outline btn--sm">
            View Profile
          </Link>
          {researcher.orcid && (
            <a
              href={`https://orcid.org/${researcher.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost btn--sm researcher-card__orcid"
              aria-label={`${researcher.fullName} on ORCID`}
            >
              ORCID ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

