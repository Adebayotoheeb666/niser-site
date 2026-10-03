import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const img = (name: string) => `/${encodeURI(name)}`;

export const metadata: Metadata = {
  title: "Behaviour Change Knowledge Centre | NISER",
  description:
    "NISER's Behaviour Change Knowledge Centre curates research and resources on behaviour change for corruption control in Nigeria.",
};

const resourceLinks = [
  {
    title: "Process Observation Reports",
    text: "Service mapping and process observation studies from public agencies like JAMB and the Federal Civil Service Commission.",
    icon: "visibility",
    href: "#process-observation",
  },
  {
    title: "ABC Series Briefs",
    text: "Actualizing Behaviour Change series briefs across six editions, translating research into practical insight.",
    icon: "library_books",
    href: "#abc-series",
  },
  {
    title: "Research Reports & Working Papers",
    text: "Curated research reports, training manuals, and working papers on corruption control through behaviour change.",
    icon: "description",
    href: "#publications",
  },
  {
    title: "International Presentations",
    text: "Conference papers presented at international research conferences on behavioural and social sciences.",
    icon: "public",
    href: "#conference",
  },
];

const abcSeriesEditions = [
  {
    edition: "6th Edition",
    theme:
      "The Heart of Success: How Organisational Culture and Behaviour Drive Organisational Effectiveness",
    text: "Dr. Emmanuel Imafidon (Senior Fellow, Lagos Business School, Pan Atlantic University) presented on how organisational culture and behaviour drive effectiveness.",
    presenter: "Dr. Emmanuel Imafidon",
    image: img("The Heart of Success: How Organisational Culture and Behaviour Drive Organisational Effectiveness.webp"),
  },
  {
    edition: "5th Edition",
    theme: "A Gender-lensed view into Citizens' Lived Experiences of Corrupt Behaviour in Nigeria",
    text: "A gender-lensed approach to the experiences of corrupt behaviour by Nigerian citizens, discussing the disparities, corroborations and implications of the data.",
    presenter: "NISER Research Team",
    image: img("A Gender-lensed view into Citizens’ Lived Experiences of Corrupt Behavour in Nigeria.webp"),
  },
  {
    edition: "4th Edition",
    theme: "Corrupt Behaviour in the Nigerian Public Sector: Simplifying a Complex Phenomenon",
    text: "A complexity theory approach gave an overview of the nature of corrupt behaviour observed in the Nigerian public sector, with discussions on mitigating them.",
    presenter: "NISER Research Team",
    image: img("Corrupt Behaviour in the Nigerian Public Sector: Simplifying a Complex Phenomenon.webp"),
  },
  {
    edition: "3rd Edition",
    theme: "Exploring Models for Behaviour Change Intervention Design: Lessons from Good Practices in the Public Sector",
    text: "Held on May 25, 2023. Findings of good practices and systems from a participant observation survey at JAMB, as an exemplary model of organisational behaviour.",
    presenter: "NISER Research Team",
    image: img("Exploring Models for Behaviour Change Intervention Design: Lessons from Good Practices in the Public Sector.webp"),
  },
  {
    edition: "2nd Edition",
    theme: "Lived Experiences of Corrupt Behaviour in Nigeria",
    text: "Held on November 24, 2022. Findings of a national citizen survey on experiences of corrupt behaviour were shared.",
    presenter: "NISER Research Team",
    image: img("Lived Experiences of Corrupt Behaviour in Nigeria.webp"),
  },
  {
    edition: "1st Edition",
    theme: "Understanding and Analysing Behaviour: Individual and Group Dynamics",
    text: "Held on August 25, 2022. The dynamics of behaviour at the individual and group level were shared and discussed as a precursor to the series.",
    presenter: "NISER Research Team",
    image: img("Individual and Group Dynamics in the Behaviour Process.webp"),
  },
];

const publications = [
  {
    title: "Research Support for Corruption Control",
    text: "Curates the conceptualisation, methodology and findings of the primary survey underpinning the study, understanding the psycho-social elements that factor into corrupt behaviour.",
    label: "Download the Research Report",
    icon: "description",
    image: img("Research Support for Corruption Control.webp"),
  },
  {
    title: "Training Manual: Organisational Behaviour",
    text: "Compiled by the project team to aid the understanding of individual behaviour in organisational settings, group dynamics, structure and culture.",
    label: "Download the Training Manual",
    icon: "school",
    image: img("Training Manual: Organizational Behaviour.webp"),
  },
  {
    title: "Lived Experiences of Corruption: The Plebeians' Perspective",
    text: "A 2022 nationwide SenseMaker survey across the six geo-political zones and the FCT, the first step in building a behavioural change approach for corruption control.",
    label: "Download: Lived Experiences of Corruption",
    icon: "fact_check",
    image: img("Lived Experiences of Corruption: The Plebeians’ Perspective.webp"),
  },
  {
    title: "The Phenomenon of Corruption",
    text: "A summary of a desk review on the multifaceted nature of corruption in Nigeria.",
    label: "Download: The Phenomenon of Corruption",
    icon: "insights",
    image: img("The Phenomenon of Corruption.webp"),
  },
  {
    title: "Political Economy of Service Delivery and Corruption in the Nigerian Civil Service",
    text: "A political economy analysis (PEA) of the factors and players that influence service delivery and corruption in the Nigerian civil service.",
    label: "Download: Political Economy of Service Delivery",
    icon: "account_balance",
    image: img("Political Economy of Service Delivery and Corruption in the Nigerian Civil Service.webp"),
  },
];

