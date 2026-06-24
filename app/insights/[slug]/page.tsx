import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getInsightBySlug, getInsights } from '@/lib/cms/client';

export const revalidate = 21600;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const insights = await getInsights({ limit: 100 });
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return { title: 'Insight Not Found' };
  return {
    title: insight.title,
    description: insight.socialSummary ?? insight.bodyPlaintext?.slice(0, 160),
    openGraph: { title: insight.title, type: 'article' },
  };
}

const typeLabels: Record<string, string> = {
  policy_brief: 'Policy Brief',
  commentary: 'Commentary',
  analysis: 'Analysis',
  opinion: 'Opinion',
  rapid_response: 'Rapid Response',
};

const typeColors: Record<string, string> = {
  policy_brief: 'badge--green',
  commentary: 'badge--blue',
  analysis: 'badge--purple',
  opinion: 'badge--teal',
  rapid_response: 'badge--red',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
  } catch { return dateStr; }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  const typeLabel = typeLabels[insight.contentType] ?? insight.contentType;
  const typeColor = typeColors[insight.contentType] ?? 'badge--gray';

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
              <li><Link href="/insights">Insights</Link></li>
              <li aria-hidden="true">›</li>
              <li aria-current="page">{insight.title.slice(0, 50)}…</li>
            </ol>
          </div>
        </nav>

        {/* Article header */}
        <div className="insight-detail-header">
          <div className="container">
            <div className="insight-detail-header__badges">
              <span className={`badge ${typeColor}`}>{typeLabel}</span>
              {insight.isBreaking && <span className="badge badge--red">🔴 Breaking</span>}
              {insight.aiGenerated && (
                <span className="badge badge--gray" title="Draft generated with AI assistance, approved by researcher">
                  AI-Assisted
                </span>
              )}
            </div>
            <h1 className="insight-detail-title">{insight.title}</h1>

            {insight.author && (
              <div className="insight-detail-byline">
                <div className="insight-detail-avatar" aria-hidden="true">
                  {insight.author.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <Link href={`/people/${insight.author.slug}`} className="insight-detail-author-link">
                    {insight.author.fullName}
                  </Link>
                  <time dateTime={insight.publishedDate} className="insight-detail-date">
                    {formatDate(insight.publishedDate)}
                  </time>
                </div>
              </div>
            )}

            {insight.socialSummary && (
              <p className="insight-detail-summary">{insight.socialSummary}</p>
            )}
          </div>
        </div>

        {/* Article body */}
        <div className="section">
          <div className="container insight-detail-body">
            <article className="insight-article">
              {insight.bodyPlaintext ? (
                <div className="insight-article__content">
                  {insight.bodyPlaintext.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                  Full article content is available in the downloadable PDF version.
                </p>
              )}

              {/* Tags */}
              {insight.tags && insight.tags.length > 0 && (
                <div className="insight-article__tags" aria-label="Topics">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="badge badge--gray">{tag}</span>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

