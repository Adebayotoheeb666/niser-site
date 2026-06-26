import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getInsights } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Policy Briefs | NISER",
  description:
    "Access NISER's policy briefs - concise, evidence-based recommendations for policymakers.",
};

export default async function PolicyBriefsPage() {
  const insights = await getInsights({
    contentType: "policy_brief",
    limit: 20,
  });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Policy Briefs
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Concise, evidence-based policy recommendations addressing critical
              development challenges facing Nigeria.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="border-b border-surface-gray py-12 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search policy briefs..."
                className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest"
              />
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest">
                <option>All Topics</option>
                <option>Macroeconomics</option>
                <option>Agriculture</option>
                <option>Governance</option>
              </select>
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest">
                <option>Latest</option>
                <option>Most Read</option>
                <option>Most Cited</option>
              </select>
            </div>
          </div>
        </section>

        {/* Policy Briefs Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {insights.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-16 text-center">
                No policy briefs available yet. Check our{" "}
                <a
                  href="/insights"
                  className="text-nigeria-green-vibrant underline"
                >
                  Insights page
                </a>{" "}
                for all research content.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight) => {
                  const summary =
                    insight.socialSummary ??
                    insight.bodyPlaintext?.slice(0, 160) ??
                    "";
                  const author = insight.author
                    ? `${insight.author.titlePrefix} ${insight.author.fullName}`
                    : "";
                  const date = new Date(
                    insight.publishedDate,
                  ).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={insight.id}
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <span className="inline-block px-3 py-1 bg-accent-mint/20 text-accent-mint rounded-full font-label-sm text-label-sm mb-4">
                        Policy Brief
                      </span>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3 line-clamp-2">
                        {insight.title}
                      </h3>
                      {summary && (
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-3">
                          {summary}
                        </p>
                      )}
                      {insight.tags && insight.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {insight.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-label-sm text-label-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-label-sm text-outline block">
                            {date}
                          </span>
                          {author && (
                            <span className="text-label-sm text-on-surface-variant">
                              {author}
                            </span>
                          )}
                        </div>
                        <a
                          href={"/insights/" + insight.slug}
                          className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline"
                        >
                          Read Policy Brief{" "}
                          <span className="material-symbols-outlined text-base ml-1">
                            arrow_forward
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
