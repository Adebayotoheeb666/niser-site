import type { Metadata } from "next";
import "./homepage.css";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getDivisions,
  getEvents,
  getInsights,
  getPublications,
} from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "NISER | Nigerian Institute of Social and Economic Research",
  description:
    "Advancing National Development Through Excellence in Policy Research. Nigeria's premier think-tank for socioeconomic intelligence and strategic policy frameworks.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const coverGradients: Record<string, string> = {
  working_paper: "linear-gradient(135deg, #1a3a1a 0%, #006B3F 100%)",
  policy_brief: "linear-gradient(135deg, #1a2e4a 0%, #1e5fa0 100%)",
  journal_article: "linear-gradient(135deg, #1a1a3a 0%, #2563eb 100%)",
  book_chapter: "linear-gradient(135deg, #2d1a3a 0%, #7c3aed 100%)",
  annual_report: "linear-gradient(135deg, #1a2e1a 0%, #166534 100%)",
  conference_paper: "linear-gradient(135deg, #1a2e3a 0%, #0e7490 100%)",
};

const insightGradients: Record<string, string> = {
  policy_brief: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
  commentary: "linear-gradient(135deg, #1a2e1a 0%, #16a34a 100%)",
  analysis: "linear-gradient(135deg, #1a1a3a 0%, #4f46e5 100%)",
  opinion: "linear-gradient(135deg, #3a1a1a 0%, #dc2626 100%)",
  rapid_response: "linear-gradient(135deg, #1a2e3a 0%, #0891b2 100%)",
};

const divisionIcons = [
  "trending_up",
  "groups",
  "eco",
  "account_balance",
  "factory",
];

