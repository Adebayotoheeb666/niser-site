import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicationsClient from "@/components/publications/PublicationsClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Publications | NISER",
  description: "Browse NISER's publications: reports, working papers, briefs and more.",
};

export default function PublicationsPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Research output
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Publications that turn evidence into action.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Browse NISER&apos;s latest research outputs, policy briefs, working papers, and institutional reports designed to inform policy, practice, and public debate.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Current</p>
                <p className="mt-1 text-sm text-emerald-100">Latest research</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence for action</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Archive</p>
                <p className="mt-1 text-sm text-emerald-100">Institutional memory</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="grid gap-8 xl:grid-cols-[1.7fr_0.9fr]">
              <div>
                <div className="mb-10 max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Latest outputs
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                    Research and policy insights from our programme areas
                  </h2>
                </div>

                <Suspense
                  fallback={
                    <div className="py-12 text-sm text-slate-500" role="status" aria-live="polite">
                      Loading publications…
                    </div>
                  }
                >
                  <PublicationsClient />
                </Suspense>
              </div>

              <aside className="xl:pt-20">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Quick filters
                  </p>
                  <div className="mt-5 space-y-3">
                    <Link href="/publications?type=policy_brief" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                      Policy briefs
                    </Link>
                    <Link href="/publications?type=working_paper" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                      Working papers
                    </Link>
                    <Link href="/publications?type=annual_report" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                      Annual reports
                    </Link>
                    <Link href="/publications?division=governance" className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800">
                      Governance
                    </Link>
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#edf5f0] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      Full archive
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Explore the complete institutional collection of NISER research outputs and legacy publications.
                    </p>
                    <Link href="/publications-archive" className="mt-4 inline-flex items-center rounded-xl bg-[#0f3d2f] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                      Browse full archive
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
