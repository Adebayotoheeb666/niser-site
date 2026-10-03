import Link from 'next/link';
import { cookies } from 'next/headers';
import { getRecommendationsForContent, type RecommendationSource } from '@/lib/ai/recommendations';

interface RelatedContentProps extends RecommendationSource {
  heading?: string;
}

export default async function RelatedContent({ heading = 'Recommended reading', ...source }: RelatedContentProps) {
  const cookieStore = cookies();
  const rawSignals = cookieStore.get('recommendation-signals')?.value;
  let userSignals = undefined;

  try {
    userSignals = rawSignals ? JSON.parse(rawSignals) : undefined;
  } catch {
    userSignals = undefined;
  }

  const recommendations = await getRecommendationsForContent({
    ...source,
    userSignals,
  });

  if (!recommendations.length) return null;

  return (
    <section aria-labelledby="related-content-heading" style={{ marginTop: '2.5rem' }}>
      <h2 id="related-content-heading" className="pub-detail-section-title">{heading}</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {recommendations.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="card__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center' }}>
                <span className="badge badge--gray">{item.type}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{Math.round(item.score * 10) / 10}</span>
              </div>
              <h3 style={{ margin: '0.75rem 0 0.35rem', fontSize: '1rem' }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--gray-600)', lineHeight: 1.5 }}>{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
