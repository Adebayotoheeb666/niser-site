import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import PolicyBriefCard from "@/components/ui/PolicyBriefCard";
import { getInsights } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Policy Briefs | NISER",
  description:
    "Access NISER's policy briefs - concise, evidence-based recommendations for policymakers.",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "Recently published";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Recently published";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PolicyBriefsPage() {
  const insights = await getInsights({ contentType: "policy_brief", limit: 12 });

  const featured = insights[0] ?? null;
  const recent = insights.slice(featured ? 1 : 0, 6);
  const archive = insights.slice(featured ? 6 : 5);

  return (
    <>
      <Header />
      <HeroSection
        title="Policy Briefs"
        description="Read concise, evidence-based recommendations tailored for policymakers and practitioners."
        subtitle="Grounded in NISER research and national priorities"
        backgroundImage="/brief.png"
      />

      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div>
              <h1 className="font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold text-slate-900 sm:text-4xl">
                Policy briefs for evidence-informed decision making
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                Short, policy-oriented summaries of research findings and recommendations designed for policymakers, practitioners and civil society.
              </p>

              <div className="mt-8 space-y-6">
                {featured ? (
                  <article className="group relative overflow-hidden rounded-[20px] bg-white shadow-lg">
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-3 py-1 bg-[#E9F7EE] text-[#0A5F3D] rounded-full text-xs font-semibold">Policy Brief</span>
                        <span className="text-sm text-slate-500">{formatDate(featured.publishedDate)}</span>
                      </div>
                      <h2 className="mt-4 font-['Playfair_Display',_Georgia,_serif] text-2xl font-bold text-slate-900">{featured.title}</h2>
                      <p className="mt-3 text-sm text-slate-600 line-clamp-3">{featured.socialSummary ?? featured.excerpt ?? featured.bodyPlaintext ?? ''}</p>
                      <div className="mt-5 flex items-center gap-3">
                        <Link href={`/insights/${featured.slug}`} className="inline-flex items-center gap-2 rounded-full bg-[#0A5F3D] px-4 py-2 text-sm font-semibold text-white">Read brief</Link>
                        <Link href="/ai-policy-brief" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800">Generate brief (AI)</Link>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="rounded-[12px] border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">No featured policy brief available.</div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent briefs</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {recent.map((r) => (
                      <PolicyBriefCard
                        key={r.id}
                        insight={r}
                        summary={r.socialSummary ?? r.excerpt ?? r.bodyPlaintext ?? ''}
                        author={r.author ? `${r.author.titlePrefix ?? ''} ${r.author.fullName}`.trim() : ''}
                        date={formatDate(r.publishedDate)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-900">Filter & search</h4>
                <div className="mt-3 space-y-3">
                  <input placeholder="Search briefs..." aria-label="Search policy briefs" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                  <select aria-label="Filter by topic" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>All topics</option>
                    <option>Macroeconomics</option>
                    <option>Governance</option>
                    <option>Agriculture</option>
                  </select>
                  <select aria-label="Sort order" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                    <option>Latest</option>
                    <option>Most read</option>
                  </select>
                </div>
                <div className="mt-6">
                  <h5 className="text-xs font-semibold text-slate-700">Tags</h5>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs">Poverty</span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs">Growth</span>
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs">Food Security</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Policy brief archive</h3>
            <Link href="/publications" className="text-sm font-medium text-slate-700">View all publications</Link>
          </div>

          {archive.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">There are no archived briefs to show.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archive.map((a) => (
                <PolicyBriefCard
                  key={a.id}
                  insight={a}
                  summary={a.socialSummary ?? a.excerpt ?? a.bodyPlaintext ?? ''}
                  author={a.author ? `${a.author.titlePrefix ?? ''} ${a.author.fullName}`.trim() : ''}
                  date={formatDate(a.publishedDate)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
