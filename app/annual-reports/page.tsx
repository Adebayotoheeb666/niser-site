/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAnnualReports } from "@/lib/cms/client";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Annual Reports | NISER",
  description:
    "Access NISER&apos;s annual reports documenting research activities, achievements, and institutional performance.",
};

export default async function AnnualReportsPage() {
  const allReports = await getAnnualReports();
  const reports = [...allReports].sort((a, b) => b.year - a.year);

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Annual Reports
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Comprehensive documentation of NISER&apos;s research activities,
              achievements, and institutional performance.
            </p>
          </div>
        </section>

        {/* Reports Archive */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {reports.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                No annual reports available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-6">
                      {report.coverImage && (
                        <img
                          src={report.coverImage}
                          alt={`${report.year} Annual Report cover`}
                          className="w-16 h-20 object-cover rounded shadow-sm flex-shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">
                          {report.title ?? `${report.year} Annual Report`}
                        </h3>
                        {report.highlights && (
                          <p className="text-body-md text-on-surface-variant">
                            {report.highlights}
                          </p>
                        )}
                      </div>
                    </div>
                    {report.pdfFile ? (
                      <a
                        href={report.pdfFile}
                        download
                        className="bg-nigeria-green-deep text-on-primary px-6 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-base">
                          download
                        </span>{" "}
                        Download PDF
                      </a>
                    ) : (
                      <button
                        disabled
                        className="bg-surface-container-high text-on-surface-variant px-6 py-2 rounded font-label-md text-label-md cursor-not-allowed opacity-50 flex items-center gap-2 whitespace-nowrap"
                      >
                        <span className="material-symbols-outlined text-base">
                          download
                        </span>{" "}
                        Download PDF
                      </button>
                    )}
                  </div>
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
