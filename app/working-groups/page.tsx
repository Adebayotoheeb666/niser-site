import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getWorkingGroups } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Working Groups | NISER",
  description:
    "Learn about NISER&apos;s collaborative working groups focused on key research areas and policy challenges.",
};

export default async function WorkingGroupsPage() {
  const groups = await getWorkingGroups();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Research communities
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Research working groups</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Collaborative teams advancing frontier research on critical development challenges and policy priorities.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Collab</p>
                <p className="mt-1 text-sm text-emerald-100">Interdisciplinary research</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence-driven outputs</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Engage</p>
                <p className="mt-1 text-sm text-emerald-100">Open collaboration</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Research communities</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Collaborative spaces for policy and evidence</h2>
            </div>

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Interdisciplinary collaboration",
                  text: "Researchers from multiple fields combine expertise to address complex development questions.",
                },
                {
                  title: "Policy-focused outputs",
                  text: "Each group produces policy briefs, technical notes, and evidence-based recommendations.",
                },
                {
                  title: "Open engagement",
                  text: "External partners and visiting scholars are welcome to contribute to ongoing discussions.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mb-10 rounded-[2rem] border border-slate-200 bg-[#edf5f0] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Current communities</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">Current research communities</h3>
                  <p className="mt-3 max-w-2xl text-slate-600">These working groups bring together specialists and practitioners to shape rigorous research and practical policy advice.</p>
                </div>
                <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-[#0f3d2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#184f42]">
                  Request a collaboration
                </a>
              </div>
            </div>

            {groups.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Working group information will be published here as new research communities are launched.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {groups.map((group) => (
                  <article key={group.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">{group.title}</h3>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${group.isActive ? 'bg-[#0f3d2f] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {group.membersCount != null && <span>{group.membersCount} members</span>}
                      {group.lead?.fullName && <span>Led by {group.lead.fullName}</span>}
                      {group.established && <span>Est. {group.established}</span>}
                    </div>

                    {group.focusArea && <p className="mt-4 text-sm leading-6 text-slate-600">{group.focusArea}</p>}

                    {group.email ? (
                      <a href={`mailto:${group.email}`} className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                        Contact group
                      </a>
                    ) : (
                      <button className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                        View group
                      </button>
                    )}
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
