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
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Research Working Groups
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Collaborative teams advancing frontier research on critical
              development challenges and policy priorities.
            </p>
          </div>
        </section>

        {/* Working Groups Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {groups.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                Working group information coming soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg hover:border-nigeria-green-vibrant transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">
                        {group.title}
                      </h3>
                      <span
                        className={`text-label-sm px-2 py-0.5 rounded-full shrink-0 ${
                          group.isActive
                            ? "bg-nigeria-green-deep text-on-primary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {group.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-label-md text-on-surface-variant">
                      {group.membersCount != null && (
                        <span>{group.membersCount} Members</span>
                      )}
                      {group.lead?.fullName && (
                        <>
                          <span>•</span>
                          <span>Led by {group.lead.fullName}</span>
                        </>
                      )}
                      {group.established && (
                        <>
                          <span>•</span>
                          <span>Est. {group.established}</span>
                        </>
                      )}
                    </div>

                    {group.focusArea && (
                      <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                        {group.focusArea}
                      </p>
                    )}

                    {group.email ? (
                      <a
                        href={`mailto:${group.email}`}
                        className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline"
                      >
                        Contact Group{" "}
                        <span className="material-symbols-outlined text-base ml-1">
                          arrow_forward
                        </span>
                      </a>
                    ) : (
                      <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                        View Group{" "}
                        <span className="material-symbols-outlined text-base ml-1">
                          arrow_forward
                        </span>
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
