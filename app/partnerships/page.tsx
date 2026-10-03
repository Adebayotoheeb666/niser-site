import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPartners } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partnerships | NISER",
  description:
    "Discover NISER&apos;s strategic partnerships with international institutions and development organizations.",
};

function getPartnerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2) || "NP";
}

export default async function PartnershipsPage() {
  const partners = await getPartners({ limit: 100 });

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,107,63,0.12),_transparent_30%)]" />
          <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid items-end gap-8 lg:grid-cols-[1.7fr_0.9fr]">
              <div>
                <span className="inline-flex items-center rounded-full border border-[#DCEFE4] bg-[#F2FBF6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                  Strategic collaborations
                </span>
                <h1 className="mt-5 max-w-3xl font-['Playfair_Display',_Georgia,_serif] text-4xl font-bold tracking-tight text-[#0b1b13] sm:text-5xl lg:text-6xl">
                  Partnerships that strengthen policy research and public impact.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  NISER works with universities, government agencies, philanthropic groups, and research institutions to generate evidence, build capacity, and support better policy decisions across Nigeria and beyond.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#0A5F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084d34]"
                  >
                    Explore partnership opportunities
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                  >
                    About NISER
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Network reach
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-['Playfair_Display',_Georgia,_serif] text-5xl font-bold text-white">
                    {partners.length}
                  </span>
                  <span className="pb-2 text-sm text-slate-300">active partners</span>
                </div>
                <div className="mt-6 space-y-4 text-sm text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span>Policy exchange</span>
                    <span className="font-semibold text-[#D8F5E3]">National + global</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span>Research collaboration</span>
                    <span className="font-semibold text-[#D8F5E3]">Multi-partner</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Capacity building</span>
                    <span className="font-semibold text-[#D8F5E3]">Institutional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Policy exchange",
                text: "We convene evidence, expertise, and implementation partners to improve public policy outcomes and institutional reforms.",
              },
              {
                title: "Research collaboration",
                text: "Joint fieldwork, comparative analysis, and co-authored studies expand the quality and reach of our work.",
              },
              {
                title: "Capacity building",
                text: "We support institutions through training, technical assistance, and knowledge transfer across research ecosystems.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F7EE] text-lg text-[#0A5F3D]">
                  ✦
                </div>
                <h2 className="font-['Playfair_Display',_Georgia,_serif] text-2xl font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#F4F7F5] py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                  Collaboration network
                </p>
                <h2 className="mt-2 font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold text-slate-900 sm:text-4xl">
                  Institutional partners
                </h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
                {partners.length} partners listed
              </span>
            </div>

            {partners.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
                No partnership records are currently available from the CMS.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {partners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.websiteUrl ?? "/contact"}
                    target={partner.websiteUrl ? "_blank" : undefined}
                    rel={partner.websiteUrl ? "noopener noreferrer" : undefined}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#BFE6CF] hover:shadow-xl"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F7EE] text-sm font-bold text-[#0A5F3D]">
                        {getPartnerInitials(partner.name)}
                      </div>
                      <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                        {partner.partnerType || "Partner"}
                      </span>
                    </div>

                    <h3 className="font-['Playfair_Display',_Georgia,_serif] text-xl font-bold text-slate-900 transition group-hover:text-[#0A5F3D]">
                      {partner.name}
                    </h3>

                    {partner.country && (
                      <p className="mt-2 text-sm text-slate-500">{partner.country}</p>
                    )}

                    {partner.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {partner.description}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A5F3D]">
                      View partner
                      <span aria-hidden="true">→</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#0B1B13] px-6 py-8 text-white shadow-[0_30px_80px_rgba(11,27,19,0.18)] sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C7F0D3]">
                  Partner with NISER
                </p>
                <h2 className="mt-3 font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Build evidence, share expertise, and expand policy impact.
                </h2>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b1b13] transition hover:bg-slate-100"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
