import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getResearchCenters } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Research Centers | NISER",
  description:
    "Explore NISER&apos;s specialized research centers driving innovation in socioeconomic research.",
};

export default async function ResearchCentersPage() {
  const centers = await getResearchCenters();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Research centers
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Research Centres</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Specialized centres and thematic hubs driving socioeconomic research and policy analysis.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Evidence</p>
                <p className="mt-1 text-sm text-emerald-100">Data & analysis</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Applied</p>
                <p className="mt-1 text-sm text-emerald-100">Policy-facing work</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Knowledge</p>
                <p className="mt-1 text-sm text-emerald-100">Seminars & outputs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Research Centers</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Specialised hubs across NISER</h2>
            </div>

            {centers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No research centers are listed yet.</p>
                <p className="mt-2 text-slate-600">Information will be added as centres are established.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {centers.map((center) => {
                  const directorName = center.director
                    ? [center.director.titlePrefix, center.director.fullName].filter(Boolean).join(' ')
                    : null;

                  return (
                    <article key={center.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-slate-900">{center.name}{center.shortName ? ` (${center.shortName})` : ''}</h3>
                        {center.established && <span className="text-sm text-slate-500">Est. {center.established}</span>}
                      </div>

                      {directorName && <p className="mt-2 text-sm text-slate-700">Director: <span className="font-medium">{directorName}</span></p>}

                      {center.focusAreas && center.focusAreas.length > 0 && (
                        <p className="mt-3 text-sm text-slate-600">{center.focusAreas.join(' · ')}</p>
                      )}

                      <div className="mt-4 flex-1" />

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                        {center.activeProjects != null && <div>Active projects: <strong>{center.activeProjects}</strong></div>}
                        {center.email && <a href={`mailto:${center.email}`} className="text-emerald-700 hover:underline">{center.email}</a>}
                        {center.websiteUrl && <a href={center.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">Learn more</a>}
                      </div>
                    </article>
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
