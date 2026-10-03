import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import type { Division } from '@/types/cms';
import { getDivisions } from '@/lib/cms/client';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Research Divisions | NISER',
  description:
    'Explore NISER\u2019s five research divisions: macroeconomics, poverty & social development, agriculture & food policy, governance, and industry & enterprise.',
};

const staticDivisions = [
  { slug: 'macroeconomics', name: 'Macroeconomics', description: 'Fiscal policy, monetary frameworks, and economic growth.' },
  { slug: 'poverty_social', name: 'Poverty & Social Policy', description: 'Social protection strategies and welfare impact assessments.' },
  { slug: 'agriculture', name: 'Agriculture & Food Policy', description: 'Food security, value chains, and rural development.' },
  { slug: 'governance', name: 'Governance & Institutions', description: 'Institutional reform and public sector efficiency.' },
  { slug: 'industry', name: 'Industry & Enterprise', description: 'Industrialisation pathways and trade competitiveness.' },
];

export default async function DivisionsIndexPage() {
  let divisions: Division[] = [];
  try {
    divisions = await getDivisions();
  } catch {
    divisions = [];
  }

  const items = divisions.length > 0
    ? divisions.map((d) => ({ slug: d.slug, name: d.name, description: d.description ?? '' }))
    : staticDivisions;

  return (
    <>
      <Header />
      <HeroSection
        title="Research Divisions"
        description="Five specialised divisions generate the evidence behind NISER's policy research."
        subtitle="Explore each division's team, projects, and publications"
      />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <ul className="home-pathways__grid" role="list" style={{ marginTop: 0 }}>
              {items.map((d) => (
                <li key={d.slug}>
                  <Link href={`/divisions/${d.slug}`} className="home-pathways__card">
                    <span className="home-pathways__title">{d.name}</span>
                    <span className="home-pathways__text">{d.description}</span>
                    <span className="home-link" aria-hidden="true">Explore division &rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
