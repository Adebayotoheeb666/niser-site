<<<<<<< HEAD
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
=======
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTrainingPrograms } from "@/lib/cms/client";
>>>>>>> c16e378 (home page upgrade)

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Training & Capacity Building | NISER",
  description:
    "Professional development programs and workshops in research methodology, policy analysis, and data analytics for government, NGOs, and development professionals.",
};

export default async function TrainingPage() {
  const programs = await getTrainingPrograms();

  const staticPrograms = [
    {
      id: 1,
      title: "Advanced Policy Analysis Workshop",
      level: "Intermediate to Advanced",
      duration: "5 Days",
      frequency: "Quarterly",
      participants: "25-30",
      target: "Government officials, policy makers, development professionals",
      description:
        "Comprehensive training on quantitative and qualitative policy analysis techniques.",
      topics: [
        "Policy Problem Definition",
        "Evidence Synthesis",
        "Cost-Benefit Analysis",
        "Stakeholder Engagement",
        "Policy Implementation Monitoring",
      ],
      featured: true,
    },
    {
      id: 2,
      title: "Research Methods & Design",
      level: "Beginner to Intermediate",
      duration: "4 Days",
      frequency: "Semi-annually",
      participants: "20-25",
      target: "Early-career researchers, graduate students, NGO staff",
      description:
        "Foundational training in research design, methodology, and ethical considerations.",
      topics: [
        "Research Question Formulation",
        "Literature Review Techniques",
        "Research Design Selection",
        "Data Collection Methods",
        "Research Ethics",
      ],
    },
    {
      id: 3,
      title: "Data Analysis & Visualization",
      level: "Intermediate",
      duration: "3 Days",
      frequency: "Bi-monthly",
      participants: "25-30",
      target: "Data analysts, researchers, statisticians",
      description:
        "Practical training in statistical analysis and data visualization tools.",
      topics: [
        "Descriptive Statistics",
        "Regression Analysis",
        "Visualization Principles",
        "R/Python Programming",
        "Dashboard Development",
      ],
    },
    {
      id: 4,
      title: "Public Policy & Governance",
      level: "Beginner",
      duration: "2 Days",
      frequency: "Monthly",
      participants: "30-40",
      target:
        "Civil servants, public sector managers, governance professionals",
      description:
        "Introduction to policy frameworks, institutional structures, and good governance principles.",
      topics: [
        "Policy Cycle Overview",
        "Governance Structures",
        "Public Administration",
        "Anti-corruption Measures",
        "Citizen Engagement",
      ],
    },
    {
      id: 5,
      title: "Economic Development Strategy",
      level: "Advanced",
      duration: "5 Days",
      frequency: "Annually",
      participants: "20-25",
      target:
        "Senior government officials, development consultants, think tank researchers",
      description:
        "In-depth exploration of development economics and strategic planning for emerging economies.",
      topics: [
        "Development Economics Theories",
        "Growth Strategies",
        "Sectoral Analysis",
        "International Trade",
        "Fiscal Sustainability",
      ],
    },
    {
      id: 6,
      title: "Digital Transformation & Data Skills",
      level: "Intermediate",
      duration: "6 Weeks (Online)",
      frequency: "Ongoing",
      participants: "Unlimited",
      target:
        "Government employees, development professionals, business analysts",
      description:
        "Online self-paced program on digital tools and data competencies for the modern workplace.",
      topics: [
        "Digital Literacy",
        "Spreadsheet Mastery",
        "Data Basics",
        "Cloud Tools",
        "Automation & AI Basics",
      ],
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-research-blue py-20 text-on-primary overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white"></div>
          </div>
          <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <span className="text-accent-mint font-label-md text-label-md uppercase tracking-widest block mb-4">
              Build Your Skills
            </span>
            <h1 className="font-display-lg text-display-lg mb-6 leading-tight text-primary-fixed">
              Training & Capacity Building
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl leading-relaxed">
              Professional development programs designed to equip government
              officials, researchers, and development professionals with the
              skills and knowledge needed for evidence-based decision-making.
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline-variant">
          <div className="max-w-max-width mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15+", label: "Programs Annually" },
              { number: "1000+", label: "Professionals Trained" },
              { number: "95%", label: "Satisfaction Rate" },
              { number: "80+", label: "Expert Facilitators" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="font-display-lg text-display-lg text-nigeria-green-deep">
                  {stat.number}
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Program */}
        {staticPrograms[0] && (
          <section className="py-16 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-max-width mx-auto">
              <div className="bg-gradient-to-br from-research-blue to-research-blue/80 rounded-xl p-12 text-on-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-mint/10 rounded-full -mr-48 -mt-48"></div>
                <div className="relative z-10">
                  <span className="inline-block bg-accent-mint/20 text-accent-mint px-3 py-1 rounded-full font-label-sm text-label-sm mb-4">
                    Featured Program
                  </span>
                  <h2 className="font-display-lg text-display-lg text-primary-fixed mb-4">
                    {staticPrograms[0].title}
                  </h2>
                  <p className="font-body-lg text-body-lg text-on-primary-container mb-8 max-w-2xl leading-relaxed">
                    {staticPrograms[0].description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8 py-8 border-t border-on-primary/20 border-b">
                    {[
                      { label: "Level", value: staticPrograms[0].level },
                      { label: "Duration", value: staticPrograms[0].duration },
                      {
                        label: "Frequency",
                        value: staticPrograms[0].frequency,
                      },
                      {
                        label: "Participants",
                        value: staticPrograms[0].participants,
                      },
                      { label: "Target Audience", value: "Multiple" },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <p className="font-label-sm text-label-sm text-on-primary-container opacity-80 mb-1">
                          {item.label}
                        </p>
                        <p className="font-label-md text-label-md font-bold">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    {staticPrograms[0].topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-accent-mint/20 text-accent-mint px-4 py-2 rounded-full font-label-sm text-label-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="bg-accent-mint text-research-blue px-8 py-3 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all">
                      Enroll Now
                    </Link>
                    <Link href="/contact" className="border-2 border-accent-mint text-accent-mint px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-accent-mint/10 transition-all">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Programs Grid */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-high">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">
              All Programs
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl">
              Choose from our comprehensive catalog of training and capacity
              building programs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {staticPrograms.slice(1).map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-lg border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="p-8 flex-1 flex flex-col">
                    <span className="inline-block bg-surface-container-highest text-research-blue px-3 py-1 rounded-full font-label-sm text-label-sm mb-4 w-fit">
                      {program.level}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                      {program.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1">
                      {program.description}
                    </p>

                    {/* Program Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-outline-variant">
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Duration
                        </p>
                        <p className="font-label-md text-label-md text-on-surface font-bold">
                          {program.duration}
                        </p>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Frequency
                        </p>
                        <p className="font-label-md text-label-md text-on-surface font-bold">
                          {program.frequency}
                        </p>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Participants
                        </p>
                        <p className="font-label-md text-label-md text-on-surface font-bold">
                          {program.participants}
                        </p>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                          Format
                        </p>
                        <p className="font-label-md text-label-md text-on-surface font-bold">
                          In-person
                        </p>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="mb-6">
                      <p className="font-label-md text-label-md text-on-surface font-bold mb-2">
                        Topics Covered:
                      </p>
                      <ul className="space-y-1">
                        {program.topics.slice(0, 3).map((topic, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 font-label-sm text-on-surface-variant"
                          >
                            <span className="text-research-blue mt-0.5">✓</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                        {program.topics.length > 3 && (
                          <li className="text-research-blue font-label-sm">
                            +{program.topics.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="px-8 pb-8">
                    <Link href="/contact" className="w-full border border-research-blue text-research-blue px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-research-blue hover:text-white transition-all inline-block text-center">
                      Learn More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Programs */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">
              Upcoming Sessions
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
              Register now for our next scheduled programs.
            </p>

            {programs.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-8">
                No training programmes are currently scheduled. Please check
                back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg hover:border-research-blue transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-headline-md text-headline-md text-on-surface flex-1">
                        {program.title}
                      </h3>
                      <span className="bg-accent-mint/20 text-nigeria-green-deep text-label-sm font-bold px-2 py-1 rounded whitespace-nowrap ml-2">
                        {program.trainingStatus}
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">
                      {program.programType}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-research-blue">
                          calendar_today
                        </span>
                        <span className="font-label-md text-label-md">
                          {new Date(program.startDate).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-research-blue">
                          location_on
                        </span>
                        <span className="font-label-md text-label-md">
                          {program.location ?? "Online"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-research-blue">
                          payments
                        </span>
                        <span className="font-label-md text-label-md">
                          {program.fee ?? "Contact us"}
                        </span>
                      </div>
                    </div>
                    {program.registrationUrl ? (
                      <a
                        href={program.registrationUrl}
                        className="mt-6 w-full bg-nigeria-green-deep text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all block text-center"
                      >
                        Register
                      </a>
                    ) : (
                      <button
                        disabled
                        className="mt-6 w-full bg-surface-container-high text-on-surface-variant py-2 rounded-lg font-label-md text-label-md cursor-not-allowed opacity-50"
                      >
                        Register
                      </button>
                    )}
                  </div>
<<<<<<< HEAD
                  <Link href="/contact" className="mt-6 w-full bg-nigeria-green-deep text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all inline-block text-center">
                    Register
                  </Link>
                </div>
              ))}
            </div>
=======
                ))}
              </div>
            )}
>>>>>>> c16e378 (home page upgrade)
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-surface-container-high px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-12 text-center">
              Why Train with NISER?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {[
                {
                  icon: "🎓",
                  title: "Expert Facilitators",
                  desc: "Learn from leading researchers and policy experts",
                },
                {
                  icon: "📚",
                  title: "Comprehensive Content",
                  desc: "Cutting-edge curriculum aligned with global standards",
                },
                {
                  icon: "🤝",
                  title: "Peer Network",
                  desc: "Connect with professionals across sectors",
                },
                {
                  icon: "✅",
                  title: "Certification",
                  desc: "Receive recognized credentials upon completion",
                },
              ].map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <span className="text-5xl block mb-4">{benefit.icon}</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                    {benefit.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-nigeria-green-deep text-on-primary px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-6">
              Invest in Professional Development
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mx-auto mb-8">
              Enhance your skills and advance your career with NISER&apos;s
              comprehensive training programs.
            </p>
<<<<<<< HEAD
            <Link href="/contact" className="bg-accent-mint text-nigeria-green-deep px-8 py-4 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all inline-flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span> Enroll in a Program
            </Link>
=======
            <button className="bg-accent-mint text-nigeria-green-deep px-8 py-4 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all inline-flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>{" "}
              Enroll in a Program
            </button>
>>>>>>> c16e378 (home page upgrade)
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
