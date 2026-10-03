import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEvents } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Webinars & Events | NISER",
  description:
    "Join NISER webinars, seminars, and virtual events featuring leading researchers and policymakers.",
};

export default async function WebinarsPage() {
  const allEvents = await getEvents({ limit: 100 });
  const webinars = allEvents.filter((e) => e.eventType === "webinar");
  const now = new Date().toISOString();
  const upcoming = webinars.filter((e) => e.startDate >= now);
  const past = webinars.filter((e) => e.startDate < now);

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Events
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Webinars & events</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Join webinars, seminars, and roundtable discussions featuring leading researchers and policy experts.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{upcoming.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Upcoming sessions</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Expert conversations</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Research</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence & ideas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Upcoming webinars</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Upcoming events</h2>
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No webinars are currently scheduled.</p>
                <p className="mt-2 text-slate-600">Check back soon for upcoming events.</p>
              </div>
            ) : (
              <div className="space-y-6 mb-16">
                {upcoming.map((event) => {
                  const month = new Date(event.startDate).toLocaleString("en-US", { month: "short" }).toUpperCase();
                  const day = new Date(event.startDate).getDate();
                  const readableDate = new Date(event.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const speakerNames = event.speakers?.map((s) => s.fullName).join(", ");

                  return (
                    <article key={event.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                      <div className="flex flex-col gap-5 md:flex-row">
                        <div className="flex min-w-[90px] flex-col items-center justify-center rounded-[1.5rem] bg-[#0f3d2f] p-4 text-white md:py-6">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">{month}</span>
                          <span className="mt-2 text-3xl font-bold">{day}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900">{event.title}</h3>
                          <p className="mt-2 text-sm font-medium text-slate-500">{readableDate}</p>
                          {speakerNames && <p className="mt-3 text-sm text-slate-600">Speakers: {speakerNames}</p>}
                          <a
                            href={event.registrationUrl ?? "#"}
                            className="mt-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                          >
                            Register
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Past webinars</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Recent recordings and archives</h2>
            </div>

            {past.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-slate-600">No past webinars recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {past.map((event) => {
                  const readableDate = new Date(event.startDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <div key={event.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{readableDate}</p>
                      </div>
                      {event.recordingUrl && (
                        <a href={event.recordingUrl} className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100">
                          Watch recording
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
