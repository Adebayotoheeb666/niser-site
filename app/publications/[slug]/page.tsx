import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPublicationBySlug, getPublications } from '@/lib/cms/client';

export const revalidate = 0;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const pubs = await getPublications({ limit: 100 });
  return pubs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pub = await getPublicationBySlug(params.slug);
  if (!pub) return { title: 'Publication Not Found' };
  return {
    title: pub.title,
    description: pub.abstract?.slice(0, 160),
    openGraph: {
      title: pub.title,
      description: pub.abstract?.slice(0, 160),
      type: 'article',
    },
  };
}

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
  poverty_social: 'Poverty & Social Dev.',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

export default async function PublicationDetailPage({ params }: PageProps) {
  const pub = await getPublicationBySlug(params.slug);
  if (!pub) notFound();

  const typeLabel = typeLabels[pub.publicationType] ?? pub.publicationType;
  const typeColor = typeColors[pub.publicationType] ?? 'badge--gray';
  const divisionLabel = divisionLabels[pub.researchDivision] ?? pub.researchDivision;

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="pub-detail-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">›</li>
              <li><Link href="/publications">Publications</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{pub.title.slice(0, 50)}…</li>
            </ol>
          </div>
        </nav>

        {/* Publication header */}
        <div className="pub-detail-header">
          <div className="container">
            <div className="pub-detail-header__badges">
              <span className={`badge ${typeColor}`}>{typeLabel}</span>
              <span className="badge badge--gray">{divisionLabel}</span>
              {pub.isOpenAccess && <span className="badge badge--gold">⊙ Open Access</span>}
            </div>
            <h1 className="pub-detail-title">{pub.title}</h1>

            {/* Authors */}
            {pub.authors?.length > 0 && (
              <div className="pub-detail-authors">
                {pub.authors.map((author) => (
                  <Link
                    key={author.id}
                    href={`/people/${author.slug}`}
                    className="pub-detail-author-chip"
                  >
                    <div className="pub-detail-author-avatar" aria-hidden="true">
                      {author.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <span>{author.fullName}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Meta row */}
            <div className="pub-detail-meta">
              {pub.publishedYear && (
                <span className="pub-detail-meta__item">
                  📅 Published: <strong>{pub.publishedYear}</strong>
                </span>
              )}
              {pub.citationCount ? (
                <span className="pub-detail-meta__item">
                  📖 Citations: <strong>{pub.citationCount}</strong>
                </span>
              ) : null}
              {pub.doi && (
                <span className="pub-detail-meta__item">
                  DOI:{' '}
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-detail-doi"
                  >
                    {pub.doi}
                  </a>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="section">
          <div className="container pub-detail-body">
            <div className="pub-detail-main">
              {/* Abstract */}
              <section aria-labelledby="abstract-heading">
                <h2 id="abstract-heading" className="pub-detail-section-title">Abstract</h2>
                <div className="pub-detail-abstract">
                  <p>{pub.abstract}</p>
                </div>
              </section>

              {/* Keywords */}
              {pub.keywords?.length > 0 && (
                <section aria-labelledby="keywords-heading" style={{ marginTop: '2rem' }}>
                  <h2 id="keywords-heading" className="pub-detail-section-title">Keywords</h2>
                  <div className="pub-detail-keywords">
                    {pub.keywords.map((kw) => (
                      <span key={kw} className="badge badge--gray">{kw}</span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="pub-detail-sidebar" aria-label="Publication details and download">
              <div className="card pub-detail-sidebar__card">
                <div className="card__body">
                  <h3 className="pub-detail-sidebar__heading">Download</h3>
                  {pub.pdfFile ? (
                    <a
                      href={pub.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      download
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                      </svg>
                      Download PDF
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                      PDF not available
                    </p>
                  )}

                  <hr className="divider" style={{ margin: '1.25rem 0' }} />
                  <h3 className="pub-detail-sidebar__heading">Details</h3>
                  <dl className="pub-detail-dl">
                    <dt>Type</dt>
                    <dd><span className={`badge ${typeColor}`}>{typeLabel}</span></dd>
                    <dt>Division</dt>
                    <dd>{divisionLabel}</dd>
                    <dt>Year</dt>
                    <dd>{pub.publishedYear}</dd>
                    <dt>Open Access</dt>
                    <dd>{pub.isOpenAccess ? '✓ Yes' : '✗ No'}</dd>
                  </dl>

                  {/* Cite */}
                  <hr className="divider" style={{ margin: '1.25rem 0' }} />
                  <h3 className="pub-detail-sidebar__heading">Cite</h3>
                  <div className="pub-detail-cite-block">
                    <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                      {pub.authors?.map((a) => a.fullName).join(', ')} ({pub.publishedYear}).{' '}
                      <em>{pub.title}</em>. NISER.
                      {pub.doi && ` https://doi.org/${pub.doi}`}
                    </p>
                  </div>
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

