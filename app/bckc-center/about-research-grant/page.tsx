import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About Research Grant | BCKC Center",
  description:
    "Research support for corruption control through behaviour change at the BCKC Center.",
};

const pillars = [
  {
    title: "Research & Capacity Building",
    text: "Strengthening research capability and advancing behavioural change methods in the social sciences.",
    icon: "science",
  },
  {
    title: "Communication & Dissemination",
    text: "Sharing evidence, insights, and key messages with practitioners and wider audiences.",
    icon: "campaign",
  },
  {
    title: "Institutionalization",
    text: "Building a lasting knowledge centre to sustain learning and improve intervention design.",
    icon: "apartment",
  },
];

const partners = [
  "ICPC – Anti-Corruption Academy of Nigeria (ACAN)",
  "Nigeria Economic Summit Group (NESG)",
  "Nigerian Institute for Policy and Strategic Studies (NIPSS)",
];

export default function AboutResearchGrantPage() {
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
              About the Research Grant
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-3xl mx-auto">
              Research support for corruption control through behaviour change —
              a MacArthur Foundation funded initiative at NISER.
            </p>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-surface-container-lowest">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start mb-16">
              <div>
                <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                  The Initiative
                </span>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2 mb-4">
                  Research Support for Corruption Control through Behaviour
                  Change
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
                  The Nigerian Institute of Social and Economic Research (NISER)
                  is a beneficiary of a MacArthur Foundation research grant
                  focused on strengthening corruption control through
                  behavioural methodologies and evidence-led behaviour change
                  outcomes.
                </p>
                <p className="text-body-md text-on-surface-variant">
                  NISER is supporting corruption control primarily through
                  research. The project seeks to understand corrupt behaviour,
                  why people act the way they do, and what barriers limit
                  meaningful change. This understanding helps shape more
                  effective interventions for anti-corruption efforts.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">
                  Project Duration
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  September 1, 2021 to August 31, 2024.
                </p>
                <div className="mt-4 flex items-center gap-2 text-label-md text-nigeria-green-vibrant">
                  <span className="material-symbols-outlined text-base">
                    calendar_month
                  </span>
                  Three-year funded research programme
                </div>
              </div>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest border border-surface-gray p-6 rounded-xl"
                >
                  <span className="w-12 h-12 rounded-full bg-nigeria-green-deep/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-nigeria-green-deep">
                      {item.icon}
                    </span>
                  </span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-surface">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                  Influence & Evidence
                </span>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2 mb-4">
                  Shaping Practice and Policy
                </h2>
                <p className="text-body-md text-on-surface-variant mb-6">
                  The research is intended to influence thinking within the
                  community of practice through better conceptualization,
                  intervention design, knowledge management, and dissemination
                  of messages on corrupt behaviour. It is also expected to
                  improve the ability of researchers and institutions to
                  generate evidence that supports behavioural change solutions
                  for corruption control.
                </p>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                    Expected Impact
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-0">
                    Ultimately, the program aims to provide evidence that
                    supports decision-making and policy development on
                    corruption control in Nigeria, with behavioural solutions
                    and interventions mainstreamed into organizations and
                    systems, especially within the public sector.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-surface-gray bg-surface-container-lowest p-8">
                <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-6">
                  Partner Organizations
                </h3>
                <ul className="space-y-4">
                  {partners.map((partner) => (
                    <li
                      key={partner}
                      className="flex items-center gap-3 text-body-md text-on-surface-variant"
                    >
                      <span className="w-9 h-9 rounded-full bg-nigeria-gold/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-nigeria-green-deep text-base">
                          verified
                        </span>
                      </span>
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-16 bg-surface-container-lowest">
          <div className="container">
            <div className="max-w-3xl mb-8">
              <span className="text-label-md text-nigeria-green-vibrant font-semibold uppercase tracking-wide">
                Highlights
              </span>
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mt-2">
                June 2024 Actualizing Behaviour Change Series
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-2">
                A recap of the latest edition of the ABC Series, translating
                behaviour change research into practical insight.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-surface-gray bg-surface p-2 shadow-sm">
              <video controls preload="metadata" className="w-full rounded-xl">
                <source
                  src="https://niser.gov.ng/v2/wp-content/uploads/2022/08/Highlights-from-June-2024-ABC-series.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}