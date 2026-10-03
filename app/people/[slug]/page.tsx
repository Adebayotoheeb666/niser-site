import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import PublicationCard from '@/components/ui/PublicationCard';
import { getOrcidProfile, type OrcidProfile } from '@/lib/orcid';
import { getResearcherBySlug, getResearchers } from '@/lib/cms/client';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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

  // Auto-sync public data from the researcher's ORCID record (cached 24h).
  let orcidProfile: OrcidProfile | null = null;
  try {
    orcidProfile = await getOrcidProfile(researcher.orcid);
  } catch {
    orcidProfile = null;
  }

  const initials = researcher.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const divisionLabel =
    (divisionLabels[researcher.division] ?? researcher.division) || 'Researcher';

  // JSON-LD structured data (Person)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: researcher.fullName,
    jobTitle: researcher.position,
    worksFor: {
      '@type': 'Organization',
      name: 'National Institute of Social and Economic Research (NISER)',
      url: 'https://niser.gov.ng',
    },
    url: `https://niser.gov.ng/people/${researcher.slug}`,
    email: researcher.email ?? undefined,
    description: researcher.biography?.slice(0, 300) ?? undefined,
    sameAs: [
      researcher.orcid ? `https://orcid.org/${researcher.orcid}` : null,
      researcher.googleScholar ?? null,
      researcher.researchGate ?? null,
      researcher.linkedin ?? null,
    ].filter(Boolean),
    telephone: researcher.phone ?? undefined,
    knowsAbout: researcher.researchInterests ?? [],
    image: researcher.photo ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection
        title={researcher.fullName}
        description={`${researcher.position} at NISER`}
        subtitle="Researcher profile and related work"
        backgroundImage="/team.png"
      />
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
                <Image
                  src={researcher.photo}
                  alt={`Photo of ${researcher.fullName}`}
                  className="profile-avatar profile-avatar--img"
                  width={104}
                  height={104}
                />
              ) : (
                <div className="profile-avatar profile-avatar--initials">{initials}</div>
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
                  <div
                    className="profile-bio"
                    dangerouslySetInnerHTML={{ __html: researcher.biography.replace(/<!--\s*wp:[\s\S]*?-->/g, '').replace(/<!--\s*\/wp:[\s\S]*?-->/g, '').trim() }}
                  />
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

              {/* ORCID auto-synced works */}
              {orcidProfile && orcidProfile.recentWorks.length > 0 && (
                <section style={{ marginTop: '2.5rem' }} aria-labelledby="orcid-heading">
                  <h2 id="orcid-heading" className="pub-detail-section-title">
                    Recent works
                    <span className="badge badge--gray" style={{ marginLeft: '0.75rem', verticalAlign: 'middle', fontSize: '0.6875rem' }}>
                      Auto-synced from ORCID
                    </span>
                  </h2>
                  <ol role="list" style={{ listStyle: 'none', margin: '1rem 0 0', padding: 0 }}>
                    {orcidProfile.recentWorks.map((work, i) => {
                      const workUrl = work.doi ? `https://doi.org/${work.doi}` : work.url;
                      const label = `${work.title}${work.year ? ` (${work.year})` : ''}`;
                      return (
                        <li
                          key={`${work.title}-${i}`}
                          style={{
                            padding: '0.875rem 0',
                            borderBottom: '1px solid var(--gray-200)',
                            fontSize: '0.9375rem',
                            lineHeight: 1.55,
                          }}
                        >
                          {workUrl ? (
                            <a href={workUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gray-800)', textDecoration: 'none' }}>
                              {label} ↗
                            </a>
                          ) : (
                            <span style={{ color: 'var(--gray-800)' }}>{label}</span>
                          )}
                          {work.doi && (
                            <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                              DOI: {work.doi}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                  {orcidProfile.worksCount > orcidProfile.recentWorks.length && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                      Showing {orcidProfile.recentWorks.length} of {orcidProfile.worksCount} works in the ORCID record.
                    </p>
                  )}
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
                  ) : null}
                  {researcher.phone ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginTop: researcher.email ? '0.75rem' : 0 }}>
                      <a href={`tel:${researcher.phone}`} style={{ color: 'var(--niser-green)' }}>
                        {researcher.phone}
                      </a>
                    </p>
                  ) : null}
                  {researcher.linkedin ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginTop: researcher.email || researcher.phone ? '0.75rem' : 0 }}>
                      <a href={researcher.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--niser-green)' }}>
                        LinkedIn profile
                      </a>
                    </p>
                  ) : null}
                  {researcher.orcid ? (
                    <>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginTop: researcher.email || researcher.phone || researcher.linkedin ? '0.75rem' : 0 }}>
                        <a href={`https://orcid.org/${researcher.orcid}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--niser-green)' }}>
                          ORCID profile
                        </a>
                      </p>
                      {orcidProfile?.affiliation && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.375rem' }}>
                          {orcidProfile.affiliation.role ? `${orcidProfile.affiliation.role}, ` : ''}
                          {orcidProfile.affiliation.name}
                          <span style={{ display: 'block', fontSize: '0.6875rem' }}>(from ORCID record)</span>
                        </p>
                      )}
                    </>
                  ) : null}
                  {!researcher.email && !researcher.phone && !researcher.linkedin && !researcher.orcid && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)' }}>
                      Contact via NISER main office
                    </p>
                  )}
                  <hr className="divider" style={{ margin: '1rem 0' }} />
                  <h3 className="profile-sidebar-heading">Division</h3>
                  {researcher.division ? (
                    <Link href={`/people?division=${researcher.division}`}
                      className="badge badge--green"
                      style={{ textDecoration: 'none', display: 'inline-flex' }}>
                      {divisionLabel}
                    </Link>
                  ) : (
                    <span className="badge badge--gray">{divisionLabel}</span>
                  )}
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

