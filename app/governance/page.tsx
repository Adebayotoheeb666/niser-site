import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getGovernanceMembers } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Governance | NISER",
  description:
    "Learn about NISER&apos;s governance structure, leadership, and strategic direction.",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function GovernancePage() {
  const [executives, boardMembers] = await Promise.all([
    getGovernanceMembers({ roleType: "executive" }),
    getGovernanceMembers({ roleType: "board" }),
  ]);

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Leadership & oversight
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Governance that advances research, integrity, and impact.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                NISER is guided by a Board of Trustees and a dedicated executive leadership team committed to strong institutional governance, research excellence, and public value.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{executives.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Executive leaders</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{boardMembers.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Board members</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Strategy</p>
                <p className="mt-1 text-sm text-emerald-100">Institutional direction</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Executive leadership
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Senior leadership guiding NISER’s mission
              </h2>
            </div>

            {executives.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No executive members are listed at the moment.</p>
                <p className="mt-2 text-slate-600">Please check back soon for updates to the leadership team.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {executives.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                  >
                    <div className="flex items-start gap-4">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 rounded-full object-cover ring-4 ring-emerald-50"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-800 ring-4 ring-white">
                          {getInitials(member.name)}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
                          {member.memberTitle ?? "Leadership"}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{member.name}</h3>
                      </div>
                    </div>

                    <p className="mt-5 text-base leading-7 text-slate-600">
                      {member.bio || "Leadership profile details will be published here."}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#edf5f0] py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Governing body
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Board of Trustees and strategic oversight
              </h2>
            </div>

            {boardMembers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No board members are listed at this time.</p>
                <p className="mt-2 text-slate-600">Updates to the Board of Trustees will appear here as they are published.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {boardMembers.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                  >
                    <div className="flex items-center gap-3">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-full object-cover ring-4 ring-emerald-50"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800 ring-4 ring-white">
                          {getInitials(member.name)}
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {member.memberTitle ?? "Board member"}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{member.name}</h3>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {member.bio || "Board member profile details will be published here."}
                    </p>
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