const staticDivisions = [
  {
    icon: "trending_up",
    title: "Macroeconomics",
    description:
      "Strategic analysis of fiscal policies and monetary frameworks.",
  },
  {
    icon: "groups",
    title: "Poverty",
    description: "Social protection strategies and welfare impact assessments.",
  },
  {
    icon: "eco",
    title: "Agriculture",
    description: "Food security, value chains, and rural development policies.",
  },
  {
    icon: "account_balance",
    title: "Governance",
    description:
      "Institutional reform, political economy, and public sector efficiency.",
  },
  {
    icon: "factory",
    title: "Industry",
    description:
      "Industrialization pathways and trade competitiveness studies.",
  },
];

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatInsightCategory(ct: string): string {
  const map: Record<string, string> = {
    policy_brief: "POLICY BRIEF",
    commentary: "COMMENTARY",
    analysis: "ANALYSIS",
    opinion: "OPINION",
    rapid_response: "RAPID RESPONSE",
  };
  return map[ct] ?? "INSIGHT";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [publications, events, insights, divisions] = await Promise.all([
    getPublications({ limit: 4 }),
    getEvents({ limit: 3 }),
    getInsights({ limit: 3 }),
    getDivisions(),
  ]);

  // Publication cards — show 2
  const publicationCards = publications.slice(0, 2).map((pub) => ({
    id: pub.id,
    title: pub.title,
    slug: pub.slug,
    category: formatType(pub.publicationType),
    date: pub.publishedYear ? String(pub.publishedYear) : "",
    abstract: (pub.abstract ?? "").slice(0, 130),
    pdfFile: pub.pdfFile ?? null,
    coverGradient:
      coverGradients[pub.publicationType] ?? coverGradients.working_paper,
  }));

  // Event cards — show 3
  const eventCards = events.slice(0, 3).map((ev) => {
    const d = new Date(ev.startDate);
    const valid = !isNaN(d.getTime());
    return {
      month: valid
        ? d.toLocaleString("en-US", { month: "short" }).toUpperCase()
        : "",
      day: valid ? String(d.getDate()).padStart(2, "0") : "--",
      title: ev.title,
      location: ev.location ?? (ev.isOnline ? "Virtual Event via Zoom" : "TBC"),
      time: valid
        ? d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }) + " WAT"
        : "",
    };
  });

  // Insight cards — show 3
  const insightCards = insights.slice(0, 3).map((ins) => ({
    id: ins.id,
    title: ins.title,
    slug: ins.slug,
    category: formatInsightCategory(ins.contentType),
    author: ins.author
      ? `${ins.author.titlePrefix ? ins.author.titlePrefix + ". " : ""}${ins.author.fullName}`
      : "NISER Research",
    image: ins.featuredImage ?? null,
    description:
      ins.socialSummary ??
      ins.bodyPlaintext?.slice(0, 160) ??
      "Evidence-based policy analysis for Nigerian stakeholders and policymakers.",
    fallbackGradient:
      insightGradients[ins.contentType] ?? insightGradients.analysis,
  }));

  // Division cards — show 5
  const divisionCards = divisions.slice(0, 5).map((div, idx) => ({
    title: div.name,
    description:
      div.description ??
      "Focused research supporting Nigerian socioeconomic policy.",
    icon: divisionIcons[idx] ?? "analytics",
    slug: div.slug,
  }));

  const displayDivisions =
    divisionCards.length > 0 ? divisionCards : staticDivisions;

  return (
    <>
      <Header />
      <main>
        {/* ═══════════════════════════════════════════════════════
            HERO — split layout: text left, building image right
        ═══════════════════════════════════════════════════════ */}
        <section className="hero-section">
          <div className="hero-bg-slider" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className={`hero-bg-slide hero-bg-slide-${index + 1}`}
              />
            ))}
          </div>

          {/* Left text panel */}
          <div className="hero-text-panel">
            <div className="hero-text-inner">
              <span className="hero-badge">ESTABLISHED 1960</span>
              <h1 className="hero-title">
                Advancing National Development Through Excellence in Policy
                Research.
              </h1>
              <p className="hero-desc">
                NISER stands as Nigeria&apos;s premier think-tank, dedicated to
                providing high-quality socioeconomic intelligence and strategic
                policy frameworks that drive sustainable national growth.
              </p>
              <div className="hero-actions">
                <Link href="/publications" className="btn-primary">
                  Explore Publications
                </Link>
                <Link href="/about" className="btn-outline">
                  About the Institute
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            VISION — DG'S WELCOME — MISSION
        ═══════════════════════════════════════════════════════ */}
        <section className="section-vision-mission">
          <div className="container vision-mission-grid">
            {/* Vision */}
            <div className="vision-card">
              <div className="vision-image-placeholder" />
              <div className="vision-content">
                <h2 className="vision-mission-title">VISION</h2>
                <p className="vision-mission-text">
                  To be a world-class think tank in the area of social and economic policy research
                </p>
              </div>
            </div>

            {/* DG's Welcome */}
            <div className="dg-welcome-card">
              <div className="dg-welcome-image-placeholder" />
              <div className="dg-welcome-content">
                <h2 className="vision-mission-title">THE DG'S WELCOME</h2>
                <p className="vision-mission-text">
                  On behalf of NISER, I would like to welcome you to the institute's website, which presents the institute's profile, activities and output. NISER is an agency of the Federal Ministry of Budget &amp; Economic Planning.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="mission-card">
              <div className="mission-image-placeholder" />
              <div className="mission-content">
                <h2 className="vision-mission-title">MISSION</h2>
                <p className="vision-mission-text">
                  To consistently generate credible knowledge through quality research, conduct specialized training and provide consultancy services while interacting with relevant segments of the Nigerian society in the task of national development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            ABOUT US
        ═══════════════════════════════════════════════════════ */}
        <section className="section-about">
          <div className="container">
            <h2 className="section-title">About Us</h2>
            <div className="about-content">
              <p>
                Prior to the establishment of NISER, colonial authorities established the West African Institute of Social and Economic Research. The center was founded in 1950 and headquartered in Ibadan with a mission to provide information on economic and social ideas that will be pivotal to the development of British West African countries. The institute was affiliated with University of Ibadan and was publicly funded.
              </p>
              <p>
                In 1957, Ghana obtained political independence and opted out of the institute. After Nigeria gained independence in 1960, the name of the institute was changed to Nigerian Institute of Social and Economic Research.
              </p>
              <p>
                In 1977, the military government made NISER an autonomous body. Thereafter, NISER's responsibilities include coordinating social and economic research in federal universities. The institute also carries out independent research on social and economic issues, and provide consultative service to the government based on research findings.
              </p>
              <p>
                The institute's facilities are used as a venue for seminars and conferences.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            RESEARCH DIVISIONS
        ═══════════════════════════════════════════════════════ */}
        <section className="section-divisions">
          <div className="container">
            <h2 className="section-title">Research Divisions</h2>
            <p className="section-subtitle">
              Our multidisciplinary approach covers the critical pillars of
              Nigeria&apos;s socioeconomic landscape.
            </p>
            <div className="divisions-grid">
              {displayDivisions.map((div) => (
                <Link
                  key={String("slug" in div ? div.slug : div.title)}
                  href="/research-centers"
                  className="division-card"
                >
                  <span
                    className="material-symbols-outlined division-icon"
                    aria-hidden="true"
                  >
                    {div.icon}
                  </span>
                  <h3 className="division-title">{div.title}</h3>
                  <p className="division-desc">
                    {div.description.length > 85
                      ? div.description.slice(0, 85) + "..."
                      : div.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            LATEST PUBLICATIONS  +  EVENTS & SEMINARS
        ═══════════════════════════════════════════════════════ */}
        <section className="section-pub-events">
          <div className="container pub-events-grid">
            {/* ─ Publications ─ */}
            <div className="pub-col">
              <div className="pub-header">
                <h2 className="section-title" style={{ margin: 0 }}>
                  Latest Publications
                </h2>
                <Link href="/publications" className="view-all-link">
                  View All Publications
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>

              {publicationCards.length > 0 ? (
                <div className="pub-grid">
                  {publicationCards.map((pub) => (
                    <Link
                      key={pub.id}
                      href={`/publications/${pub.slug}`}
                      className="pub-card"
                    >
                      {/* Cover */}
                      <div
                        className="pub-cover"
                        style={{ background: pub.coverGradient }}
                      >
                        <div className="pub-cover-pattern" />
                        <span
                          className="material-symbols-outlined"
                          style={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "2.75rem",
                          }}
                          aria-hidden="true"
                        >
                          menu_book
                        </span>
                      </div>
                      {/* Body */}
                      <div className="pub-body">
                        <span className="pub-type">{pub.category}</span>
                        <h4 className="pub-title">{pub.title}</h4>
                        {pub.abstract && (
                          <p className="pub-abstract">{pub.abstract}</p>
                        )}
                        <div className="pub-footer">
                          <span className="pub-date">{pub.date}</span>
                          <span className="pub-pdf">
                            PDF{" "}
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontSize: "0.875rem",
                                verticalAlign: "middle",
                              }}
                            >
                              download
                            </span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="empty-msg">
                  No publications yet. Add publications in the WordPress CMS.
                </p>
              )}
            </div>

            {/* ─ Events ─ */}
            <div className="events-col">
              <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
                Events &amp; Seminars
              </h2>

              {eventCards.length > 0 ? (
                <div className="events-list">
                  {eventCards.map((ev, idx) => (
                    <Link key={idx} href="/events" className="event-item">
                      <div className="event-badge">
                        <span className="event-month">{ev.month}</span>
                        <span className="event-day">{ev.day}</span>
                      </div>
                      <div className="event-info">
                        <p className="event-title">{ev.title}</p>
                        <p className="event-meta">
                          {ev.location}
                          {ev.time ? ` | ${ev.time}` : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="empty-msg">
                  No upcoming events. Add events in the WordPress CMS.
                </p>
              )}

              <Link href="/events" className="view-events-btn">
                View All Events
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            RECENT INSIGHTS
        ═══════════════════════════════════════════════════════ */}
        <section className="section-insights">
          <div className="container">
            <h2 className="section-title">Recent Insights</h2>
            <p className="section-subtitle">
              Brief, actionable intelligence for policymakers and stakeholders.
            </p>

            {insightCards.length > 0 ? (
              <div className="insights-grid">
                {insightCards.map((ins) => (
                  <Link
                    key={ins.id}
                    href={`/insights/${ins.slug}`}
                    className="insight-card"
                  >
                    {/* Image */}
                    <div className="insight-img-wrap">
                      {ins.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ins.image} alt="" className="insight-img" />
                      ) : (
                        <div
                          className="insight-img-fallback"
                          style={{ background: ins.fallbackGradient }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <span className="insight-category">{ins.category}</span>
                    <h3 className="insight-title">{ins.title}</h3>
                    <p className="insight-desc">{ins.description}</p>
                    {/* Author */}
                    <div className="insight-author">
                      <div className="insight-avatar" aria-hidden="true">
                        {ins.author
                          .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "")
                          .charAt(0)}
                      </div>
                      <span className="insight-author-name">{ins.author}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="empty-msg">
                No insights yet. Add insights in the WordPress CMS.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
