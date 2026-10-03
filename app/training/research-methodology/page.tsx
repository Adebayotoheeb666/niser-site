import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Research Methodology Training | NISER',
  description: 'Comprehensive training in research methodology and design at NISER.',
};

export default function ResearchMethodologyPage() {
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
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Research methodology training</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Build stronger research capacity through practical training in methods, design, analysis, and evidence-based policy work.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Methods</p>
                <p className="mt-1 text-sm text-emerald-100">Quantitative & qualitative</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Analysis & practice</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Skills</p>
                <p className="mt-1 text-sm text-emerald-100">Proposal to reporting</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Research competence</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Strengthening scholars and institutions through practical methodology</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
                <p className="text-base leading-7 text-slate-600">
                  NISER recognizes the need for updating and upgrading the research skills and competence of scholars so as to build the teaching and research capacity of their various institutions. Based on this, NISER&apos;s research methodology training combines intensive and crash trainings in social and economic research methodologies. The programmes target emerging thinking in social and economic research, ethical issues in social and economic research, mainstreaming gender and environmental issues, developing research proposals, choosing and formulating study approaches and designs, planning and managing research, and writing research reports.
                </p>

                <div className="mt-8 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Main objective</p>
                  <p className="mt-3 text-xl font-bold text-slate-900">
                    To update and upgrade the research skills and competence of scholars so as to develop research capacity and capability of their various institutions.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-[#edf5f0] p-6 md:p-8">
                <h3 className="text-2xl font-bold text-slate-900">Specific objectives</h3>
                <ul className="mt-6 space-y-3 text-slate-700">
                  <li className="flex gap-3"><span className="text-emerald-700">•</span> Expose researchers to skills specific to quantitative and qualitative methodologies</li>
                  <li className="flex gap-3"><span className="text-emerald-700">•</span> Build analytical skills for evaluating policy, strategy, programmes, and projects</li>
                  <li className="flex gap-3"><span className="text-emerald-700">•</span> Develop practical computer and data skills for research</li>
                  <li className="flex gap-3"><span className="text-emerald-700">•</span> Address environment, development, and gender-sensitive research approaches</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <div className="container">
            <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
              <div className="flex flex-col gap-8 md:flex-row">
                <div className="md:w-64">
                  <Image src="/train.png" alt="Research methodology training" width={256} height={320} className="h-80 w-full rounded-[1.5rem] object-cover shadow-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Training coverage</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Core focus areas</h3>
                  <div className="mt-6 space-y-5">
                    <div className="border-l-4 border-emerald-600 pl-4">
                      <h4 className="text-lg font-bold text-slate-900">Social and economic research methodologies</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Comprehensive coverage of approaches relevant to policy development and institutional capacity building.</p>
                    </div>
                    <div className="border-l-4 border-emerald-600 pl-4">
                      <h4 className="text-lg font-bold text-slate-900">Ethical and gender considerations</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Incorporation of ethical issues and gender sensitivity into research design and implementation.</p>
                    </div>
                    <div className="border-l-4 border-emerald-600 pl-4">
                      <h4 className="text-lg font-bold text-slate-900">Practical skills development</h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Hands-on training in proposal development, research design selection, and technical implementation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">How to apply</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Application process</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">
                The research methodology training is conducted depending upon the availability of participants. A call for application is posted on NISER&apos;s website and interested applicants are encouraged to apply.
              </p>
              <div className="mt-6 rounded-[1.5rem] border-l-4 border-emerald-600 bg-slate-50 p-5">
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                  <li>Visit the NISER website for the training call announcement.</li>
                  <li>Complete and submit the application form with required documents.</li>
                  <li>Await confirmation of participation.</li>
                  <li>Join the training session at the scheduled date and time.</li>
                </ol>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h3 className="text-xl font-bold text-slate-900">Intensive training</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">Comprehensive, full-time programmes designed for deep skill development and hands-on practice in research methodologies.</p>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h3 className="text-xl font-bold text-slate-900">Crash training</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">Short-term, focused programmes for professionals and scholars seeking quick updates in specific research methodology areas.</p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] p-8 text-center text-white md:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">How can we help?</p>
              <h3 className="mt-3 text-3xl font-bold">Need more information about upcoming sessions?</h3>
              <p className="mt-4 mx-auto max-w-2xl text-base text-emerald-50">Contact us at the NISER office nearest to you or submit an inquiry online for more information about upcoming research methodology trainings.</p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f3d2f] transition hover:bg-emerald-50">Contact NISER</Link>
                <Link href="/training" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">View all training</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