const conferencePapers = [
  "Lived Experiences of Nigerian Citizens on Corrupt Behaviour",
  "Understanding Corrupt Behaviour in the Nigerian Public Sector",
  "A Gender Lens into Citizens' Lived Experiences of Corrupt Behaviour",
  "Behavioural Change Policies and Strategies for Quality Regulation in Nigeria's Education Sector",
];

const disciplines = [
  "Public Policy",
  "Political Science",
  "Law",
  "Human Geography",
  "Economics",
  "Technology Management",
  "Statistics",
  "Psychology",
];

export default function BCKCCenterPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-nigeria-green-deep py-20">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 40%, rgba(255,184,28,0.9) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(15,166,155,0.9) 0%, transparent 45%)",
            }}
            aria-hidden="true"
          />
          <div className="relative container text-center">
            <span className="inline-block rounded-full border border-nigeria-gold/40 bg-white/10 px-4 py-1.5 text-label-sm text-on-primary mb-6">
              MacArthur Foundation Grant Project
            </span>
            <h1 className="font-display-md text-display-md text-on-primary mb-4">
              Behaviour Change Knowledge Centre
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-3xl mx-auto">
              A virtual platform curating knowledge on behaviour change for
              corruption control — explainers, working papers, newsletters,
              video skits and blog posts from NISER research and reviews.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-surface-container-lowest">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start mb-16">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">
                  Advancing Evidence-led Behaviour Change
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                  The Behaviour Change Knowledge Centre is a virtual platform
                  on which the body of knowledge on behaviour change for
                  corruption control is curated. These are products from
                  research and reviews by NISER authors, implemented through a
                  MacArthur Foundation Grant Project.
                </p>
                <p className="text-body-md text-on-surface-variant">
                  Training modules on Behaviour Change Research and Behavioural
                  Change Intervention Design are being developed from the
                  content of our knowledge products. These will be short-term
                  courses for the public sector, academia, the research
                  community, civil society and the private sector.
                </p>
              </div>
              <div className="w-full lg:w-72 rounded-2xl border border-surface-gray bg-surface p-6 shrink-0">
                <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-4">
                  Interdisciplinary Foundations
                </h3>
                <ul className="space-y-2.5">
                  {disciplines.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-base text-nigeria-green-vibrant">
                        check_circle
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <figure className="mb-16">
              <div className="relative overflow-hidden rounded-2xl border border-surface-gray bg-surface" style={{ aspectRatio: "1024 / 727" }}>
                <Image
                  src={img("Diagram depicting the interdisciplinary bases of the Behaviour Change Knowledge Centre.webp")}
                  alt="Diagram depicting the interdisciplinary bases of the Behaviour Change Knowledge Centre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-label-sm text-on-surface-variant text-center">
                Diagram depicting the interdisciplinary bases of the Behaviour
                Change Knowledge Centre
              </figcaption>
            </figure>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group bg-surface-container-lowest border border-surface-gray p-6 rounded-xl hover:border-nigeria-green-vibrant hover:shadow-lg transition-all flex flex-col"
                >
                  <span className="w-12 h-12 rounded-full bg-nigeria-green-deep/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-nigeria-green-deep">
                      {item.icon}
                    </span>
                  </span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-4">
                    {item.text}
                  </p>
                  <span className="text-nigeria-green-vibrant font-label-md flex items-center mt-auto group-hover:underline">
                    Explore
                    <span className="material-symbols-outlined text-base ml-1">
                      arrow_forward
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Process Observation Section */}
        <section id="process-observation" className="py-16 bg-surface">
          <div className="container">
            <div className="max-w-3xl mb-10">
              <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                Field Studies
              </span>
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2 mb-3">
                Process Observation Reports
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                Teams of researchers were embedded in two public agencies to
                observe organisational processes, develop a service map of the
                partnering agencies, and identify critical service nodes
                subject to abuse and corruption for behavioural intervention
                design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container-lowest border border-surface-gray p-8 rounded-xl">
                <span className="inline-block rounded-full bg-nigeria-green-deep/10 text-nigeria-green-deep px-3 py-1 text-label-sm mb-4">
                  Education Sector
                </span>
                <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">
                  Joint Admissions and Matriculation Board (JAMB)
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  A process observation study at JAMB mapped service delivery
                  and identified critical nodes vulnerable to abuse, informing
                  behavioural intervention designs for the education sector.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center text-nigeria-green-vibrant font-label-md hover:underline"
                >
                  View the JAMB observation report
                  <span className="material-symbols-outlined text-base ml-1">
                    arrow_forward
                  </span>
                </a>
              </div>

              <div className="bg-surface-container-lowest border border-surface-gray p-8 rounded-xl">
                <span className="inline-block rounded-full bg-nigeria-green-deep/10 text-nigeria-green-deep px-3 py-1 text-label-sm mb-4">
                  Civil Service
                </span>
                <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">
                  Federal Civil Service Commission
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  From April 12 to May 12, 2023, a process observation survey
                  was carried out at the Federal Civil Service Commission to
                  map service nodes and organisational practices.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="relative overflow-hidden rounded-lg border border-surface-gray" style={{ aspectRatio: "4 / 5" }}>
                    <Image
                      src={img("Federal Civil Service Commission.webp")}
                      alt="Federal Civil Service Commission process observation"
                      fill
                      sizes="(max-width: 640px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-surface-gray" style={{ aspectRatio: "4 / 5" }}>
                    <Image
                      src={img("Federal Civil Service Commission-02.webp")}
                      alt="Federal Civil Service Commission - process observation detail"
                      fill
                      sizes="(max-width: 640px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center text-nigeria-green-vibrant font-label-md hover:underline"
                >
                  View the Commission observation report
                  <span className="material-symbols-outlined text-base ml-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABC Series Section */}
        <section id="abc-series" className="py-16 bg-surface-container-lowest">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
              <div className="max-w-3xl">
                <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                  Seminars
                </span>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2">
                  Previous Editions of the ABC Series
                </h2>
                <p className="text-body-lg text-on-surface-variant mt-2">
                  The Actualizing Behaviour Change series translates research
                  findings into practical insight across six editions.
                </p>
              </div>
              <a
                href="/bckc-center/niser-abc-series"
                className="inline-flex items-center rounded-full bg-nigeria-green-deep px-5 py-3 text-label-md text-on-primary hover:opacity-90"
              >
                Visit the ABC Series hub
                <span className="material-symbols-outlined text-base ml-1">
                  arrow_forward
                </span>
              </a>
            </div>

            <div className="mb-12 overflow-hidden rounded-2xl border border-surface-gray bg-surface p-2 shadow-sm">
              <video controls preload="metadata" className="w-full rounded-xl">
                <source
                  src="https://niser.gov.ng/v2/wp-content/uploads/2022/08/Highlights-from-June-2024-ABC-series.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {abcSeriesEditions.map((item) => (
                <div
                  key={item.edition}
                  className="relative bg-surface-container-lowest border border-surface-gray rounded-xl overflow-hidden flex flex-col"
                >
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.theme}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col p-8 pt-6 gap-3 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display-md text-display-md text-nigeria-gold">
                        {item.edition}
                      </span>
                      <span className="text-label-sm text-on-surface-variant text-right">
                        {item.presenter}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">
                      {item.theme}
                    </h3>
                    <p className="text-body-md text-on-surface-variant mb-4">
                      {item.text}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center text-nigeria-green-vibrant font-label-md hover:underline mt-auto"
                    >
                      Download the presentation
                      <span className="material-symbols-outlined text-base ml-1">
                        download
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section id="publications" className="py-16 bg-surface">
          <div className="container">
            <div className="max-w-3xl mb-10">
              <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                Knowledge Products
              </span>
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2 mb-3">
                Research Reports and Working Papers
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                In-depth reports, manuals and papers produced by the research
                project, available for researchers, policymakers and the
                public.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <div
                  key={pub.title}
                  className="bg-surface-container-lowest border border-surface-gray p-6 rounded-xl flex flex-col"
                >
                  {pub.image && (
                    <div className="relative h-44 overflow-hidden rounded-lg mb-4 -mx-1">
                      <Image
                        src={pub.image}
                        alt={pub.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                    {pub.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-5">
                    {pub.text}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center text-nigeria-green-vibrant font-label-md hover:underline mt-auto"
                  >
                    {pub.label}
                    <span className="material-symbols-outlined text-base ml-1">
                      download
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* International Conference Section */}
        <section id="conference" className="py-16 bg-surface-container-lowest">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
              <div className="max-w-3xl">
                <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                  Global Dissemination
                </span>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2 mb-3">
                  International Conference Papers
                </h2>
                <p className="text-body-lg text-on-surface-variant">
                  Research output from the study was presented at the 11th
                  International Conference for Research in Behavioural and Social
                  Sciences (ICRBS), the 7th International Conference on Modern
                  Approaches in Human and Social Sciences, the 2nd World
                  Conference on Gender and Women Studies, and the 5th Barcelona
                  Conference on Education.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-surface-gray bg-surface" style={{ aspectRatio: "3 / 2" }}>
                <Image
                  src={img("International Conference Papers.webp")}
                  alt="International Conference Papers from the Behaviour Change Knowledge Centre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {conferencePapers.map((paper, i) => (
                <div
                  key={paper}
                  className="flex gap-4 items-center bg-surface-container-lowest border border-surface-gray p-6 rounded-xl"
                >
                  <span className="font-display-md text-display-md text-nigeria-gold shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                      {paper}
                    </h3>
                    <span className="text-nigeria-green-vibrant font-label-md flex items-center">
                      Access presentation
                      <span className="material-symbols-outlined text-base ml-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}