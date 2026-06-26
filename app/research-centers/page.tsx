import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getResearchCenters } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Research Centers | NISER",
  description:
    "Explore NISER&apos;s specialized research centers driving innovation in socioeconomic research.",
};

export default async function ResearchCentersPage() {
  const centers = await getResearchCenters();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Research Centers
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Specialized centers driving innovation and excellence in
              socioeconomic research and policy analysis.
            </p>
          </div>
        </section>

        {/* Centers Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {centers.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                Research center information coming soon.
              </p>
            ) : (
              <div className="space-y-12">
                {centers.map((center) => {
                  const directorName = center.director
                    ? [center.director.titlePrefix, center.director.fullName]
                        .filter(Boolean)
                        .join(" ")
                    : null;

                  return (
                    <div
                      key={center.id}
                      className="border-l-4 border-nigeria-green-deep pl-8 py-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">
                            {center.name}
                            {center.shortName && (
                              <span className="text-label-md text-on-surface-variant ml-2">
                                ({center.shortName})
                              </span>
                            )}
                          </h3>
                        </div>
                        {center.established && (
                          <span className="text-label-sm text-on-surface-variant shrink-0">
                            Est. {center.established}
                          </span>
                        )}
                      </div>

                      {directorName && (
                        <p className="font-label-md text-on-surface-variant mb-3">
                          Director: {directorName}
                        </p>
                      )}

                      {center.focusAreas && center.focusAreas.length > 0 && (
                        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                          {center.focusAreas.join(" · ")}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-6 text-label-md text-on-surface-variant mb-4">
                        {center.activeProjects != null && (
                          <span>
                            Active Projects:{" "}
                            <strong>{center.activeProjects}</strong>
                          </span>
                        )}
                        {center.email && (
                          <a
                            href={`mailto:${center.email}`}
                            className="text-nigeria-green-vibrant hover:underline"
                          >
                            {center.email}
                          </a>
                        )}
                        {center.websiteUrl && (
                          <a
                            href={center.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-nigeria-green-vibrant flex items-center hover:underline"
                          >
                            Learn More{" "}
                            <span className="material-symbols-outlined text-base ml-1">
                              arrow_forward
                            </span>
                          </a>
                        )}
                      </div>

                      {!center.websiteUrl && (
                        <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                          Learn More{" "}
                          <span className="material-symbols-outlined text-base ml-1">
                            arrow_forward
                          </span>
                        </button>
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
