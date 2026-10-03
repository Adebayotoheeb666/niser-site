import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NISER Research Seminar Series | NISER',
  description: 'NISER Research Seminar Series - regular seminars featuring researchers and policy experts.',
};

export default function SeminarSeriesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Seminar series</span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">NISER Research Seminar Series</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Regular seminars that bring together researchers, policymakers, and practitioners to discuss recent evidence and policy implications.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Upcoming</p>
                <p className="mt-1 text-sm text-emerald-100">Scheduled talks</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Archive</p>
                <p className="mt-1 text-sm text-emerald-100">Past presentations</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Engage</p>
                <p className="mt-1 text-sm text-emerald-100">Register & attend</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Seminar series</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Talks, presentations, and research conversations</h2>
            </div>

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Upcoming seminars and registration details will be posted here.</p>
              <p className="mt-2 text-slate-600">Sign up to receive announcements about upcoming talks and recordings.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
