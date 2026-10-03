import type { Metadata } from 'next';
import Image from 'next/image';
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

const divisionMeta: Record<string, { icon: string; label: string }> = {
  macroeconomics: { icon: '📊', label: 'Macroeconomic Policy' },
  poverty_social: { icon: '🤝', label: 'Poverty & Social Policy' },
  agriculture: { icon: '🌾', label: 'Agriculture & Food Policy' },
  governance: { icon: '🏛️', label: 'Governance & Institutions' },
  industry: { icon: '🏭', label: 'Industry & Enterprise' },
};

const exploreLinks = [
  { href: '/about/history', icon: '📜', label: 'History', note: 'Our journey since 1960' },
  { href: '/about/office-of-director-general', icon: '🏛️', label: 'Office of the DG', note: 'Office of the Director-General' },
  { href: '/about/governance-structure', icon: '🗂️', label: 'Governance Structure', note: 'How NISER is governed' },
  { href: '/about/governing-council', icon: '⚖️', label: 'Governing Council', note: 'The Institute&apos;s board' },
  { href: '/about/management-team', icon: '👥', label: 'Management Team', note: 'Meet our leadership' },
  { href: '/about/departments', icon: '🏗️', label: 'Departments', note: 'Research & support units' },
  { href: '/about/staff-directory', icon: '🪪', label: 'Staff Directory', note: 'Find NISER staff' },
  { href: '/about/servicom', icon: '🛎️', label: 'SERVICOM', note: 'Service excellence charter' },
  { href: '/about/actu-niser', icon: '🛡️', label: 'Anti-Corruption Unit', note: 'ACTU & transparency' },
  { href: '/about/tenders', icon: '📄', label: 'Tenders & Procurement', note: 'Open opportunities' },
];

const coreValues = [
  'Integrity',
  'Excellence',
  'Rigour',
  'Independence',
  'Policy Impact',
  'Collaboration',
  'Innovation',
  'Inclusiveness',
];

const leadershipLinks = [
  {
    href: '/about/office-of-director-general',
    image: '/dg.png',
    alt: 'Office of the Director-General of NISER',
    title: 'Office of the Director-General',
    text: 'The Director-General is the Chief Executive of the Institute, providing strategic direction for NISER&apos;s research agenda and administration.',
    tag: 'Leadership',
  },
  {
    href: '/about/management-team',
    image: '/mgt-team.webp',
    alt: 'NISER Management Team',
    title: 'Management Team',
    text: 'Led by the Director-General, the Management Committee comprises the Directors of departments and heads of key units.',
    tag: 'Management',
  },
  {
    href: '/about/governing-council',
    image: '/organization-structure.webp',
    alt: 'NISER Governing Council and organisational structure',
    title: 'Governing Council',
    text: 'The Governing Council supervises the affairs of the Institute, ensuring NISER fulfils its statutory mandate under the NISER Act.',
    tag: 'Governance',
  },
];

