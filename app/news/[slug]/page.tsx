import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialShare from '@/components/ui/SocialShare';
import { getNews, getNewsBySlug } from '@/lib/cms/client';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const news = await getNews({ limit: 100 });
    return news.map((n) => ({ slug: n.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getNewsBySlug(params.slug);
  if (!item) return { title: 'News Not Found' };
  return {
    title: `${item.title} | NISER News`,
    description: item.summary?.slice(0, 160) ?? undefined,
    openGraph: item.featuredImage
      ? { images: [{ url: item.featuredImage }] }
      : undefined,
  };
}

const categoryLabels: Record<string, string> = {
  institutional: 'Institutional Update',
  media: 'Media Mention',
  external: 'External Publication',
};

const categoryColors: Record<string, string> = {
  institutional: 'badge--green',
  media: 'badge--blue',
  external: 'badge--teal',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-NG', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(dateStr));
  } catch { return dateStr; }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  const categoryLabel = categoryLabels[item.category] ?? 'News';
  const categoryColor = categoryColors[item.category] ?? 'badge--gray';
  const pageUrl = `https://niser.gov.ng/news/${item.slug}`;
  const isExternalOnly = Boolean(item.externalUrl?.trim()) && !item.body;

  // JSON-LD structured data (NewsArticle)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.summary ?? undefined,
    datePublished: item.publishedDate || undefined,
    image: item.featuredImage ? [item.featuredImage] : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'National Institute of Social and Economic Research (NISER)',
      url: 'https://niser.gov.ng',
    },
    mainEntityOfPage: pageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="pub-detail-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li><Link href="/news">News</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li aria-current="page">{item.title.slice(0, 50)}{item.title.length > 50 ? '…' : ''}</li>
            </ol>
          </div>
        </nav>

        {/* Article header */}
        <div className="insight-detail-header">
          <div className="container">
            <div className="insight-detail-header__badges">
              <span className={`badge ${categoryColor}`}>{categoryLabel}</span>
            </div>
            <h1 className="insight-detail-title">{item.title}</h1>
            <time dateTime={item.publishedDate} className="insight-detail-date">
              📅 {formatDate(item.publishedDate)}
            </time>
            {item.summary && <p className="insight-detail-summary">{item.summary}</p>}
          </div>
        </div>

        {/* Featured image */}
        {item.featuredImage && (
          <div className="container" style={{ marginTop: '-1rem' }}>
            <div
              style={{
                position: 'relative', width: '100%', maxWidth: '880px',
                margin: '0 auto', aspectRatio: '16 / 9',
                borderRadius: '12px', overflow: 'hidden',
              }}
            >
              <Image
                src={item.featuredImage}
                alt={item.title}
                fill
                sizes="(max-width: 880px) 100vw, 880px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        )}

        {/* Article body */}
        <div className="section">
          <div className="container insight-detail-body">
            <article className="insight-article">
              {isExternalOnly && item.externalUrl && (
                <p style={{ marginBottom: '1.5rem' }}>
                  This story was published externally.
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary btn--sm"
                    style={{ marginLeft: '0.75rem' }}
                  >
                    Read on the source site ↗
                  </a>
                </p>
              )}

              {item.body ? (
                <div className="insight-article__content">
                  {item.body.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : !isExternalOnly ? (
                <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                  Full story details will be published shortly.
                </p>
              ) : null}

              <SocialShare url={pageUrl} title={item.title} />

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link href="/news" className="btn btn--outline">← Back to all news</Link>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
