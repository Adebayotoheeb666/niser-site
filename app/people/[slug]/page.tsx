import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicationCard from '@/components/ui/PublicationCard';
import { getResearcherBySlug, getResearchers } from '@/lib/cms/client';

export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const researchers = await getResearchers({ active: true });
  return researchers.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const researcher = await getResearcherBySlug(params.slug);
  if (!researcher) return { title: 'Researcher Not Found' };
  return {
    title: researcher.fullName,
    description: `${researcher.position} at NISER — ${researcher.biography?.slice(0, 120) ?? ''}`,
  };
}

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Dev.',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

export default async function ResearcherProfilePage({ params }: PageProps) {
  const researcher = await getResearcherBySlug(params.slug);
  if (!researcher) notFound();

  const initials = researcher.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const divisionLabel = divisionLabels[researcher.division] ?? researcher.division;

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/people">Researchers</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{researcher.fullName}</li>
            </ol>
          </div>
        </nav>

        {/* Profile header */}
        <div className="profile-header">
          <div className="container profile-header__inner">
            {/* Avatar */}
            <div className="profile-header__avatar-wrap">
              {researcher.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={researcher.photo}
                  alt={`Photo of ${researcher.fullName}`}
                  className="profile-avatar profile-avatar--img"
                />
              ) : (
                <div className="profile-avatar profile-avatar--initials" aria-hidden="true">
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="profile-header__info">
              {researcher.titlePrefix && (
                <span className="profile-header__prefix">{researcher.titlePrefix}.</span>
              )}
              <h1 className="profile-header__name">{researcher.fullName}</h1>
              <p className="profile-header__position">{researcher.position}</p>
              <div className="profile-header__badges">
                <span className="badge badge--gold">{divisionLabel}</span>
                {!researcher.isActive && <span className="badge badge--gray">Former Researcher</span>}
              </div>

              {/* External links */}
              <div className="profile-header__links">
                {researcher.orcid && (
                  <a href={`https://orcid.org/${researcher.orcid}`} target="_blank" rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm profile-ext-link">
                    ORCID ↗
                  </a>
                )}
                {researcher.googleScholar && (
                  <a href={researcher.googleScholar} target="_blank" rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm profile-ext-link">
                    Google Scholar ↗
                  </a>
                )}
                {researcher.researchGate && (
                  <a href={researcher.researchGate} target="_blank" rel="noopener noreferrer"
                    className="btn btn--ghost btn--sm profile-ext-link">
                    ResearchGate ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="section">
          <div className="container profile-body">
            {/* Main content */}
            <div className="profile-main">
              {/* Biography */}
              {researcher.biography && (
                <section aria-labelledby="bio-heading">
                  <h2 id="bio-heading" className="profile-section-title">Biography</h2>
                  <div className="profile-bio">
                    <p>{researcher.biography}</p>
                  </div>
                </section>
              )}

              {/* Research interests */}
              {researcher.researchInterests && researcher.researchInterests.length > 0 && (
                <section aria-labelledby="interests-heading" style={{ marginTop: '2rem' }}>
                  <h2 id="interests-heading" className="profile-section-title">Research Interests</h2>
                  <div className="profile-interests">
                    {researcher.researchInterests.map((interest) => (
                      <span key={interest} className="badge badge--green">{interest}</span>
                    ))}
                  </div>
                </section>
              )}

              {/* Selected publications */}
              {researcher.selectedPublications && researcher.selectedPublications.length > 0 && (
                <section aria-labelledby="pubs-heading" style={{ marginTop: '2.5rem' }}>
                  <h2 id="pubs-heading" className="profile-section-title">Selected Publications</h2>
                  <div className="grid--2">
                    {researcher.selectedPublications.map((pub) => (
                      <PublicationCard key={pub.id} publication={pub} />
                    ))}
                  </div>
                  <Link href={`/publications?author=${researcher.slug}`}
                    className="btn btn--outline profile-view-all-pubs">
                    View all publications by {researcher.fullName} →
                  </Link>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="profile-sidebar" aria-label="Contact information">
              <div className="card">
                <div className="card__body">
                  <h3 className="profile-sidebar-heading">Contact</h3>
                  {researcher.email ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>
                      <a href={`mailto:${researcher.email}`} style={{ color: 'var(--niser-green)' }}>
                        {researcher.email}
                      </a>
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                      Contact via NISER main office
                    </p>
                  )}
                  <hr className="divider" style={{ margin: '1rem 0' }} />
                  <h3 className="profile-sidebar-heading">Division</h3>
                  <Link href={`/people?division=${researcher.division}`}
                    className="badge badge--green"
                    style={{ textDecoration: 'none', display: 'inline-flex' }}>
                    {divisionLabel}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

