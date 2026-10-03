import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCaseStudies } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Services & Offerings | NISER",
  description:
    "NISER's comprehensive range of research, policy advisory, training, and data services tailored for government, development partners, and the private sector.",
};

export default async function ServicesPage() {
  const caseStudies = await getCaseStudies();

  const services = [
    {
      id: 1,
      title: "Policy Research & Advisory",
      icon: "📊",
      description:
        "Evidence-based policy research and strategic advisory to government agencies, development partners, and stakeholders.",
      features: [
        "Fiscal Policy Analysis",
        "Sectoral Economic Studies",
        "Institutional Reform Assessments",
        "Strategic Planning Support",
      ],
      cta: "Request Research Brief",
      href: "/contact",
      highlighted: true,
    },
    {
      id: 2,
      title: "Institutional Surveys & Data Collection",
      icon: "📋",
      description:
        "Large-scale primary data collection, household surveys, and institutional assessments for evidence generation.",
      features: [
        "Household Surveys",
        "Administrative Data",
        "Rapid Assessments",
        "Impact Evaluations",
      ],
      cta: "Schedule Consultation",
      href: "/contact",
    },
    {
      id: 3,
      title: "Capacity Building & Training",
      icon: "🎓",
      description:
        "Professional development programs, workshops, and training in research methodology and policy analysis.",
      features: [
        "Research Methods Workshops",
        "Data Analysis Training",
        "Policy Writing Seminars",
        "Leadership Programs",
      ],
      cta: "Explore Programs",
      href: "/training",
    },
    {
      id: 4,
      title: "Data Services & Analytics",
      icon: "💾",
      description:
        "Access to curated research datasets, data visualization, and custom analytical services.",
      features: [
        "Open Data Catalogue",
        "Custom Datasets",
        "Data Visualization",
        "Analytics Dashboard",
      ],
      cta: "Browse Datasets",
      href: "/data",
    },
    {
      id: 5,
      title: "Consultancy Services",
      icon: "🤝",
      description:
        "Specialized consulting on economic development, governance, and sectoral transformation strategies.",
      features: [
        "Development Strategy",
        "Sector Analysis",
        "Institutional Design",
        "Change Management",
      ],
      cta: "Get Consulting Proposal",
      href: "/contact",
    },
    {
      id: 6,
      title: "Publication & Dissemination",
      icon: "📚",
      description:
        "Research dissemination through journals, policy briefs, books, and multimedia platforms.",
      features: [
        "Policy Briefs",
        "Working Papers",
        "Books & Reports",
        "Media Commentary",
      ],
      cta: "View Publications",
      href: "/publications",
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Our offerings
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Research & advisory services</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">NISER provides data-driven research, policy advisory, training, and analytic services that support evidence-based development across Nigeria and beyond.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">6</p>
                <p className="mt-1 text-sm text-emerald-100">Core service lines</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Policy</p>
                <p className="mt-1 text-sm text-emerald-100">Evidence & advisory</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Impact</p>
                <p className="mt-1 text-sm text-emerald-100">Development outcomes</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Our core services</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Tailored solutions for policy, research, and capacity needs</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`relative group rounded-3xl p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)] ${
                    service.highlighted ? "bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white md:col-span-2 xl:col-span-1" : "border border-slate-200 bg-white text-slate-900"
                  }`}
                >
                  <div className="relative z-10">
                    <span className="text-4xl block mb-4">{service.icon}</span>
                    <h3 className={`text-xl font-bold ${service.highlighted ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
                    <p className={`mt-3 text-sm leading-6 ${service.highlighted ? 'text-emerald-50' : 'text-slate-600'}`}>{service.description}</p>

                    <ul className="mt-6 space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <span className={`${service.highlighted ? 'text-emerald-200' : 'text-emerald-700'}`}>✓</span>
                          <span className={service.highlighted ? 'text-emerald-50' : 'text-slate-700'}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={service.href}
                      className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                        service.highlighted ? 'bg-white text-[#0f3d2f] hover:bg-emerald-50' : 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {service.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#edf5f0] py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Service highlights</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Success stories and recent engagements</h2>
            </div>

            {caseStudies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Case studies coming soon.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {caseStudies.map((cs: { id: string; title: string; client?: string; description?: string; outcomeMetric?: string; year?: number; }) => (
                  <article key={cs.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]">
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Case study</span>
                    <h3 className="mt-4 text-xl font-bold text-slate-900">{cs.title}</h3>
                    {cs.client && <p className="mt-2 text-sm font-medium text-slate-500">{cs.client}</p>}
                    {cs.description && <p className="mt-3 text-sm leading-6 text-slate-600">{cs.description.slice(0, 220)}</p>}
                    {cs.outcomeMetric && <div className="mt-5 border-t border-slate-200 pt-4 text-lg font-bold text-emerald-700">{cs.outcomeMetric}</div>}
                    {cs.year && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{cs.year}</p>}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">How we work</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">A collaborative model for delivery</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                { num: '01', title: 'Discovery', desc: 'Understanding your research needs and objectives.' },
                { num: '02', title: 'Design', desc: 'Developing a tailored methodology and work plan.' },
                { num: '03', title: 'Execution', desc: 'Conducting rigorous research and analysis.' },
                { num: '04', title: 'Delivery', desc: 'Presenting findings and recommendations clearly.' },
              ].map((step, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                  <div className="text-3xl font-bold text-emerald-700">{step.num}</div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] py-16 text-white md:py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Ready to partner with NISER?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50">Let&apos;s discuss how NISER&apos;s research and advisory services can support your institutional, policy, and development objectives.</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0f3d2f] transition hover:bg-emerald-50">Contact us</Link>
              <Link href="/training" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Explore programs</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
