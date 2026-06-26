import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import InsightCard from '@/components/ui/InsightCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { getInsights } from '@/lib/cms/client';
import type { InsightContentType } from '@/types/cms';

export const revalidate = 21600; // 6 hours ISR

export const metadata: Metadata = {
  title: 'Insights & Policy Briefs',
  description:
    'Expert commentary, policy analysis, and rapid-response briefs from NISER researchers on Nigeria\'s economic and social landscape.',
};

const contentTypes: { value: InsightContentType | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'policy_brief', label: 'Policy Briefs' },
  { value: 'commentary', label: 'Commentary' },
  { value: 'analysis', label: 'Analysis' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'rapid_response', label: 'Rapid Response' },
];

interface InsightsPageProps {
  searchParams: { type?: string };
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const contentTypeFilter = (searchParams.type as InsightContentType) || undefined;
  const insights = await getInsights({ limit: 30, contentType: contentTypeFilter });

  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection
          title="Insights & Policy Briefs"
          description="Expert analysis and actionable intelligence on Nigeria's economy and society"
          subtitle="Commentary, policy briefs, and rapid-response analysis from NISER researchers"
        />
        <div className="section">
          <div className="container">
            {/* Type filter tabs */}
            <nav className="insights-tabs" aria-label="Filter by content type">
              {contentTypes.map((tab) => {
                const isActive = (searchParams.type ?? '') === tab.value;
                const href = tab.value ? `/insights?type=${tab.value}` : '/insights';
                return (
                  <a
                    key={tab.value}
                    href={href}
                    className={`insights-tab ${isActive ? 'insights-tab--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>

            <SectionHeader
              title={contentTypeFilter ? `${contentTypes.find((t) => t.value === contentTypeFilter)?.label ?? contentTypeFilter}` : 'All Insights'}
              description={`${insights.length} article${insights.length !== 1 ? 's' : ''}`}
            />

            {insights.length > 0 ? (
              <div className="grid--3">
                {insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <div className="insights-empty">
                <p>No insights found for this category.</p>
                <a href="/insights" className="btn btn--outline" style={{ marginTop: '1rem' }}>View all insights</a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

