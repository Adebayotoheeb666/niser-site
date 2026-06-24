import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicationCard from '@/components/ui/PublicationCard';
import InsightCard from '@/components/ui/InsightCard';
import EventCard from '@/components/ui/EventCard';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  getPublications,
  getInsights,
  getEvents,
  getDivisions,
} from '@/lib/cms/client';
import Link from 'next/link';
import NewsletterForm from '@/components/ui/NewsletterForm';

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: 'NISER — National Institute of Social and Economic Research',
  description:
    'Evidence-based research and analysis informing Nigeria\'s national development. Explore publications, policy briefs, and expert insights from NISER Ibadan.',
};

const divisionIcons: Record<string, string> = {
  macroeconomics: '📈',
  poverty_social: '🤝',
  agriculture: '🌾',
  governance: '🏛️',
  industry: '🏗️',
};

export default async function HomePage() {
  // Fetch all homepage data in parallel
  const [publications, insights, events, divisions] = await Promise.allSettled([
    getPublications({ limit: 6 }),
    getInsights({ limit: 3 }),
    getEvents({ limit: 3 }),
    getDivisions(),
  ]);

  const pubs = publications.status === 'fulfilled' ? publications.value : [];
  const posts = insights.status === 'fulfilled' ? insights.value : [];
  const upcomingEvents = events.status === 'fulfilled' ? events.value : [];
  const divisionList = divisions.status === 'fulfilled' ? divisions.value : [];

  return (
    <>
      <Header />
      <main id="main-content">

        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section className="hero" aria-label="Welcome to NISER">
          <div className="container hero__content">
            <p className="hero__eyebrow">
              <span aria-hidden="true">⚡</span>
              Since 1960 · Ibadan, Nigeria
            </p>
            <h1 className="hero__title">
              Nigeria&apos;s Premier<br />
              Policy Research Institute
            </h1>
            <p className="hero__description">
              Producing evidence-based research to inform economic and social
              development policy across Nigeria and the African continent.
            </p>
            <div className="hero__actions">
              <Link href="/publications" className="btn btn--lg hero__btn-primary">
                Browse Publications
              </Link>
              <Link href="/search" className="btn btn--lg hero__btn-outline">
                Search Research
              </Link>
            </div>

            {/* Stats strip */}
            <div className="hero__stats" role="list">
              {[
                { value: '60+', label: 'Years of Research' },
                { value: '500+', label: 'Publications' },
                { value: '5', label: 'Research Divisions' },
                { value: '40+', label: 'Active Researchers' },
              ].map((stat) => (
                <div key={stat.label} className="hero__stat" role="listitem">
                  <span className="hero__stat-value">{stat.value}</span>
                  <span className="hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Latest Publications ──────────────────────────────────────── */}
        <section className="section" aria-labelledby="publications-heading">
          <div className="container">
            <SectionHeader
              title="Latest Research"
              viewAllHref="/publications"
              viewAllLabel="All Publications"
              description="Working papers, policy briefs, and journal articles from NISER researchers."
            />
            {pubs.length > 0 ? (
              <div className="grid--3">
                {pubs.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>
            ) : (
              <p className="homepage-empty">No publications available at this time.</p>
            )}
          </div>
        </section>

        {/* ─── Research Divisions ───────────────────────────────────────── */}
        {divisionList.length > 0 && (
          <section className="section homepage-divisions" aria-labelledby="divisions-heading">
            <div className="container">
              <SectionHeader
                title="Research Divisions"
                description="NISER's five centres of excellence, driving interdisciplinary policy analysis."
              />
              <div className="homepage-divisions__grid">
                {divisionList.map((div) => (
                  <div key={div.id} className="division-card card">
                    <div className="card__body division-card__body">
                      <span className="division-card__icon" aria-hidden="true">
                        {divisionIcons[div.slug?.split('-')[0] ?? ''] ?? '🔬'}
                      </span>
                      <h3 className="division-card__name">{div.name}</h3>
                      {div.description && (
                        <p className="division-card__desc">
                          {div.description.slice(0, 100)}…
                        </p>
                      )}
                      {div.headOfDivision && (
                        <p className="division-card__head">
                          Head: {div.headOfDivision.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Policy Insights ─────────────────────────────────────────── */}
        {posts.length > 0 && (
          <section className="section" aria-labelledby="insights-heading">
            <div className="container">
              <SectionHeader
                title="Policy Insights"
                viewAllHref="/insights"
                viewAllLabel="All Insights"
                description="Expert commentary and rapid-response analysis from NISER researchers."
              />
              <div className="grid--3">
                {posts.map((post) => (
                  <InsightCard key={post.id} insight={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Events ──────────────────────────────────────────────────── */}
        {upcomingEvents.length > 0 && (
          <section className="section homepage-events-section" aria-labelledby="events-heading">
            <div className="container">
              <SectionHeader
                title="Upcoming Events"
                viewAllHref="/events"
                viewAllLabel="All Events"
                description="Seminars, workshops, and conferences hosted by NISER."
              />
              <div className="grid--2">
                {upcomingEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Research Chatbot CTA ─────────────────────────────────────── */}
        <section className="section homepage-ai-cta" aria-label="AI Research Assistant">
          <div className="container">
            <div className="homepage-ai-cta__inner">
              <div className="homepage-ai-cta__content">
                <span className="homepage-ai-cta__icon" aria-hidden="true">🤖</span>
                <div>
                  <h2 className="homepage-ai-cta__title">Ask the NISER Research Assistant</h2>
                  <p className="homepage-ai-cta__desc">
                    Our AI-powered chatbot can help you find publications, understand policy research,
                    and navigate NISER&apos;s knowledge base — grounded entirely in NISER&apos;s documents.
                  </p>
                </div>
              </div>
              <Link href="/chatbot" className="btn btn--primary btn--lg">
                Start Conversation
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Newsletter ───────────────────────────────────────────────── */}
        <section className="section homepage-newsletter" aria-label="Newsletter subscription">
          <div className="container">
            <div className="homepage-newsletter__inner">
              <div className="homepage-newsletter__text">
                <h2 className="homepage-newsletter__title">Stay Informed</h2>
                <p>Receive NISER&apos;s latest publications, policy briefs, and event updates directly in your inbox.</p>
              </div>
              <NewsletterForm
                className="homepage-newsletter__form"
                placeholder="Enter your email address"
                id="hero-email"
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}

