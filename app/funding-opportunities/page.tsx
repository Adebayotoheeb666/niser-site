import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getFundingOpportunities } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Funding Opportunities | NISER",
  description:
    "Explore research funding opportunities, grants, and fellowship programs at NISER.",
};

function formatDeadline(deadline?: string): string | null {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) {
    return null;
  }

  return deadlineDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isClosingSoon(deadline?: string): boolean {
  if (!deadline) return false;

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return false;

  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return deadlineDate >= now && deadlineDate <= thirtyDaysFromNow;
}

export default async function FundingOpportunitiesPage() {
  const opportunities = await getFundingOpportunities({ active: true });
  const closingSoonCount = opportunities.filter((opp) => isClosingSoon(opp.deadline)).length;

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Open calls & funding updates
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Funding opportunities for research, innovation, and impact.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Explore active grants, fellowships, and programme support designed to strengthen policy research, institutional collaboration, and evidence-driven development.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#opportunities"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0d3b2a] transition hover:bg-emerald-50"
                >
                  Browse opportunities
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Request eligibility support
                </a>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{opportunities.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Active opportunities</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{closingSoonCount}</p>
                <p className="mt-1 text-sm text-emerald-100">Closing within 30 days</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="mt-1 text-sm text-emerald-100">Funding updates available</p>
              </div>
            </div>
          </div>
        </section>

        <section id="opportunities" className="py-16 md:py-20">
          <div className="container">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Current opportunities
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                  Find the right call for your next step
                </h2>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Need help assessing eligibility?
              </a>
            </div>

            {opportunities.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No active funding opportunities right now.</p>
                <p className="mt-2 text-slate-600">Check back soon for new grants, fellowships, and research support programmes.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {opportunities.map((opp, index) => {
                  const closing = isClosingSoon(opp.deadline);
                  const readableDeadline = formatDeadline(opp.deadline);

                  return (
                    <article
                      key={opp.id}
                      className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {closing && (
                          <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                            Closing soon
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <h3 className="text-2xl font-bold leading-tight text-slate-900">
                          {opp.title}
                        </h3>
                        {opp.description && (
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {opp.description}
                          </p>
                        )}
                      </div>

                      <dl className="mt-6 space-y-3 text-sm text-slate-600">
                        {opp.fundingType && (
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-semibold text-slate-900">Type:</dt>
                            <dd>{opp.fundingType}</dd>
                          </div>
                        )}
                        {opp.amountRange && (
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-semibold text-slate-900">Funding:</dt>
                            <dd>{opp.amountRange}</dd>
                          </div>
                        )}
                        {readableDeadline && (
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-semibold text-slate-900">Deadline:</dt>
                            <dd>{readableDeadline}</dd>
                          </div>
                        )}
                        {opp.sponsor && (
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-semibold text-slate-900">Sponsor:</dt>
                            <dd>{opp.sponsor}</dd>
                          </div>
                        )}
                        {opp.eligibility && (
                          <div className="flex flex-wrap gap-2">
                            <dt className="font-semibold text-slate-900">Eligibility:</dt>
                            <dd>{opp.eligibility}</dd>
                          </div>
                        )}
                      </dl>

                      <div className="mt-auto pt-6">
                        {opp.applicationUrl ? (
                          <a
                            href={opp.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-full bg-[#0d3b2a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123f2f]"
                          >
                            Apply or learn more
                          </a>
                        ) : (
                          <a
                            href="/contact"
                            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            Ask for details
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#edf5f0] py-16 md:py-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Partnership support
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                  We help teams move from idea to application.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Who can apply</p>
                  <p className="mt-3 text-base font-medium text-slate-900">Researchers, institutions, and policy teams</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">What we help with</p>
                  <p className="mt-3 text-base font-medium text-slate-900">Eligibility checks and proposal preparation</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Typical support</p>
                  <p className="mt-3 text-base font-medium text-slate-900">Grant alignment, deadlines, and coordination</p>
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