const regionalOffices = [
  {
    title: 'Headquarters',
    icon: '📍',
    places: ['Ibadan, Oyo State'],
  },
  {
    title: 'Liaison Offices',
    icon: '🏙️',
    places: ['Abuja', 'Lagos'],
  },
  {
    title: 'Zonal Offices',
    icon: '🗺️',
    places: ['Bauchi', 'Minna', 'Sokoto', 'Owerri', 'Port-Harcourt', 'Akure'],
  },
];

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
        <section className="about-hero">
          <div className="container about-hero__inner">
            <div className="about-hero__content">
              <span className="about-hero__badge animate-slide-down">
                <span className="about-hero__badge-dot" aria-hidden="true" />
                Est. 1960 · Nigeria&apos;s Premier Think Tank
              </span>
              <h1 className="about-hero__title animate-slide-up-stagger-1">
                Shaping Nigeria&apos;s development through evidence-based research
              </h1>
              <p className="about-hero__desc animate-slide-up-stagger-2">
                The National Institute of Social and Economic Research provides rigorous,
                independent analysis that informs national policy — working with government,
                development partners, and civil society since 1960.
              </p>
              <div className="about-hero__actions animate-slide-up-stagger-3">
                <a href="#divisions" className="btn btn--primary">
                  Explore Research Divisions
                </a>
                <a href="#contact" className="btn btn--ghost">
                  Contact NISER
                </a>
              </div>
            </div>
            <div className="about-hero__media animate-fade-in-slow">
              <div className="about-hero__img-wrap">
                <Image
                  src="/niser-about.png"
                  alt="NISER headquarters in Ibadan, Nigeria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="about-hero__img"
                  priority
                />
              </div>
              <div className="about-hero__chip about-hero__chip--years">
                <span className="about-hero__chip-value">60+</span>
                <span className="about-hero__chip-label">Years of research</span>
              </div>
              <div className="about-hero__chip about-hero__chip--divs">
                <span className="about-hero__chip-value">5</span>
                <span className="about-hero__chip-label">Research divisions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Explore NISER quick links */}
        <section className="about-explore" aria-labelledby="explore-heading">
          <div className="container">
            <SectionHeader
              title="Explore NISER"
              description="Quick access to everything you need to know about the Institute."
            />
            <div className="about-explore__grid">
              {exploreLinks.map((link) => (
                <Link key={link.href} href={link.href} className="about-explore__card">
                  <span className="about-explore__icon" aria-hidden="true">{link.icon}</span>
                  <span className="about-explore__body">
                    <span className="about-explore__label">{link.label}</span>
                    <span className="about-explore__note">{link.note}</span>
                  </span>
                  <svg className="about-explore__arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Who we are */}
        <section className="about-who section" aria-labelledby="who-heading">
          <div className="container about-who__inner">
            <div className="about-who__media">
              <Image
                src="/about-02.png"
                alt="Aerial view of NISER research campus"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="about-who__img"
              />
              <div className="about-who__badge">
                <span className="about-who__badge-value">Since 1960</span>
                <span className="about-who__badge-text">Autonomous since 1977 (NISER Act No. 70)</span>
              </div>
            </div>
            <div className="about-who__content">
              <span className="about-kicker">Who We Are</span>
              <h2 id="who-heading" className="about-section-title">
                Nigeria&apos;s foremost policy research institute
              </h2>
              <div className="about-prose">
                <p>
                  NISER is a public research institute located in Ibadan — one of the foremost
                  publicly funded think tanks in the country. Established in 1960 out of the West
                  African Institute of Social and Economic Research, the Institute provides
                  consultative service to government based on independent research findings and
                  coordinates social and economic research across federal universities.
                </p>
                <p>
                  From our headquarters in Ibadan and liaison offices in Abuja and Lagos, our
                  researchers generate credible knowledge through quality research, specialised
                  training, and consultancy services in the task of national development.
                </p>
              </div>
              <ul className="about-who__list" role="list">
                <li>Independent, policy-relevant research since 1960</li>
                <li>Empowered by the NISER Act (LFN 2006 CAP 115)</li>
                <li>Six zonal offices covering every geo-political zone</li>
                <li>Coordination of research capacity across Nigerian universities</li>
              </ul>
              <div className="about-who__actions">
                <Link href="/about/history" className="btn btn--primary">
                  Read Our History
                </Link>
                <Link href="/research" className="btn btn--outline">
                  Explore Research
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Mandate */}
        <section className="about-mv-section section" aria-labelledby="mv-heading">
          <div className="container">
            <div className="about-mv-header">
              <span className="about-kicker">Purpose</span>
              <h2 id="mv-heading" className="about-section-title">
                What drives the Institute
              </h2>
              <p className="about-mv-header__desc">
                Our mandate, mission, and vision keep every researcher focused on policy impact.
              </p>
            </div>
            <div className="about-mv-grid">
              <article className="about-mv-card about-mv-card--green animate-slide-up-stagger-1">
                <span className="about-mv-card__icon" aria-hidden="true">🎯</span>
                <h3 className="about-mv-card__title">Our Mission</h3>
                <p className="about-mv-card__text">
                  To consistently generate credible knowledge through quality research, conduct
                  specialised training and consultancy services while interacting with relevant
                  segments of Nigerian society in the task of national development.
                </p>
              </article>
              <article className="about-mv-card about-mv-card--teal animate-slide-up-stagger-2">
                <span className="about-mv-card__icon" aria-hidden="true">🔭</span>
                <h3 className="about-mv-card__title">Our Vision</h3>
                <p className="about-mv-card__text">
                  To be a world-class think tank in the area of social and economic policy
                  research — recognised globally for intellectual excellence and policy impact.
                </p>
              </article>
              <article className="about-mv-card about-mv-card--gold animate-slide-up-stagger-3">
                <span className="about-mv-card__icon" aria-hidden="true">📜</span>
                <h3 className="about-mv-card__title">Our Mandate</h3>
                <p className="about-mv-card__text">
                  Section 4 of the NISER Act empowers the Institute to conduct research into
                  Nigeria&apos;s economic and social problems, provide consultancy services, and
                  organise seminars on development challenges.
                </p>
              </article>
            </div>
            <div className="about-values" aria-label="NISER core values">
              <span className="about-values__label">Core Values</span>
              <ul className="about-values__list" role="list">
                {coreValues.map((value) => (
                  <li key={value} className="about-values__chip">{value}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Stats banner */}
        <div className="about-stats-banner" aria-label="NISER by the numbers">
          <div className="container about-stats-inner">
            {[
              { value: '60+', label: 'Years of Research Excellence' },
              { value: '500+', label: 'Publications' },
              { value: `${researchers.length || '40'}+`, label: 'Active Researchers' },
              { value: `${divisions.length || 5}`, label: 'Research Divisions' },
            ].map((stat, i) => (
              <div key={stat.label} className={`about-stat animate-slide-up-stagger-${(i % 4) + 1}`}>
                <span className="about-stat__value">{stat.value}</span>
                <span className="about-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership & Governance */}
        <section className="about-leadership section" aria-labelledby="leadership-heading">
          <div className="container">
            <div className="about-leadership__header">
              <div>
                <span className="about-kicker">Leadership & Governance</span>
                <h2 id="leadership-heading" className="about-section-title">
                  The people guiding the Institute
                </h2>
              </div>
              <Link href="/about/governance-structure" className="btn btn--outline btn--sm">
                Governance Structure
              </Link>
            </div>
            <div className="about-leadership__grid">
              {leadershipLinks.map((item) => (
                <Link key={item.href} href={item.href} className="about-leadership__card">
                  <div className="about-leadership__media">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="about-leadership__img"
                    />
                    <span className="about-leadership__tag">{item.tag}</span>
                  </div>
                  <div className="about-leadership__body">
                    <h3 className="about-leadership__title">{item.title}</h3>
                    <p className="about-leadership__text">{item.text}</p>
                    <span className="about-leadership__link">
                      Learn more
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Research Divisions */}
        <section id="divisions" className="about-divisions section" aria-labelledby="divisions-heading">
          <div className="container">
            <SectionHeader
              title="Research Divisions"
              description="Specialised centres of excellence covering Nigeria's most critical policy domains."
              viewAllHref="/people"
              viewAllLabel="Meet our researchers"
            />
            <div className="about-divisions-grid">
              {divisions.length === 0 ? (
                <p className="about-divisions__empty">
                  Research division details are being prepared and will be available shortly.
                </p>
              ) : (
                divisions.map((div, i) => {
                  const meta = divisionMeta[div.slug?.toLowerCase() ?? ''] ?? { icon: '🔬', label: div.shortName ?? div.name };
                  return (
                    <article key={div.id} className="about-division-card card">
                      <div className="about-division-card__top">
                        <span className="about-division-card__num" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="about-division-card__icon" aria-hidden="true">{meta.icon}</span>
                      </div>
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
                        <Link
                          href={`/people?division=${div.slug?.toLowerCase()}`}
                          className="btn btn--outline btn--sm about-division-card__people-btn"
                        >
                          View Researchers →
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Regional presence */}
        <section className="about-regional section" aria-labelledby="regional-heading">
          <div className="container">
            <div className="about-regional__header">
              <span className="about-kicker">Where We Work</span>
              <h2 id="regional-heading" className="about-section-title">
                A national reach across all six zones
              </h2>
            </div>
            <div className="about-regional__grid">
              {regionalOffices.map((office) => (
                <div key={office.title} className="about-regional__card">
                  <span className="about-regional__icon" aria-hidden="true">{office.icon}</span>
                  <h3 className="about-regional__title">{office.title}</h3>
                  <ul className="about-regional__list" role="list">
                    {office.places.map((place) => (
                      <li key={place} className="about-regional__place">{place}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="container about-cta__inner">
            <div className="about-cta__content">
              <h2 className="about-cta__title">Partner with NISER</h2>
              <p className="about-cta__desc">
                Collaborate with our researchers, commission evidence for your decisions, or
                build your career at one of Africa&apos;s leading think tanks.
              </p>
              <div className="about-cta__actions">
                <Link href="/contact" className="btn btn--accent">Get in Touch</Link>
                <Link href="/partnerships" className="btn btn--ghost">Partner With Us</Link>
                <Link href="/careers" className="btn btn--ghost">Join Our Team</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Location */}
        <section id="contact" className="about-contact section" aria-labelledby="contact-heading">
          <div className="container">
            <SectionHeader title="Contact NISER" description="We would love to hear from you." />
            <div className="about-contact-grid">
              <div className="about-contact-card card">
                <div className="card__body">
                  <span className="about-contact-card__icon" aria-hidden="true">📍</span>
                  <h3 className="about-contact-card__title">Visit Us</h3>
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
                  <span className="about-contact-card__icon" aria-hidden="true">📬</span>
                  <h3 className="about-contact-card__title">Get in Touch</h3>
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
                  <span className="about-contact-card__icon" aria-hidden="true">🔗</span>
                  <h3 className="about-contact-card__title">Quick Links</h3>
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
