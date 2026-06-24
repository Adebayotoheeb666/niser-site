import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ResearcherCard from '@/components/ui/ResearcherCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { getResearchers } from '@/lib/cms/client';
import type { ResearchDivision } from '@/types/cms';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Researchers',
  description:
    'Meet the researchers and scholars at NISER. Browse profiles by research division, expertise, and publications.',
};

const divisionTabs: { value: ResearchDivision | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'macroeconomics', label: 'Macroeconomics' },
  { value: 'poverty_social', label: 'Poverty & Social' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'governance', label: 'Governance' },
  { value: 'industry', label: 'Industry' },
];

interface PeoplePageProps {
  searchParams: { division?: string };
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const divisionFilter = (searchParams.division as ResearchDivision) || undefined;
  const researchers = await getResearchers({ active: true, division: divisionFilter });

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Page header */}
        <div className="people-page-hero">
          <div className="container">
            <h1 className="people-page-hero__title">Our Researchers</h1>
            <p className="people-page-hero__desc">
              NISER&apos;s multidisciplinary team of economists, sociologists, agronomists,
              and policy analysts driving Nigeria&apos;s research agenda.
            </p>
          </div>
        </div>

        <div className="section">
          <div className="container">
            {/* Division filter tabs */}
            <nav className="people-tabs" aria-label="Filter by division">
              {divisionTabs.map((tab) => {
                const isActive = (searchParams.division ?? '') === tab.value;
                const href = tab.value ? `/people?division=${tab.value}` : '/people';
                return (
                  <a
                    key={tab.value}
                    href={href}
                    className={`people-tab ${isActive ? 'people-tab--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>

            {/* Results */}
            <SectionHeader
              title={
                divisionFilter
                  ? `${divisionTabs.find((t) => t.value === divisionFilter)?.label ?? divisionFilter} Researchers`
                  : 'All Researchers'
              }
              description={`${researchers.length} researcher${researchers.length !== 1 ? 's' : ''}`}
            />

            {researchers.length > 0 ? (
              <div className="grid--3">
                {researchers.map((researcher) => (
                  <ResearcherCard key={researcher.id} researcher={researcher} />
                ))}
              </div>
            ) : (
              <div className="people-empty">
                <p>No researchers found in this division.</p>
                <a href="/people" className="btn btn--outline" style={{ marginTop: '1rem' }}>
                  View all researchers
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

