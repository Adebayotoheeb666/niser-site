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
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Webinars & Events
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Join us for webinars, seminars, and roundtable discussions
              featuring leading researchers and policy experts.
            </p>
          </div>
        </section>

        {/* Upcoming & Past Events */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {/* Upcoming Webinars */}
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8 pb-3 border-b border-surface-gray">
              Upcoming Webinars
            </h2>

            {upcoming.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                No webinars are currently scheduled. Check back soon.
              </p>
            ) : (
              <div className="space-y-6 mb-16">
                {upcoming.map((event) => {
                  const month = new Date(event.startDate)
                    .toLocaleString("en-US", { month: "short" })
                    .toUpperCase();
                  const day = new Date(event.startDate).getDate();
                  const readableDate = new Date(
                    event.startDate,
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  const speakerNames = event.speakers
                    ?.map((s) => s.fullName)
                    .join(", ");

                  return (
                    <div
                      key={event.id}
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center min-w-[80px] bg-nigeria-green-deep text-on-primary rounded-lg p-3">
                          <span className="font-label-sm">{month}</span>
                          <span className="font-display-md text-display-md">
                            {day}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">
                            {event.title}
                          </h3>
                          <p className="text-body-md text-on-surface-variant mb-1">
                            {readableDate}
                          </p>
                          {speakerNames && (
                            <p className="text-label-md text-on-surface-variant">
                              Speakers: {speakerNames}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={event.registrationUrl ?? "#"}
                        className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline"
                      >
                        Register{" "}
                        <span className="material-symbols-outlined text-base ml-1">
                          arrow_forward
                        </span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Past Webinars */}
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8 pb-3 border-b border-surface-gray">
              Past Webinars
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              View past webinars in the Events section for full archives.
            </p>

            {past.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-4">
                No past webinars recorded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {past.map((event) => {
                  const readableDate = new Date(
                    event.startDate,
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={event.id}
                      className="bg-surface-container-lowest border border-surface-gray px-6 py-4 rounded-lg flex items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-label-md text-label-md text-nigeria-green-deep">
                          {event.title}
                        </h3>
                        <p className="text-body-sm text-on-surface-variant">
                          {readableDate}
                        </p>
                      </div>
                      {event.recordingUrl && (
                        <a
                          href={event.recordingUrl}
                          className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline shrink-0"
                        >
                          Watch Recording{" "}
                          <span className="material-symbols-outlined text-base ml-1">
                            play_circle
                          </span>
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
