import type { Metadata } from "next";
import "./homepage.css";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsletterForm from "@/components/ui/NewsletterForm";
import {
  getDivisions,
  getEvents,
  getInsights,
  getNews,
  getPublications,
  getResearchers,
} from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "NISER | Nigerian Institute of Social and Economic Research",
  description:
    "Advancing National Development Through Excellence in Policy Research. Nigeria's premier think-tank for socioeconomic intelligence and strategic policy frameworks.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const staticDivisions = [
  {
    slug: "macroeconomics",
    title: "Macroeconomics",
    description: "Fiscal policy, monetary frameworks, and economic growth.",
  },
  {
    slug: "poverty_social",
    title: "Poverty & Social Policy",
    description: "Social protection strategies and welfare impact assessments.",
  },
  {
    slug: "agriculture",
    title: "Agriculture & Food Policy",
    description: "Food security, value chains, and rural development.",
  },
  {
    slug: "governance",
    title: "Governance & Institutions",
    description: "Institutional reform and public sector efficiency.",
  },
  {
    slug: "industry",
    title: "Industry & Enterprise",
    description: "Industrialisation pathways and trade competitiveness.",
  },
];

const stats = [
  { value: "60+", label: "Years of research excellence" },
  { value: "500+", label: "Publications and policy briefs" },
  { value: "5", label: "Specialised research divisions" },
  { value: "6", label: "Zonal offices nationwide" },
];

const purposeItems = [
  {
    title: "Our Mission",
    text: "To consistently generate credible knowledge through quality research, training, and consultancy services in the task of national development.",
    href: "/about/history",
  },
  {
    title: "Our Vision",
    text: "To be a world-class think tank in social and economic policy research, recognised for intellectual excellence and policy impact.",
    href: "/about/history",
  },
  {
    title: "Our Mandate",
    text: "Established under the NISER Act to conduct policy research, provide consultancy, and build national research capacity since 1960.",
    href: "/about",
  },
];

