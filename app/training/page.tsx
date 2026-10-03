import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTrainingPrograms } from '@/lib/cms/client';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Training & Capacity Building | NISER',
  description:
    'Professional development programs and workshops in research methodology, policy analysis, and data analytics for government, NGOs, and development professionals.',
};

export default async function TrainingPage() {
  const programs = await getTrainingPrograms({ limit: 6 });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Training
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Build research and policy capacity</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Practical learning programmes for researchers, policymakers, NGOs, and institutions focused on evidence-based decision making.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{programs.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Programmes listed</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Methods</p>
                <p className="mt-1 text-sm text-emerald-100">Applied research skills</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence to action</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Upcoming learning opportunities</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Strengthen research and policy capacity with NISER</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Our training events combine applied methods, policy engagement, and real-world examples to support evidence-based institutions across Nigeria.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#0f3d2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#184f42]">
                  Request a training session
                </Link>
                <Link href="/training/research-methodology" className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                  Explore methodology training
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[#edf5f0] p-6 md:p-8">
              <h3 className="text-2xl font-bold text-slate-900">What participants gain</h3>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex gap-3"><span className="text-emerald-700">•</span> Applied research methods and data literacy</li>
                <li className="flex gap-3"><span className="text-emerald-700">•</span> Policy analysis and communication skills</li>
                <li className="flex gap-3"><span className="text-emerald-700">•</span> Professional development for institutions and teams</li>
                <li className="flex gap-3"><span className="text-emerald-700">•</span> Practical tools for evidence-informed decisions</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="container">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Available programmes</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Learning opportunities for researchers and institutions</h2>
              </div>
              <p className="text-sm text-slate-600">{programs.length} programmes currently listed</p>
            </div>

            {programs.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No training programmes are currently available.</p>
                <p className="mt-2 text-slate-600">Please contact NISER for upcoming sessions.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {programs.map((program) => (
                  <article key={program.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {program.status ?? 'Training'}
                    </p>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{program.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {program.description ?? 'A structured training programme designed for NISER stakeholders and institutional partners.'}
                    </p>
                    <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">Duration:</span> {program.duration ?? 'TBC'}</p>
                      <p><span className="font-semibold text-slate-900">Audience:</span> {program.targetAudience ?? 'Multiple stakeholders'}</p>
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
