import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import { getNews } from "@/lib/cms/client";
import type { NewsItem } from "@/types/cms";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "News & Announcements | NISER",
  description:
    "Latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.",
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

function formatType(category: string) {
  switch (category) {
    case "institutional":
      return "Institutional News";
    case "media":
      return "External Publication";
    case "external":
      return "External Publication";
    default:
      return "Institutional Update";
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

function formatPublishedDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  institutional: {
    bg: "bg-accent-mint",
    text: "text-nigeria-green-deep",
    border: "border-l-accent-mint",
  },
  media: {
    bg: "bg-research-blue/10",
    text: "text-research-blue",
    border: "border-l-research-blue",
  },
  external: {
    bg: "bg-nigeria-green-vibrant/10",
    text: "text-nigeria-green-vibrant",
    border: "border-l-nigeria-green-vibrant",
  },
};

export default async function NewsPage() {
  const newsItems = await getNews({ limit: 20 });
  const featuredItem: NewsItem | null = newsItems[0] ?? null;
  const otherItems = newsItems.slice(1);

  return (
    <>
      <Header />
      <main
        id="main-content"
        className="min-h-screen pb-24 bg-background"
      >
        <HeroSection
          title="News & Announcements"
          description="Latest updates, press releases, and announcements from NISER"
          subtitle="Stay informed about our institutional developments and media mentions"
        />
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Header Section */}
          <section className="mb-12 border-b border-surface-gray pb-8">
            <span className="text-nigeria-green-vibrant font-label-sm text-label-sm tracking-widest uppercase mb-2 block">
              Institutional Media Hub
            </span>
            <h1 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">
              News &amp; Announcements
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              The latest institutional updates, press releases, and media
              mentions from the Nigerian Institute of Social and Economic
              Research.
            </p>
          </section>

          {/* Featured News Item */}
          {featuredItem && (
            <div className="mb-20 relative grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <div className="md:col-span-7 rounded-xl overflow-hidden shadow-xl shadow-primary/5 group">
                <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-nigeria-green-deep to-research-blue flex items-center justify-center">
                  <span className="text-8xl">
                    {getCategoryIcon(featuredItem.category)}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-nigeria-green-deep/80 to-transparent flex flex-col justify-end p-8">
                  <span className="bg-accent-mint text-nigeria-green-deep font-label-sm text-label-sm px-3 py-1 rounded-full w-fit mb-4">
                    {formatCategory(featuredItem.category)}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-white mb-2">
                    {featuredItem.title}
                  </h2>
                  <p className="text-white/80 font-body-md text-body-md line-clamp-2">
                    {featuredItem.summary}
                  </p>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-surface-container-lowest p-8 border border-surface-gray rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-nigeria-green-deep">
                      <span className="material-symbols-outlined">
                        campaign
                      </span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">
                        {formatPublishedDate(featuredItem.publishedDate)}
                      </p>
                      <p className="font-label-md text-label-md text-nigeria-green-vibrant">
                        {formatType(featuredItem.category)}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                    {featuredItem.title}
                  </h3>
                  <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                    {featuredItem.summary}
                  </p>
                  <a
                    className="text-research-blue font-label-md flex items-center gap-2 hover:gap-4 transition-all cursor-pointer"
                    href={
                      featuredItem.externalUrl ?? `/news/${featuredItem.slug}`
                    }
                  >
                    Read Full Press Release{" "}
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Feed */}
          <div className="relative space-y-16">
            {/* Timeline decorative element */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-surface-gray -translate-x-1/2 hidden md:block" />

            {/* Month Marker */}
            <div className="flex justify-center relative z-10">
              <span className="bg-surface-gray text-on-surface-variant font-label-sm text-label-sm px-6 py-2 rounded-full border border-outline-variant">
                Recent Updates
              </span>
            </div>

            {/* Timeline Items */}
            {otherItems.map((item, index) => {
              const colors =
                categoryColors[item.category] ||
                categoryColors["institutional"];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-gutter items-start group"
                >
                  {/* Timeline connector */}
                  <div className="absolute left-1/2 top-12 w-4 h-4 rounded-full bg-white border-4 border-nigeria-green-vibrant -translate-x-1/2 z-20 hidden md:block" />

                  {isEven ? (
                    <>
                      {/* Left side */}
                      <div className="md:pr-12 md:text-right">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          {formatPublishedDate(item.publishedDate)}
                        </p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      {/* Right side */}
                      <div className="md:pl-12">
                        <div
                          className={`p-6 rounded-xl hover:shadow-lg transition-all border-l-4 ${colors.border} bg-surface-container-lowest border border-surface-gray`}
                        >
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">
                            {item.summary}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-2xl">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface">
                                {formatCategory(item.category)}
                              </p>
                              <p className="text-label-sm font-label-sm text-on-surface-variant">
                                {formatType(item.category)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left side (hidden on this alternate layout) */}
                      <div className="md:order-2 md:pl-12">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          {formatPublishedDate(item.publishedDate)}
                        </p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      {/* Right side */}
                      <div className="md:order-1 md:text-right md:pr-12">
                        <div
                          className={`p-6 rounded-xl hover:shadow-lg transition-all border-r-4 ${colors.border} bg-surface-container-lowest border border-surface-gray`}
                        >
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">
                            {item.summary}
                          </p>
                          <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                              <p className="font-label-md text-label-md text-on-surface">
                                {formatCategory(item.category)}
                              </p>
                              <p className="text-label-sm font-label-sm text-on-surface-variant">
                                {formatType(item.category)}
                              </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-research-blue/10 flex items-center justify-center text-xl">
                              {getCategoryIcon(item.category)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <a
              href="/news?page=2"
              className="bg-nigeria-green-deep text-on-primary px-10 py-3 rounded-lg font-label-md hover:opacity-90 transition-all inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">expand_more</span>
              Load More News
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
