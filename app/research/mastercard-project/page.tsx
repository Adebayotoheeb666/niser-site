import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCaseStudies } from '@/lib/cms/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Mastercard Project | NISER Research',
  description: 'NISER Mastercard research project details and findings.',
};

export default async function MastercardProjectPage() {
  const caseStudies = await getCaseStudies();
  const mastercardStudies = caseStudies.filter((study) =>
    study.title.toLowerCase().includes('mastercard') || study.description?.toLowerCase().includes('mastercard')
  );

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Partnership research
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Mastercard collaboration</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Highlights and case studies from NISER’s partnership with Mastercard on development research and capacity building.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Case studies</p>
                <p className="mt-1 text-sm text-emerald-100">Project examples</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Capacity</p>
                <p className="mt-1 text-sm text-emerald-100">Training & support</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Outcomes</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence & impact</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Mastercard project</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Case studies and collaborative outputs</h2>
            </div>

            {mastercardStudies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No Mastercard case studies are currently listed.</p>
                <p className="mt-2 text-slate-600">Please check back for updates.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {mastercardStudies.map((study) => (
                  <article key={study.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <h3 className="text-lg font-bold text-slate-900">{study.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 flex-1">{study.description || 'Study details will be published soon.'}</p>
                    {study.outcomeMetric && <p className="mt-4 text-sm text-slate-700"><strong>Outcome:</strong> {study.outcomeMetric}</p>}
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
