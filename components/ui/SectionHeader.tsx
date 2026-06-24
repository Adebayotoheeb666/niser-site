import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  description?: string;
}

export default function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  description,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="section-header__left">
        <h2 className="section-header__title">{title}</h2>
        {description && <p className="section-header__desc">{description}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="btn btn--outline btn--sm section-header__link">
          {viewAllLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  );
}