function formatType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatAuthors(authors?: { titlePrefix?: string; fullName: string }[]) {
  if (!authors || authors.length === 0) return "";
  const names = authors.slice(0, 2).map((a) =>
    `${a.titlePrefix ? a.titlePrefix + ". " : ""}${a.fullName}`,
  );
  const joined = names.join(", ");
  return authors.length > 2 ? `${joined} et al.` : joined;
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

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [publications, events, insights, divisions, news, researchers] = await Promise.all([
    getPublications({ limit: 4 }),
    getEvents({ limit: 3 }),
    getInsights({ limit: 3 }),
    getDivisions(),
    getNews({ limit: 3 }),
    getResearchers({ active: true }).catch(() => []),
  ]);

  // Rotate the featured researcher weekly so profiles get balanced exposure
  const featuredResearcher = researchers.length > 0
    ? researchers[
        Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % researchers.length
      ]
    : null;

  const divisionLabel = (division?: string) =>
    staticDivisions.find((d) => d.slug === division)?.title ??
    (division ? division.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "");

  const publicationCards = publications.slice(0, 4).map((pub) => ({
    id: pub.id,
    title: pub.title,
    slug: pub.slug,
    category: formatType(pub.publicationType),
    year: pub.publishedYear ? String(pub.publishedYear) : "",
    authors: formatAuthors(pub.authors),
    abstract: (pub.abstract ?? "").slice(0, 180),
    isOpenAccess: pub.isOpenAccess,
  }));

  const eventCards = events.slice(0, 3).map((ev) => {
    const d = new Date(ev.startDate);
    const valid = !isNaN(d.getTime());
    return {
      id: ev.id,
      slug: ev.slug,
      month: valid ? d.toLocaleString("en-US", { month: "short" }).toUpperCase() : "",
      day: valid ? String(d.getDate()).padStart(2, "0") : "--",
      title: ev.title,
      location: ev.location ?? (ev.isOnline ? "Virtual Event" : "TBC"),
      time: valid
        ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " WAT"
        : "",
    };
  });

  const insightCards = insights.slice(0, 3).map((ins) => ({
    id: ins.id,
    title: ins.title,
    slug: ins.slug,
    category: formatInsightCategory(ins.contentType),
    author: ins.author
      ? `${ins.author.titlePrefix ? ins.author.titlePrefix + ". " : ""}${ins.author.fullName}`
      : "NISER Research",
    date: formatDate(ins.publishedDate),
    excerpt:
      ins.socialSummary ??
      ins.bodyPlaintext?.slice(0, 160) ??
      "Evidence-based policy analysis for Nigerian stakeholders and policymakers.",
  }));

  const divisionCards = divisions.slice(0, 5).map((div) => ({
    slug: div.slug,
    title: div.name,
    description: div.description ?? "",
  }));

  const displayDivisions =
    divisionCards.length > 0 ? divisionCards : staticDivisions;

  const newsCards = news.slice(0, 3).map((n) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    category: n.category === "institutional" ? "NISER" : n.category === "media" ? "Media" : "News",
    date: formatDate(n.publishedDate),
    summary: n.summary ?? "",
    externalUrl: n.externalUrl ?? null,
  }));

  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Hero: editorial brand statement ───────────────────────────────── */}
        <section className="home-hero">
          <div className="container home-hero__inner">
            <div className="home-hero__content">
              <span className="home-eyebrow">NISER &middot; Established 1960</span>
              <h1 className="home-hero__title">
                Independent research that shapes Nigeria&apos;s policy decisions.
              </h1>
              <p className="home-hero__lead">
                The National Institute of Social and Economic Research generates rigorous,
                multidisciplinary evidence for government, development partners, and civil
                society — informing the policies that drive national development.
              </p>
              <div className="home-hero__actions">
                <Link href="/publications" className="btn btn--primary">
                  Explore Our Research
                </Link>
                <Link href="/about" className="btn btn--outline">
                  About the Institute
                </Link>
              </div>
            </div>
            <div className="home-hero__media">
              <Image
                src="/niser-about.png"
                alt="NISER headquarters in Ibadan, Nigeria"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                priority
              />
              <span className="home-hero__caption">NISER headquarters, Ojoo, Ibadan</span>
            </div>
          </div>
        </section>

        {/* ── Research programs (topics) ────────────────────────────────────── */}
        <section className="home-topics" aria-labelledby="topics-heading">
          <div className="container">
            <div className="home-topics__head">
              <span className="home-eyebrow">Research Programs</span>
              <Link href="/divisions" className="home-link">
                Explore the divisions &rarr;
              </Link>
            </div>
            <ul className="home-topics__list" role="list">
              {displayDivisions.map((div, i) => (
                <li key={String(div.slug ?? div.title)}>
                  <Link
                    href={`/divisions/${div.slug}`}
                    className="home-topics__row"
                  >
                    <span className="home-topics__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="home-topics__body">
                      <span className="home-topics__title">{div.title}</span>
                      {div.description && (
                        <span className="home-topics__desc">{div.description}</span>
                      )}
                    </span>
                    <span className="home-topics__arrow" aria-hidden="true">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Audience pathways ─────────────────────────────────────────────── */}
        <section className="home-section home-pathways" aria-labelledby="pathways-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">Start Here</span>
                <h2 id="pathways-heading" className="home-section__title">
                  Find what you need, fast
                </h2>
              </div>
            </div>
            <ul className="home-pathways__grid" role="list">
              {[
                {
                  title: "For Policymakers",
                  text: "Evidence-based policy briefs and rapid responses on Nigeria's pressing issues.",
                  href: "/policy-briefs",
                  icon: "🏛️",
                },
                {
                  title: "For Researchers",
                  text: "Working papers, datasets, and 60+ years of social and economic research.",
                  href: "/publications",
                  icon: "📚",
                },
                {
                  title: "For Media",
                  text: "Expert commentary, press releases, and researchers available for interview.",
                  href: "/insights",
                  icon: "📰",
                },
                {
                  title: "For Partners & Students",
                  text: "Collaboration opportunities, training programmes, and internships.",
                  href: "/training",
                  icon: "🤝",
                },
              ].map((pathway) => (
                <li key={pathway.title}>
                  <Link href={pathway.href} className="home-pathways__card">
                    <span className="home-pathways__icon" aria-hidden="true">{pathway.icon}</span>
                    <span className="home-pathways__title">{pathway.title}</span>
                    <span className="home-pathways__text">{pathway.text}</span>
                    <span className="home-link" aria-hidden="true">Explore &rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Latest publications ───────────────────────────────────────────── */}
        <section className="home-section home-research" aria-labelledby="publications-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">Latest Publications</span>
                <h2 id="publications-heading" className="home-section__title">
                  Recent research
                </h2>
              </div>
              <Link href="/publications" className="home-link">
                View all publications &rarr;
              </Link>
            </div>

            {publicationCards.length > 0 ? (
              <div className="home-research__grid">
                {publicationCards.map((pub) => (
                  <article key={pub.id} className="home-research__card">
                    <span className="home-card-label">{pub.category}</span>
                    <h3 className="home-card-title">
                      <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                    </h3>
                    <p className="home-card-text">{pub.abstract}</p>
                    <div className="home-card-meta">
                      {pub.authors && <span className="home-card-author">{pub.authors}</span>}
                      {pub.year && <span className="home-card-date">{pub.year}</span>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-msg">
                Publications are being prepared. Check back soon.
              </p>
            )}
          </div>
        </section>

        {/* ── Expert insights ───────────────────────────────────────────────── */}
        <section className="home-section home-insights" aria-labelledby="insights-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">Expert Insights</span>
                <h2 id="insights-heading" className="home-section__title">
                  Analysis &amp; commentary
                </h2>
              </div>
              <Link href="/insights" className="home-link">
                View all insights &rarr;
              </Link>
            </div>

            {insightCards.length > 0 ? (
              <div className="home-insights__grid">
                {insightCards.map((ins) => (
                  <article key={ins.id} className="home-insight">
                    <span className="home-card-label">{ins.category}</span>
                    <h3 className="home-insight__title">
                      <Link href={`/insights/${ins.slug}`}>{ins.title}</Link>
                    </h3>
                    <p className="home-insight__excerpt">{ins.excerpt}</p>
                    <div className="home-card-meta">
                      <span className="home-card-author">{ins.author}</span>
                      {ins.date && <span className="home-card-date">{ins.date}</span>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-msg">Insights are being prepared. Check back soon.</p>
            )}
          </div>
        </section>

        {/* ── Events ────────────────────────────────────────────────────────── */}
        <section className="home-section home-events" aria-labelledby="events-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">Events &amp; Seminars</span>
                <h2 id="events-heading" className="home-section__title">
                  Join our conversations
                </h2>
              </div>
              <Link href="/events" className="home-link">
                View all events &rarr;
              </Link>
            </div>

            {eventCards.length > 0 ? (
              <ul className="home-events__list" role="list">
                {eventCards.map((ev) => (
                  <li key={ev.id}>
                    <Link href={`/events/${ev.slug}`} className="home-event">
                      <span className="home-event__date">
                        <span className="home-event__month">{ev.month || "TBA"}</span>
                        <span className="home-event__day">{ev.day}</span>
                      </span>
                      <span className="home-event__body">
                        <span className="home-event__title">{ev.title}</span>
                        <span className="home-event__meta">
                          {ev.location}
                          {ev.time ? ` · ${ev.time}` : ""}
                        </span>
                      </span>
                      <span className="home-event__arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-msg">Upcoming events are being planned. Check back soon.</p>
            )}
          </div>
        </section>

        {/* ── News ──────────────────────────────────────────────────────────── */}
        <section className="home-section home-news" aria-labelledby="news-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">News</span>
                <h2 id="news-heading" className="home-section__title">
                  Latest from the Institute
                </h2>
              </div>
              <Link href="/news" className="home-link">
                View all news &rarr;
              </Link>
            </div>

            {newsCards.length > 0 ? (
              <ul className="home-news__list" role="list">
                {newsCards.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.externalUrl || `/news/${n.slug}`}
                      target={n.externalUrl ? "_blank" : undefined}
                      rel={n.externalUrl ? "noopener noreferrer" : undefined}
                      className="home-news__row"
                    >
                      <span className="home-news__date">{n.date}</span>
                      <span className="home-news__body">
                        <span className="home-news__title">{n.title}</span>
                        {n.summary && <span className="home-news__summary">{n.summary}</span>}
                      </span>
                      <span className="home-news__arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-msg">News is being prepared. Check back soon.</p>
            )}
          </div>
        </section>

        {/* ── Featured researcher ───────────────────────────────────────────── */}
        {featuredResearcher && (
          <section className="home-section home-researcher" aria-labelledby="researcher-heading">
            <div className="container">
              <div className="home-section__head">
                <div>
                  <span className="home-eyebrow">Our People</span>
                  <h2 id="researcher-heading" className="home-section__title">
                    Featured researcher
                  </h2>
                </div>
                <Link href="/people" className="home-link">
                  Meet all researchers &rarr;
                </Link>
              </div>

              <div className="home-researcher__card">
                <div className="home-researcher__photo">
                  {featuredResearcher.photo ? (
                    <Image
                      src={featuredResearcher.photo}
                      alt={`Photo of ${featuredResearcher.fullName}`}
                      fill
                      sizes="(max-width: 640px) 128px, 160px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span aria-hidden="true">
                      {featuredResearcher.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  )}
                </div>
                <div className="home-researcher__body">
                  <h3 className="home-researcher__name">
                    <Link href={`/people/${featuredResearcher.slug}`}>
                      {featuredResearcher.titlePrefix ? `${featuredResearcher.titlePrefix}. ` : ""}
                      {featuredResearcher.fullName}
                    </Link>
                  </h3>
                  <p className="home-researcher__role">
                    {featuredResearcher.position}
                    {featuredResearcher.division
                      ? ` · ${divisionLabel(featuredResearcher.division)}`
                      : ""}
                  </p>
                  {featuredResearcher.biography && (
                    <p className="home-researcher__bio">{featuredResearcher.biography.slice(0, 220)}{featuredResearcher.biography.length > 220 ? "…" : ""}</p>
                  )}
                  {featuredResearcher.researchInterests && featuredResearcher.researchInterests.length > 0 && (
                    <ul className="home-researcher__interests" role="list" aria-label="Research interests">
                      {featuredResearcher.researchInterests.slice(0, 4).map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Stats band ────────────────────────────────────────────────────── */}
        <section className="home-stats" aria-label="NISER by the numbers">
          <div className="container home-stats__inner">
            {stats.map((stat) => (
              <div key={stat.label} className="home-stat">
                <span className="home-stat__value">{stat.value}</span>
                <span className="home-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Purpose / about strip ─────────────────────────────────────────── */}
        <section className="home-section home-purpose" aria-labelledby="purpose-heading">
          <div className="container">
            <div className="home-purpose__grid">
              {purposeItems.map((item) => (
                <article key={item.title} className="home-purpose__card">
                  <h3 id="purpose-heading" className="home-purpose__title">
                    {item.title}
                  </h3>
                  <p className="home-purpose__text">{item.text}</p>
                  <Link href={item.href} className="home-link">
                    Learn more &rarr;
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Studio CTA ─────────────────────────────────────────────────── */}
        <section className="home-section home-ai" aria-labelledby="ai-cta-heading">
          <div className="container home-ai__inner">
            <div className="home-ai__content">
              <span className="home-eyebrow home-eyebrow--light">Research AI Studio</span>
              <h2 id="ai-cta-heading" className="home-ai__title">
                Ask the archive. Cite the source.
              </h2>
              <p className="home-ai__desc">
                Chat with the NISER Assistant, search semantically, synthesise
                literature, and draft policy briefs — with every answer cited to
                the NISER repository and labels on anything outside it.
              </p>
              <div className="home-ai__actions">
                <Link href="/ai" className="btn btn--accent">
                  Explore AI tools
                </Link>
                <Link href="/chatbot" className="btn btn--outline">
                  Open the Assistant
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
        <section className="home-cta" aria-labelledby="newsletter-heading">
          <div className="container home-cta__inner">
            <div className="home-cta__content">
              <span className="home-eyebrow home-eyebrow--light">Stay Informed</span>
              <h2 id="newsletter-heading" className="home-cta__title">
                Subscribe to NISER updates
              </h2>
              <p className="home-cta__desc">
                Get the latest publications, policy briefs, events, and news from the
                Institute delivered to your inbox.
              </p>
              <NewsletterForm className="home-cta__form" placeholder="Your email address" />
              <p className="home-cta__note">
                <Link href="/subscribe">Manage your subscription</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
