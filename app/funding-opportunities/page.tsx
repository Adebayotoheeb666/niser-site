import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getFundingOpportunities } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Funding Opportunities | NISER",
  description:
    "Explore research funding opportunities, grants, and fellowship programs at NISER.",
};

function isClosingSoon(deadline?: string): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return deadlineDate >= now && deadlineDate <= thirtyDaysFromNow;
}

export default async function FundingOpportunitiesPage() {
  const opportunities = await getFundingOpportunities({ active: true });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Funding Opportunities
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Research grants, fellowships, and funding programs supporting
              innovative policy research and capacity building.
            </p>
          </div>
        </section>

        {/* Funding Programs */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {opportunities.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                No funding opportunities are currently open. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {opportunities.map((opp) => {
                  const closing = isClosingSoon(opp.deadline);
                  const readableDeadline = opp.deadline
                    ? new Date(opp.deadline).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null;

                  return (
                    <div
                      key={opp.id}
                      className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg hover:border-nigeria-green-vibrant transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">
                          {opp.title}
                        </h3>
                        {closing && (
                          <span className="text-label-sm bg-error text-on-error px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                            Closing Soon
                          </span>
                        )}
                      </div>

                      {opp.description && (
                        <p className="text-body-md text-on-surface-variant mb-4">
                          {opp.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-6 text-label-md text-on-surface-variant">
                        <p>
                          <strong>Type:</strong> {opp.fundingType}
                        </p>
                        {opp.amountRange && (
                          <p>
                            <strong>Funding:</strong> {opp.amountRange}
                          </p>
                        )}
                        {readableDeadline && (
                          <p>
                            <strong>Deadline:</strong> {readableDeadline}
                          </p>
                        )}
                        {opp.sponsor && (
                          <p>
                            <strong>Sponsor:</strong> {opp.sponsor}
                          </p>
                        )}
                        {opp.eligibility && (
                          <p>
                            <strong>Eligibility:</strong> {opp.eligibility}
                          </p>
                        )}
                      </div>

                      {opp.applicationUrl ? (
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full border border-nigeria-green-deep text-nigeria-green-deep px-4 py-2 rounded font-label-md text-label-md text-center hover:bg-surface-container-low transition-colors"
                        >
                          Apply / Learn More
                        </a>
                      ) : (
                        <button className="w-full border border-nigeria-green-deep text-nigeria-green-deep px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                          Learn More
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
