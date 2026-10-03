import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNews } from "@/lib/cms/client";
import type { NewsItem } from "@/types/cms";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News & Announcements | NISER",
  description:
    "Latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.",
};

const categoryStyles: Record<string, { badge: string; accent: string }> = {
  institutional: {
    badge: "bg-[#E9F7EE] text-[#0A5F3D]",
    accent: "from-[#0A5F3D] to-[#0F7A52]",
  },
  media: {
    badge: "bg-[#EAF2FF] text-[#1E3A8A]",
    accent: "from-[#1D4ED8] to-[#2563EB]",
  },
  external: {
    badge: "bg-[#EAFBF3] text-[#0D7A4A]",
    accent: "from-[#0D7A4A] to-[#0F9F6E]",
  },
};

function formatCategory(category: string) {
  switch (category) {
    case "institutional":
      return "Institutional Update";
    case "media":
      return "Media Mention";
    case "external":
      return "External Publication";
    default:
      return "Institutional News";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "institutional":
      return "🏛️";
    case "media":
      return "📰";
    case "external":
      return "🌐";
    default:
      return "📄";
  }
}

function formatPublishedDate(dateStr?: string) {
  if (!dateStr) return "Recently published";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Recently published";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildNewsUrl(item: NewsItem) {
  if (item.externalUrl?.trim()) return item.externalUrl;
  return item.slug ? `/news/${item.slug}` : `/news/${item.id}`;
}

export default async function NewsPage() {
  const newsItems = await getNews({ limit: 9 });
  const [featuredItem, ...otherItems] = newsItems;
  const trendingItems = otherItems.slice(0, 3);
  const archiveItems = otherItems.slice(3);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,107,63,0.12),_transparent_35%)]" />
          <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full border border-[#DCEFE4] bg-[#F2FBF6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                    NISER Newsroom
                  </span>
                  <h1 className="mt-4 max-w-3xl font-['Playfair_Display',_Georgia,_serif] text-4xl font-bold tracking-tight text-[#0b1b13] sm:text-5xl lg:text-6xl">
                    News &amp; announcements from the heart of policy research.
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
                  {[
                    "Research updates",
                    "Media coverage",
                    "Institutional stories",
                    "Announcements",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {featuredItem ? (
                <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
                  <Link
                    href={buildNewsUrl(featuredItem)}
                    target={featuredItem.externalUrl?.trim() ? "_blank" : undefined}
                    rel={featuredItem.externalUrl?.trim() ? "noreferrer" : undefined}
                    className="group relative overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
                  >
                    <div className={`relative h-[360px] w-full bg-gradient-to-br ${categoryStyles[featuredItem.category]?.accent ?? "from-[#0A5F3D] to-[#1D4ED8]"}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),transparent_24%)]" />
                      <div className="absolute inset-0 flex items-center justify-center text-[7rem] opacity-40">
                        {getCategoryIcon(featuredItem.category)}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${categoryStyles[featuredItem.category]?.badge ?? "bg-white/15 text-white"}`}
                          >
                            {formatCategory(featuredItem.category)}
                          </span>
                          <span className="text-sm text-white/75">
                            {formatPublishedDate(featuredItem.publishedDate)}
                          </span>
                        </div>
                        <h2 className="max-w-xl font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold leading-tight sm:text-4xl">
                          {featuredItem.title}
                        </h2>
                        <p className="mt-3 max-w-lg text-sm text-slate-200 sm:text-base">
                          {featuredItem.summary}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-4">
                    {trendingItems.map((item) => (
                      <Link
                        key={item.id}
                        href={buildNewsUrl(item)}
                        target={item.externalUrl?.trim() ? "_blank" : undefined}
                        rel={item.externalUrl?.trim() ? "noreferrer" : undefined}
                        className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#BFE6CF] hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${categoryStyles[item.category]?.badge ?? "bg-slate-100 text-slate-700"}`}
                          >
                            {formatCategory(item.category)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatPublishedDate(item.publishedDate)}
                          </span>
                        </div>
                        <h3 className="font-['Playfair_Display',_Georgia,_serif] text-xl font-bold text-slate-900 transition group-hover:text-[#0A5F3D]">
                          {item.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {item.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F3D]">
                          Read story
                          <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-100 p-12 text-center text-slate-600">
                  No news updates are available right now.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                Latest coverage
              </p>
              <h2 className="mt-2 font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold text-slate-900 sm:text-4xl">
                Recent updates and analysis
              </h2>
            </div>

            <Link
              href="/news?page=2"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-[#0A5F3D] hover:text-[#0A5F3D]"
            >
              Explore archive
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {archiveItems.length > 0 ? (
              archiveItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#CDECD9] hover:shadow-xl"
                >
                  <div className={`flex items-center justify-between border-b border-slate-200 bg-gradient-to-r ${categoryStyles[item.category]?.accent ?? "from-[#0A5F3D] to-[#1D4ED8]"} px-4 py-3 text-white`}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                      {getCategoryIcon(item.category)} {formatCategory(item.category)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-white/80">
                      {formatPublishedDate(item.publishedDate)}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <h3 className="font-['Playfair_Display',_Georgia,_serif] text-2xl font-bold leading-tight text-slate-900">
                      {item.title}
                    </h3>
                    <p className="line-clamp-4 text-sm leading-6 text-slate-600">
                      {item.summary}
                    </p>

                    <Link
                      href={buildNewsUrl(item)}
                      target={item.externalUrl?.trim() ? "_blank" : undefined}
                      rel={item.externalUrl?.trim() ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F3D] transition group-hover:gap-3"
                    >
                      Read full story
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-slate-600 md:col-span-2 xl:col-span-3">
                There are no additional articles to show right now.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
