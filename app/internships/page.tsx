import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getInternships } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Internship Programs | NISER",
  description:
    "Join NISER as an intern and gain practical experience in policy research and economic analysis.",
};

function formatDate(dateString: string | undefined): string | null {
  if (!dateString) return null;

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function InternshipsPage() {
  const internships = await getInternships({ active: true });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Career development
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Internships that build research and policy careers.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Discover structured opportunities for students and early-career professionals to contribute to high-impact policy research, evidence generation, and institutional work.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{internships.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Current openings</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Research & analysis</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Career</p>
                <p className="mt-1 text-sm text-emerald-100">Professional growth</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-3 mb-16">
              {[
                {
                  title: "Research exposure",
                  description: "Work alongside policy, data, and programme teams on real institutional initiatives.",
                },
                {
                  title: "Analytical practice",
                  description: "Develop skills in evidence synthesis, writing, presentation, and structured problem-solving.",
                },
                {
                  title: "Professional mentorship",
                  description: "Learn from senior researchers and administrators in a collaborative environment.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
                >
                  <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    What interns gain
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                    A practical start to a research career
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    Interns at NISER gain hands-on exposure to policy research, analytics, public engagement, and organisational systems that support evidence-based development in Nigeria.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#edf5f0] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Eligibility
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-700">
                    <li>• Strong academic standing and interest in policy or research</li>
                    <li>• Ability to work collaboratively and communicate clearly</li>
                    <li>• Commitment to professionalism, ethics, and learning</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="mb-8 max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Current openings
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                  Apply to active internship opportunities
                </h2>
              </div>

              {internships.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                  <p className="text-lg font-semibold text-slate-900">No internship opportunities are currently open.</p>
                  <p className="mt-2 text-slate-600">Check back soon for new positions and application windows.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {internships.map((internship) => {
                    const closingDate = formatDate(internship.closingDate);

                    return (
                      <article
                        key={internship.id}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                              {internship.department}
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-900">{internship.title}</h3>

                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                              {internship.duration && (
                                <span><strong className="font-semibold text-slate-900">Duration:</strong> {internship.duration}</span>
                              )}
                              {internship.stipend && (
                                <span><strong className="font-semibold text-slate-900">Stipend:</strong> {internship.stipend}</span>
                              )}
                              {closingDate && (
                                <span><strong className="font-semibold text-slate-900">Deadline:</strong> {closingDate}</span>
                              )}
                            </div>

                            {internship.description && (
                              <p className="mt-4 text-sm leading-6 text-slate-600">{internship.description}</p>
                            )}
                          </div>

                          {internship.applicationUrl ? (
                            <a
                              href={internship.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded-full bg-[#0d3b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123f2f]"
                            >
                              Apply now
                            </a>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
                            >
                              Application closed
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
