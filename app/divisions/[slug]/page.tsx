import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import PublicationCard from '@/components/ui/PublicationCard';
import {
  getDivisionBySlug,
  getDivisions,
  getInsights,
  getPublications,
  getResearchers,
} from '@/lib/cms/client';

export const revalidate = 86400;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const divisions = await getDivisions();
    return divisions.map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const division = await getDivisionBySlug(params.slug);
  if (!division) return { title: 'Division Not Found' };
  return {
    title: `${division.name} | NISER`,
    description: division.description?.slice(0, 160) ?? undefined,
  };
}

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomic Policy Division',
  poverty_social: 'Poverty & Social Development Division',
  agriculture: 'Agriculture & Food Policy Division',
  governance: 'Governance & Institutions Division',
  industry: 'Industry & Enterprise Division',
};

function initials(name?: string): string {
  if (!name) return '';
  return name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('');
}

export default async function DivisionLandingPage({ params }: PageProps) {
  const division = await getDivisionBySlug(params.slug);
  if (!division) notFound();

  const [researchers, publications, insights] = await Promise.all([
    getResearchers({ division: division.slug as never }).catch(() => []),
    getPublications({ division: division.slug as never, limit: 6 }).catch(() => []),
    getInsights({ limit: 20 }).catch(() => []),
  ]);

  const divisionInsights = insights.filter(
    (i) => !division.slug || i.contentType === 'policy_brief',
  ).slice(0, 3);

  const team = researchers.length > 0
    ? researchers
    : (division.researchers ?? []).map((r) => ({
        id: r.id ?? r.slug,
        fullName: r.fullName,
        slug: r.slug ?? '',
        titlePrefix: r.titlePrefix,
        position: '',
        division: division.slug as never,
        isActive: true,
        status: 'published' as const,
      }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: `${division.name} — National Institute of Social and Economic Research`,
    url: `https://niser.gov.ng/divisions/${division.slug}`,
    description: division.description ?? undefined,
    parentOrganization: {
      '@type': 'Organization',
      name: 'National Institute of Social and Economic Research (NISER)',
      url: 'https://niser.gov.ng',
    },
    employee: team.slice(0, 20).map((r) => ({ '@type': 'Person', name: r.fullName })),
  };

  const heading = divisionLabels[division.slug] ?? division.name;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection
        title={division.name}
        description={division.description ?? 'Research that informs national policy.'}
        subtitle="Research division"
        backgroundImage="/team.png"
      />
      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="pub-detail-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li><Link href="/divisions">Divisions</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li aria-current="page">{heading}</li>
            </ol>
          </div>
        </nav>

        {/* About */}
        <div className="section">
          <div className="container">
            <div className="pub-detail-body" style={{ display: 'block' }}>
              <section aria-labelledby="about-division-heading">
                <h2 id="about-division-heading" className="pub-detail-section-title">About this division</h2>
                <div className="pub-detail-abstract">
                  {division.description ? (
                    division.description.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>
                    ))
                  ) : (
                    <p>The {heading} conducts policy-relevant research to inform national development.</p>
                  )}
                </div>
                {(division.activeProjectsCount != null || division.email) && (
                  <dl className="pub-detail-dl" style={{ marginTop: '1.5rem', maxWidth: '480px' }}>
                    {division.activeProjectsCount != null && (
                      <>
                        <dt>Active projects</dt>
                        <dd>{division.activeProjectsCount}</dd>
                      </>
                    )}
                    {division.email && (
                      <>
                        <dt>Contact</dt>
                        <dd><a href={`mailto:${division.email}`} style={{ color: 'var(--niser-green)' }}>{division.email}</a></dd>
                      </>
                    )}
                  </dl>
                )}
              </section>

              {/* Team */}
              <section style={{ marginTop: '3rem' }} aria-labelledby="team-heading">
                <div className="home-section__head">
                  <h2 id="team-heading" className="pub-detail-section-title">Team</h2>
                  <Link href={`/people?division=${division.slug}`} className="home-link">
                    View all researchers &rarr;
                  </Link>
                </div>
                {team.length > 0 ? (
                  <ul className="home-topics__list" role="list" style={{ listStyle: 'none' }}>
                    {team.slice(0, 8).map((r) => (
                      <li key={r.id}>
                        <Link href={`/people/${r.slug}`} className="home-topics__row">
                          <span className="home-topics__num" aria-hidden="true">{initials(r.fullName)}</span>
                          <span className="home-topics__body">
                            <span className="home-topics__title">
                              {'titlePrefix' in r && r.titlePrefix ? `${r.titlePrefix}. ` : ''}{r.fullName}
                            </span>
                            <span className="home-topics__desc">{r.position ?? 'Researcher'}</span>
                          </span>
                          <span className="home-topics__arrow" aria-hidden="true">&rarr;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-msg">Team profiles for this division are being updated.</p>
                )}
              </section>

              {/* Projects summary */}
              {division.activeProjectsCount ? (
                <section style={{ marginTop: '3rem' }} aria-labelledby="projects-heading">
                  <h2 id="projects-heading" className="pub-detail-section-title">Current work</h2>
                  <p style={{ color: 'var(--gray-600)', marginTop: '0.75rem' }}>
                    This division is currently running {division.activeProjectsCount} active research project{division.activeProjectsCount === 1 ? '' : 's'}.
                    Explore project portfolios on the{' '}
                    <Link href="/research" style={{ color: 'var(--niser-green)' }}>research projects</Link> page.
                  </p>
                </section>
              ) : null}
            </div>

            {/* Publications */}
            <section style={{ marginTop: '3rem' }} aria-labelledby="division-pubs-heading">
              <div className="home-section__head">
                <div>
                  <span className="home-eyebrow">From this division</span>
                  <h2 id="division-pubs-heading" className="home-section__title">
                    Recent publications
                  </h2>
                </div>
                <Link href={`/publications?division=${division.slug}`} className="home-link">
                  View all &rarr;
                </Link>
              </div>
              {publications.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {publications.map((pub) => (
                    <PublicationCard key={pub.id} publication={pub} />
                  ))}
                </div>
              ) : (
                <p className="empty-msg">Recent publications are being catalogued.</p>
              )}
            </section>

            {/* Related insights */}
            {divisionInsights.length > 0 && (
              <section style={{ marginTop: '3rem' }} aria-labelledby="division-insights-heading">
                <div className="home-section__head">
                  <div>
                    <span className="home-eyebrow">Policy commentary</span>
                    <h2 id="division-insights-heading" className="home-section__title">
                      Latest insights
                    </h2>
                  </div>
                  <Link href="/insights" className="home-link">View all &rarr;</Link>
                </div>
                <ul className="home-news__list" role="list">
                  {divisionInsights.map((ins) => (
                    <li key={ins.id}>
                      <Link href={`/insights/${ins.slug}`} className="home-news__row">
                        <span className="home-news__date">{ins.publishedDate?.slice(0, 10)}</span>
                        <span className="home-news__body">
                          <span className="home-news__title">{ins.title}</span>
                          {ins.socialSummary && <span className="home-news__summary">{ins.socialSummary}</span>}
                        </span>
                        <span className="home-news__arrow" aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
