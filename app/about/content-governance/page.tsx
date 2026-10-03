import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Governance Policy | NISER",
  description:
    "Editorial ownership, publishing cadence, CMS roles, and AI governance rules for the NISER digital platform.",
};

const owners: Array<{ section: string; owner: string; cadence: string }> = [
  {
    section: "Homepage & institutional news",
    owner: "Communications Unit",
    cadence: "Reviewed weekly; news items published within 1 working day of approval",
  },
  {
    section: "Publications & annual reports",
    owner: "Research Division Heads + Library",
    cadence: "Catalogued within 5 working days of release",
  },
  {
    section: "Insights & policy briefs",
    owner: "Office of the Director-General + Division Heads",
    cadence: "Rapid responses within 48 hours of a relevant policy event",
  },
  {
    section: "Events & webinars",
    owner: "Communications Unit",
    cadence: "Listed on confirmation; recordings archived within 10 working days",
  },
  {
    section: "Researcher profiles",
    owner: "Individual researchers; HR verifies completeness quarterly",
    cadence: "Quarterly completeness audit (target: 100% profiles complete)",
  },
  {
    section: "Tenders & procurement notices",
    owner: "Administration Department",
    cadence: "Published within 5 working days of issue (statutory SLA)",
  },
  {
    section: "Open data catalogue",
    owner: "Data & Statistics Unit",
    cadence: "New datasets released with codebooks; refreshed monthly",
  },
];

const roles: Array<{ role: string; permissions: string }> = [
  {
    role: "Administrator (IT Unit)",
    permissions: "Full CMS access, user management, plugin and security configuration.",
  },
  {
    role: "Editor (Communications / DG office)",
    permissions: "Publish, edit, and retract any content; manage categories, tags, and homepage placement.",
  },
  {
    role: "Author (Researchers)",
    permissions: "Create and submit drafts for their division (publications, insights, events); cannot publish unaided.",
  },
  {
    role: "Contributor (Interns, associates)",
    permissions: "Submit drafts for review only — no publish rights.",
  },
];

const aiRules: Array<{ title: string; detail: string }> = [
  {
    title: "Human oversight mandatory",
    detail:
      "No AI-generated content may be published without explicit approval by a named researcher or editor. AI tools produce drafts; humans produce publications.",
  },
  {
    title: "Transparency to users",
    detail:
      'Published content drafted with AI assistance carries a disclosure ("Drafted with AI assistance and reviewed by [Name]"). The Ask NISER assistant always identifies itself as AI.',
  },
  {
    title: "Model versioning & audit trail",
    detail:
      "Every AI-assisted item records the model name/version, generation date, and approving researcher in the platform audit log, retained for five years.",
  },
  {
    title: "Hallucination monitoring",
    detail:
      "The chatbot fallback rate and reported errors are reviewed monthly by a designated AI Quality Officer.",
  },
  {
    title: "Annual ethics review",
    detail:
      "All AI capabilities are reviewed annually for output bias, accuracy drift, and regulatory changes, chaired by the Director and IT Unit Head.",
  },
];

export default function ContentGovernancePage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <div className="container mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <span className="inline-flex items-center rounded-full border border-[#DCEFE4] bg-[#F2FBF6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
          Governance
        </span>
        <h1 className="mt-4 font-['Playfair_Display',_Georgia,_serif] text-4xl font-bold tracking-tight sm:text-5xl">
          Content Governance Policy
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          This policy defines who owns each part of the NISER website, how often
          it is updated, what each content-management-system role may do, and the
          rules that govern AI-assisted content. It is reviewed annually by the
          Director and the IT Unit Head.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">1. Editorial owners &amp; publishing cadence</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Editorial owner</th>
                  <th className="px-4 py-3">Cadence / SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {owners.map((item) => (
                  <tr key={item.section}>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.section}</td>
                    <td className="px-4 py-3 text-slate-600">{item.owner}</td>
                    <td className="px-4 py-3 text-slate-600">{item.cadence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">2. CMS roles &amp; permissions</h2>
          <ul className="mt-5 space-y-4">
            {roles.map((role) => (
              <li key={role.role} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">{role.role}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{role.permissions}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">3. Quality standards</h2>
          <ul className="mt-4 space-y-2 text-base leading-7 text-slate-600">
            <li>• No content older than three months appears on the homepage.</li>
            <li>• Every image carries descriptive alternative text.</li>
            <li>• Publications are catalogued with complete metadata (authors, year, DOI where available).</li>
            <li>• All pages meet WCAG 2.1 Level AA accessibility requirements.</li>
            <li>• Stale or superseded pages are archived rather than deleted, preserving institutional memory.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">4. AI governance</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            All AI capabilities on this platform are subject to the following
            binding principles:
          </p>
          <ul className="mt-5 space-y-4">
            {aiRules.map((rule) => (
              <li key={rule.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="font-semibold text-slate-900">{rule.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-[#BFE6CF] bg-[#F2FBF6] p-6">
          <h2 className="text-xl font-bold text-[#0A5F3D]">Policy administration</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Owner: Office of the Director-General · Approved by: Director ·
            Review cycle: Annual (next review due twelve months from approval) ·
            Enquiries:{" "}
            <a href="/contact" className="font-semibold text-[#0A5F3D] hover:underline">
              contact the Institute
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
