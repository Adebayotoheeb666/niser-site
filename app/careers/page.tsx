import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import { getJobs } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers | NISER",
  description:
    "Explore career opportunities at NISER and join our team of policy research professionals.",
};

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <Header />
        <HeroSection
          title="Careers at NISER"
          description="Explore current vacancies, internship pathways, and professional opportunities at the institute."
          subtitle="Join a team shaping policy research and public impact"
        />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="container">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Careers at NISER
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Join us in advancing policy research excellence and contributing
              to national development through meaningful work.
            </p>
          </div>
        </section>

        {/* Why Join NISER */}
        <section className="py-16 bg-surface">
          <div className="container mb-20">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
              Why Join NISER?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Impactful Work",
                  desc: "Contribute to policy research that shapes national development",
                },
                {
                  title: "Professional Growth",
                  desc: "Access to training, conferences, and skill development",
                },
                {
                  title: "Collaborative Environment",
                  desc: "Work with leading researchers and thought leaders",
                },
                {
                  title: "Competitive Compensation",
                  desc: "Attractive salary and benefits package",
                },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <span className="material-symbols-outlined text-nigeria-green-vibrant text-2xl flex-shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="container border-t border-surface-gray pt-16">
            <div className="mb-10 rounded-2xl border border-surface-gray bg-surface-container-lowest p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-3">
                    How to apply
                  </h2>
                  <p className="text-body-md text-on-surface-variant max-w-2xl">
                    Candidates can submit applications through the listed openings or contact the HR team for general inquiries about future opportunities.
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-5">
                  <p className="text-label-md text-nigeria-green-vibrant mb-2">What we look for</p>
                  <ul className="space-y-2 text-body-md text-on-surface-variant">
                    <li>• Strong analytical and research capabilities</li>
                    <li>• Commitment to public impact and collaboration</li>
                    <li>• Relevant academic or professional experience</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
              Open Positions
            </h2>
            {jobs.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                No open positions at this time. Check back soon.
              </p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">
                          {job.title}
                        </h3>
                        <p className="text-body-md text-on-surface-variant">
                          {job.department}
                        </p>
                        <p className="text-body-md text-on-surface-variant">
                          {job.location}
                        </p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-research-blue/10 text-research-blue rounded-full font-label-sm text-label-sm whitespace-nowrap">
                        {job.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-label-sm text-outline">
                        Posted: {job.postedDate}
                      </span>
                      {job.applicationUrl ? (
                        <a
                          href={job.applicationUrl}
                          className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline"
                        >
                          View Details{" "}
                          <span className="material-symbols-outlined text-base ml-1">
                            arrow_forward
                          </span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="text-outline font-label-md flex items-center cursor-not-allowed opacity-50"
                        >
                          View Details{" "}
                          <span className="material-symbols-outlined text-base ml-1">
                            arrow_forward
                          </span>
                        </button>
                      )}
                    </div>
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
