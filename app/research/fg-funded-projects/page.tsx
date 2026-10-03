import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getFundingOpportunities } from '@/lib/cms/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'FG Funded Projects | NISER Research',
  description: 'Research projects funded by the Federal Government of Nigeria.',
};

export default async function FGFundedProjectsPage() {
  const opportunities = await getFundingOpportunities({ active: true, limit: 50 });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Federal government projects
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">FG-funded research and evaluations</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">NISER delivers research and evaluations funded by the Federal Government to inform national policy.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{opportunities.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Active projects</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Government priorities</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Impact</p>
                <p className="mt-1 text-sm text-emerald-100">National engagements</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Federal projects</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Research commissioned by the Federal Government</h2>
            </div>

            {opportunities.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No FG-funded projects are currently listed.</p>
                <p className="mt-2 text-slate-600">Please check back for updates.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {opportunities.map((opp) => (
                  <article key={opp.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <h3 className="text-lg font-bold text-slate-900">{opp.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 flex-1">{opp.description || 'Project details will be published soon.'}</p>

                    <div className="mt-4 flex flex-col gap-2 text-sm text-slate-700">
                      {opp.sponsor && <div><strong>Sponsor:</strong> {opp.sponsor}</div>}
                      {opp.amountRange && <div><strong>Amount:</strong> {opp.amountRange}</div>}
                      {opp.deadline && <div><strong>Deadline:</strong> {opp.deadline}</div>}
                    </div>

                    <div className="mt-6">
                      {opp.applicationUrl ? (
                        <a href={opp.applicationUrl} className="inline-flex items-center gap-2 rounded-xl bg-[#0f3d2f] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Project page</a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
