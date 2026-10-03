import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Subscribe to NISER Updates | NISER',
  description: 'Stay informed with NISER&apos;s newsletters and research updates delivered to your inbox.',
};

export default function SubscribePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Stay connected
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Subscribe to NISER updates</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Receive the latest research findings, policy briefs, event invitations, and important institutional updates directly in your inbox.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Research</p>
                <p className="mt-1 text-sm text-emerald-100">Latest findings</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Events</p>
                <p className="mt-1 text-sm text-emerald-100">Seminars & webinars</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">News</p>
                <p className="mt-1 text-sm text-emerald-100">Institutional updates</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-2xl">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Choose your newsletter</h2>

              <form className="mt-8 space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">Select newsletters</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'research-digest', label: 'Research Digest', desc: 'Weekly summary of latest publications' },
                      { name: 'policy-updates', label: 'Policy Updates', desc: 'Monthly policy briefs and recommendations' },
                      { name: 'event-invitations', label: 'Event Invitations', desc: 'Webinars, seminars, and conferences' },
                      { name: 'careers-news', label: 'Careers & Opportunities', desc: 'Job openings and fellowship programs' },
                    ].map((newsletter) => (
                      <label key={newsletter.name} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50">
                        <input type="checkbox" aria-label={newsletter.label} className="mt-1 h-4 w-4 accent-emerald-600" defaultChecked />
                        <div>
                          <p className="font-semibold text-slate-900">{newsletter.label}</p>
                          <p className="text-sm text-slate-600">{newsletter.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="frequency" className="mb-2 block text-sm font-semibold text-slate-700">
                    Delivery frequency
                  </label>
                  <select id="frequency" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                    <option>As it happens</option>
                  </select>
                </div>

                <button type="submit" className="w-full rounded-full bg-[#0f3d2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#184f42]">
                  Subscribe
                </button>

                <p className="text-center text-sm text-slate-500">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
