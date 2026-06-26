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

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Internship Programs
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Gain hands-on experience in policy research, economic analysis,
              and institutional management at Nigeria&apos;s premier think-tank.
            </p>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Summer Internship",
                  duration: "10-12 weeks",
                  available: "June - September",
                },
                {
                  title: "Graduate Internship",
                  duration: "6 months",
                  available: "Year-round",
                },
                {
                  title: "Postgraduate Internship",
                  duration: "3-4 months",
                  available: "Flexible",
                },
              ].map((program, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg text-center"
                >
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                    {program.title}
                  </h3>
                  <p className="font-body-md text-on-surface-variant mb-2">
                    {program.duration}
                  </p>
                  <p className="text-label-md text-research-blue">
                    {program.available}
                  </p>
                </div>
              ))}
            </div>

            {/* Current Openings */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
                Current Openings
              </h2>
              {internships.length === 0 ? (
                <p className="text-body-md text-on-surface-variant py-8">
                  No internship positions are currently open. Please check back
                  later.
                </p>
              ) : (
                <div className="space-y-4">
                  {internships.map((internship) => (
                    <div
                      key={internship.id}
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">
                          {internship.title}
                        </h4>
                        <p className="text-body-md text-on-surface-variant">
                          {internship.department} | Duration:{" "}
                          {internship.duration} | Deadline:{" "}
                          {internship.closingDate}
                        </p>
                      </div>
                      {internship.applicationUrl ? (
                        <a
                          href={internship.applicationUrl}
                          className="bg-nigeria-green-deep text-on-primary px-6 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity"
                        >
                          Apply Now
                        </a>
                      ) : (
                        <button
                          disabled
                          className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded font-label-md text-label-md cursor-not-allowed opacity-50"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  ))}
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
