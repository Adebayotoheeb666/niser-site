import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import { getDivisions, getResearchers } from '@/lib/cms/client';

export const revalidate = 86400; // SSG / 24hr

export const metadata: Metadata = {
  title: 'About NISER',
  description:
    'The National Institute of Social and Economic Research (NISER) is Nigeria\'s premier policy research institution, established in 1960 to provide evidence-based research for national development.',
};

const divisionDescriptions: Record<string, string> = {
  macroeconomics:
    'Analyses Nigeria\'s macroeconomic environment including fiscal policy, monetary policy, trade, and economic growth dynamics.',
  poverty_social:
    'Studies poverty measurement, social safety nets, inequality, and human development outcomes across Nigerian states.',
  agriculture:
    'Investigates agricultural productivity, food security, rural development, and climate adaptation in the agri-food sector.',
  governance:
    'Examines public sector governance, institutional reform, anti-corruption, and policy implementation effectiveness.',
  industry:
    'Analyses industrial policy, manufacturing competitiveness, SME development, and economic diversification strategies.',
};

export default async function AboutPage() {
  const [divisionsResult, researchersResult] = await Promise.allSettled([
    getDivisions(),
    getResearchers({ active: true }),
  ]);

  const divisions = divisionsResult.status === 'fulfilled' ? divisionsResult.value : [];
  const researchers = researchersResult.status === 'fulfilled' ? researchersResult.value : [];

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Page hero */}
        <div className="about-hero">
          <div className="container">
            <div className="about-hero__badge">
              <span>Est. 1960</span>
            </div>
            <h1 className="about-hero__title">
              About NISER
            </h1>
            <p className="about-hero__desc">
              The National Institute of Social and Economic Research is Nigeria&apos;s
              foremost policy research institution — providing evidence-based analysis
              to government, development partners, and civil society since 1960.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="section" aria-labelledby="mission-heading">
          <div className="container about-mv-grid">
            <div className="about-mv-card">
              <div className="about-mv-card__icon" aria-hidden="true">🎯</div>
              <h2 id="mission-heading" className="about-mv-card__title">Our Mission</h2>
              <p className="about-mv-card__text">
                To conduct rigorous, multidisciplinary, policy-relevant research and disseminate
                findings to inform national development decision-making in Nigeria.
              </p>
            </div>
            <div className="about-mv-card">
              <div className="about-mv-card__icon" aria-hidden="true">🔭</div>
              <h2 className="about-mv-card__title">Our Vision</h2>
              <p className="about-mv-card__text">
                To be Africa&apos;s leading policy research institution, recognised globally for
                intellectual excellence, policy impact, and institutional integrity.
              </p>
            </div>
            <div className="about-mv-card">
              <div className="about-mv-card__icon" aria-hidden="true">📜</div>
              <h2 className="about-mv-card__title">Our Mandate</h2>
              <p className="about-mv-card__text">
                Established by the Federal Government of Nigeria in 1960 to advise on economic
                and social policy, evaluate development programmes, and build national research capacity.
              </p>
            </div>
          </div>
        </section>

        {/* Stats banner */}
        <div className="about-stats-banner">
          <div className="container about-stats-inner">
            {[
              { value: '60+', label: 'Years of Research Excellence' },
              { value: '500+', label: 'Publications' },
              { value: `${researchers.length || '40'}+`, label: 'Active Researchers' },
              { value: `${divisions.length || 5}`, label: 'Research Divisions' },
            ].map((stat) => (
              <div key={stat.label} className="about-stat">
                <span className="about-stat__value">{stat.value}</span>
                <span className="about-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Research Divisions */}
        {divisions.length > 0 && (
          <section className="section" aria-labelledby="divisions-heading">
            <div className="container">
              <SectionHeader
                title="Research Divisions"
                description="Five specialised centres of excellence covering Nigeria's most critical policy domains."
              />
              <div className="about-divisions-grid">
                {divisions.map((div) => (
                  <div key={div.id} className="about-division-card card">
                    <div className="card__body">
                      <h3 className="about-division-card__name">{div.name}</h3>
                      <p className="about-division-card__desc">
                        {div.description ?? divisionDescriptions[div.slug?.toLowerCase() ?? ''] ?? ''}
                      </p>
                      {div.headOfDivision && (
                        <div className="about-division-card__head">
                          <span className="about-division-card__head-label">Division Head:</span>
                          <Link href={`/people/${div.headOfDivision.slug}`} className="about-division-card__head-link">
                            {div.headOfDivision.fullName}
                          </Link>
                        </div>
                      )}
                      <Link href={`/people?division=${div.slug?.toLowerCase()}`}
                        className="btn btn--outline btn--sm about-division-card__people-btn">
                        View Researchers →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact & Location */}
        <section className="section about-contact-section" aria-labelledby="contact-heading">
          <div className="container">
            <SectionHeader title="Contact NISER" />
            <div className="about-contact-grid">
              <div className="about-contact-card card">
                <div className="card__body">
                  <h3 className="about-contact-card__title">📍 Address</h3>
                  <address className="about-contact-card__address">
                    National Institute of Social and Economic Research<br />
                    Km 17, Idiroko Road<br />
                    PMB 5, UI Post Office<br />
                    Ibadan, Oyo State, Nigeria
                  </address>
                </div>
              </div>
              <div className="about-contact-card card">
                <div className="card__body">
                  <h3 className="about-contact-card__title">📬 Get in Touch</h3>
                  <dl className="about-contact-dl">
                    <dt>General Enquiries</dt>
                    <dd><a href="mailto:info@niser.gov.ng">info@niser.gov.ng</a></dd>
                    <dt>Research Collaborations</dt>
                    <dd><a href="mailto:research@niser.gov.ng">research@niser.gov.ng</a></dd>
                    <dt>Media &amp; Press</dt>
                    <dd><a href="mailto:communications@niser.gov.ng">communications@niser.gov.ng</a></dd>
                    <dt>Phone</dt>
                    <dd><a href="tel:+23482241682">+234 (0)82 241 682</a></dd>
                  </dl>
                </div>
              </div>
              <div className="about-contact-card card">
                <div className="card__body">
                  <h3 className="about-contact-card__title">🔗 Quick Links</h3>
                  <ul className="about-quick-links" role="list">
                    <li><Link href="/about/tenders">Procurement &amp; Tenders</Link></li>
                    <li><Link href="/about/accessibility">Accessibility Statement</Link></li>
                    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                    <li><a href="https://niser.gov.ng/rss.xml" target="_blank" rel="noopener noreferrer">RSS Feed</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

