import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCaseStudies } from '@/lib/cms/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Team Research Projects | NISER',
  description: 'Collaborative team research projects at NISER.',
};

export default async function TeamProjectsPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Team projects</span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Team research projects</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Collaborative research initiatives bringing together multidisciplinary teams to tackle policy problems.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Collaborations</p>
                <p className="mt-1 text-sm text-emerald-100">Interdisciplinary teams</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Methods</p>
                <p className="mt-1 text-sm text-emerald-100">Applied research</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Outcomes</p>
                <p className="mt-1 text-sm text-emerald-100">Policy inputs</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Team projects</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Collaborative research and case studies</h2>
            </div>

            {caseStudies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No team project case studies are currently listed.</p>
                <p className="mt-2 text-slate-600">Check the CMS for published case studies and outputs.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {caseStudies.map((study) => (
                  <article key={study.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <h3 className="text-lg font-bold text-slate-900">{study.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 flex-1">{study.description || 'Case study details will be published soon.'}</p>
                    <div className="mt-4 text-sm text-slate-700">
                      {study.client && <div><strong>Client:</strong> {study.client}</div>}
                      {study.serviceArea && <div><strong>Area:</strong> {study.serviceArea}</div>}
                      {study.outcomeMetric && <div><strong>Outcome:</strong> {study.outcomeMetric}</div>}
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
