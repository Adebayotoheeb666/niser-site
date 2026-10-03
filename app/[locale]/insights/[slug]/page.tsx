import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getInsightBySlug } from '@/lib/cms/client';
import { translateText } from '@/lib/ai/translate';
import { TRANSLATABLE_LOCALES, isTranslatableLocale } from '@/lib/locales';

/**
 * AI-translated insight pages — URL pattern /{locale}/insights/[slug]
 * (Implementation Plan v1.1 §9 Capability 7).
 *
 * The English original stays canonical; translations are generated on demand
 * via the NLLB/Gemini backends and cached in the translation memory. Every
 * page carries a machine-translation disclosure pending human review
 * (AI governance policy).
 */

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { locale: string; slug: string };
}

const MAX_PARAGRAPHS = 40;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isTranslatableLocale(params.locale)) return { title: 'Not Found' };
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return { title: 'Insight Not Found' };

  return {
    title: `${insight.title} | NISER`,
    description: insight.socialSummary?.slice(0, 160) ?? undefined,
    alternates: {
      canonical: `https://niser.gov.ng/${params.locale}/insights/${params.slug}`,
      languages: Object.fromEntries([
        ['en', `https://niser.gov.ng/insights/${params.slug}`],
        ...TRANSLATABLE_LOCALES.map((l) => [l.code, `https://niser.gov.ng/${l.code}/insights/${params.slug}`]),
        ['x-default', `https://niser.gov.ng/insights/${params.slug}`],
      ]),
    },
  };
}

export default async function TranslatedInsightPage({ params }: PageProps) {
  if (!isTranslatableLocale(params.locale)) notFound();
  const locale = TRANSLATABLE_LOCALES.find((l) => l.code === params.locale)!;

  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  const sourceTitle = insight.title || 'Untitled insight';
  const paragraphs = (insight.bodyPlaintext ?? '')
    .split('\n')
    .filter(Boolean)
    .slice(0, MAX_PARAGRAPHS);

  // Translate on demand (each segment hits the translation-memory cache)
  let needsReview = false;
  let translatedAvailable = true;
  const [titleT, summaryT, ...bodyT] = await Promise.all([
    translateText(sourceTitle, locale.code).catch(() => null),
    insight.socialSummary
      ? translateText(insight.socialSummary, locale.code).catch(() => null)
      : Promise.resolve(null),
    ...paragraphs.map((p) =>
      p.length > 5000 ? Promise.resolve(null) : translateText(p, locale.code).catch(() => null),
    ),
  ]);
  if (!titleT) translatedAvailable = false;
  for (const result of [titleT, summaryT, ...bodyT]) {
    if (result?.needsReview) needsReview = true;
  }

  const typeLabels: Record<string, string> = {
    policy_brief: 'Policy Brief',
    commentary: 'Commentary',
    analysis: 'Analysis',
    opinion: 'Opinion',
    rapid_response: 'Rapid Response',
  };
  const typeLabel = typeLabels[insight.contentType] ?? 'Insight';
  const displayTitle = titleT?.translatedText ?? sourceTitle;
  const displaySummary = summaryT?.translatedText ?? insight.socialSummary ?? '';

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Breadcrumb */}
        <nav className="pub-detail-breadcrumb" aria-label="Breadcrumb">
          <div className="container">
            <ol className="breadcrumb-list" role="list">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li><Link href="/insights">Insights</Link></li>
              <li aria-hidden="true">&rsaquo;</li>
              <li aria-current="page">{displayTitle.slice(0, 50)}{displayTitle.length > 50 ? '…' : ''}</li>
            </ol>
          </div>
        </nav>

        {/* Header */}
        <div className="insight-detail-header">
          <div className="container">
            <div className="insight-detail-header__badges">
              <span className="badge badge--green">{typeLabel}</span>
              <span className="badge badge--gray" lang={locale.code}>{locale.label}</span>
            </div>
            <h1 className="insight-detail-title" lang={locale.code}>{displayTitle}</h1>
            {displaySummary && (
              <p className="insight-detail-summary" lang={locale.code}>{displaySummary}</p>
            )}
            {/* Governance disclosure */}
            <div
              style={{
                marginTop: '1rem', padding: '0.75rem 1rem',
                borderLeft: '4px solid var(--niser-gold, #ffb81c)',
                background: 'var(--gray-50)', borderRadius: '6px',
                fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--gray-600)',
                maxWidth: '720px',
              }}
            >
              {translatedAvailable ? (
                <>
                  <strong lang={locale.code}>
                    {needsReview ? 'Machine-translated draft' : 'AI-translated'}
                  </strong>{' '}
                  ({locale.label}) from the{' '}
                  <Link href={`/insights/${insight.slug}`}>English original</Link>.{' '}
                  {needsReview
                    ? 'This translation is awaiting review by a human language reviewer.'
                    : 'Reviewed by a human language reviewer.'}
                </>
              ) : (
                <>
                  Translation is temporarily unavailable — read the{' '}
                  <Link href={`/insights/${insight.slug}`}>English original</Link>.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="section">
          <div className="container insight-detail-body">
            <article className="insight-article" lang={locale.code}>
              {translatedAvailable && bodyT.length > 0 ? (
                <div className="insight-article__content">
                  {bodyT.map((result, i) =>
                    result?.translatedText ? (
                      <p key={i}>{result.translatedText}</p>
                    ) : (
                      <p key={i}>{paragraphs[i]}</p>
                    ),
                  )}
                </div>
              ) : !translatedAvailable ? (
                <div className="insight-article__content">
                  {paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--gray-400)', fontStyle: 'italic' }}>
                  Full article content is available in the downloadable PDF version.
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link href={`/insights/${insight.slug}`} className="btn btn--outline">
                  Read in English
                </Link>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
