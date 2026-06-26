/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getGovernanceMembers } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Governance | NISER",
  description:
    "Learn about NISER&apos;s governance structure, leadership, and strategic direction.",
};

export default async function GovernancePage() {
  const [executives, boardMembers] = await Promise.all([
    getGovernanceMembers({ roleType: "executive" }),
    getGovernanceMembers({ roleType: "board" }),
  ]);

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Governance & Leadership
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              NISER is governed by a Board of Trustees and led by an experienced
              executive team committed to research excellence and institutional
              integrity.
            </p>
          </div>
        </section>

        {/* Leadership Structure */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {/* Executive Leadership */}
            <div className="mb-20">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
                Executive Leadership
              </h2>
              {executives.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  No members listed at this time.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {executives.map((member) => (
                    <div
                      key={member.id}
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg"
                    >
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-on-surface-variant text-3xl">
                            person
                          </span>
                        </div>
                      )}
                      <span className="text-label-md text-research-blue font-bold">
                        {member.memberTitle}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2 mt-2">
                        {member.name}
                      </h3>
                      <p className="text-body-md text-on-surface-variant">
                        {member.bio}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Board of Trustees */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
                Board of Trustees
              </h2>
              {boardMembers.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  No members listed at this time.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {boardMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-surface-container-lowest p-6 rounded-lg border border-surface-gray"
                    >
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-on-surface-variant text-3xl">
                            person
                          </span>
                        </div>
                      )}
                      <span className="text-label-md text-research-blue font-bold">
                        {member.memberTitle}
                      </span>
                      <h4 className="font-label-md text-nigeria-green-deep font-bold mb-1 mt-2">
                        {member.name}
                      </h4>
                      <p className="text-body-md text-on-surface-variant">
                        {member.bio}
                      </p>
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
