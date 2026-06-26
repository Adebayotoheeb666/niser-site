import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import PublicationCard from '@/components/ui/PublicationCard';
import { getPublications } from '@/lib/cms/client';
import type { PublicationType, ResearchDivision } from '@/types/cms';

export const revalidate = 0; // On-demand ISR via webhook

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Browse NISER\'s complete archive of working papers, policy briefs, journal articles, and annual reports.',
};

const publicationTypes: { value: PublicationType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'working_paper', label: 'Working Papers' },
  { value: 'policy_brief', label: 'Policy Briefs' },
  { value: 'journal_article', label: 'Journal Articles' },
  { value: 'book_chapter', label: 'Book Chapters' },
  { value: 'annual_report', label: 'Annual Reports' },
  { value: 'conference_paper', label: 'Conference Papers' },
];

const divisions: { value: ResearchDivision | ''; label: string }[] = [
  { value: '', label: 'All Divisions' },
  { value: 'macroeconomics', label: 'Macroeconomics' },
  { value: 'poverty_social', label: 'Poverty & Social Dev.' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'governance', label: 'Governance' },
  { value: 'industry', label: 'Industry' },
];

interface PublicationsPageProps {
  searchParams: { type?: string; division?: string; year?: string };
}

export default async function PublicationsPage({ searchParams }: PublicationsPageProps) {
  const typeFilter = (searchParams.type as PublicationType) || undefined;
  const divisionFilter = (searchParams.division as ResearchDivision) || undefined;
  const yearFilter = searchParams.year ? Number(searchParams.year) : undefined;

  const publications = await getPublications({
    limit: 30,
    type: typeFilter,
    division: divisionFilter,
    year: yearFilter,
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection
          title="Publications"
          description="Browse NISER's complete archive of research outputs"
          subtitle="Working papers, policy briefs, journal articles, and more"
        />
        <div className="section">
          <div className="container">
            {/* Filter bar */}
            <form className="pub-filters" method="GET" aria-label="Filter publications">
              <div className="pub-filters__group">
                <label htmlFor="type-filter" className="pub-filters__label">Type</label>
                <select
                  id="type-filter"
                  name="type"
                  defaultValue={searchParams.type ?? ''}
                  className="input select pub-filters__select"
                >
                  {publicationTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="pub-filters__group">
                <label htmlFor="division-filter" className="pub-filters__label">Division</label>
                <select
                  id="division-filter"
                  name="division"
                  defaultValue={searchParams.division ?? ''}
                  className="input select pub-filters__select"
                >
                  {divisions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="pub-filters__group">
                <label htmlFor="year-filter" className="pub-filters__label">Year</label>
                <select
                  id="year-filter"
                  name="year"
                  defaultValue={searchParams.year ?? ''}
                  className="input select pub-filters__select"
                >
                  <option value="">All Years</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn--primary pub-filters__submit">
                Filter
              </button>
              <a href="/publications" className="btn btn--ghost pub-filters__clear">
                Clear
              </a>
            </form>

            {/* Results count */}
            <p className="pub-results-count" role="status" aria-live="polite">
              {publications.length} publication{publications.length !== 1 ? 's' : ''} found
            </p>

            {/* Grid */}
            {publications.length > 0 ? (
              <div className="grid--3">
                {publications.map((pub, idx) => (
                  <div key={pub.id} className="animate-slide-up" style={{ animationDelay: `${(idx % 9) * 50}ms` }}>
                    <PublicationCard publication={pub} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="pub-empty">
                <p>No publications match your current filters.</p>
                <a href="/publications" className="btn btn--outline" style={{ marginTop: '1rem' }}>
                  Clear filters
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
