import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./ai.css";

export const metadata: Metadata = {
  title: "Research AI Studio",
  description:
    "A hub of NISER's AI-powered research tools — the assistant chatbot, semantic search, literature review, policy brief generation, and translation. Every tool cites the NISER sources it draws from.",
};

type ToolKind = "chat" | "search" | "literature" | "brief" | "translate" | "monitor" | "recommend";

interface AiTool {
  id: string;
  kind: ToolKind;
  title: string;
  description: string;
  href?: string;
  state: "live" | "live-embedded" | "automatic";
  example?: string;
  icon: ReactNode;
}

const icon = (path: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
);

const tools: AiTool[] = [
  {
    id: "assistant",
    kind: "chat",
    title: "NISER Assistant",
    description:
      "Ask questions about publications, policy briefs, active researchers, and divisions. The assistant retrieves answers from the NISER repository and shows every source it cites, labelling web or general knowledge when it draws beyond the archive.",
    href: "/chatbot",
    state: "live",
    example: "What does NISER say about fuel subsidy reform?",
    icon: icon(
      '<path d="M8 9h8" /><path d="M8 13h5" /><path d="M18 4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-4 4v-4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12Z" />',
    ),
  },
  {
    id: "search",
    kind: "search",
    title: "Semantic Research Search",
    description:
      "Search the full corpus by meaning, not just keyword match. Semantic mode surfaces conceptually related publications even when terms differ; hybrid ranking blends keyword and vector results.",
    href: "/search",
    state: "live",
    example: "Search 'youth unemployment and digital skills'",
    icon: icon(
      '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />',
    ),
  },
  {
    id: "literature",
    kind: "literature",
    title: "Literature Review Assistant",
    description:
      "Paste a research question and receive a synthesised review drawn from NISER and web sources, with expand / narrow / compare refinements and explicit evidence excerpts.",
    href: "/literature-assistant",
    state: "live",
    example: "Synthesise evidence on agricultural value chains in Nigeria",
    icon: icon(
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />',
    ),
  },
  {
    id: "policy-brief",
    kind: "brief",
    title: "Policy Brief Generator",
    description:
      "Draft a policy brief from selected NISER sources — structuring background, evidence, options, and recommendations for review before publication.",
    href: "/ai-policy-brief",
    state: "live",
    example: "Generate a brief on inflation and food security",
    icon: icon(
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6" /><path d="M9 17h4" />',
    ),
  },
  {
    id: "translate",
    kind: "translate",
    title: "AI Translation (Nigerian Languages)",
    description:
      "Translate NISER content between English, Yoruba, Hausa, and Igbo, with human-review workflow and quality labelling.",
    href: "/translate",
    state: "live",
    example: "Translate a policy brief into Yoruba",
    icon: icon(
      '<circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />',
    ),
  },
  {
    id: "recommendations",
    kind: "recommend",
    title: "Related Content",
    description:
      "Every publication, insight, and policy brief suggests semantically related NISER material automatically, so related evidence is never one click away.",
    state: "live-embedded",
    icon: icon(
      '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M9 7h7M9 11h5" />',
    ),
  },
  {
    id: "monitor",
    kind: "monitor",
    title: "Policy Monitoring & Alerts",
    description:
      "The system automatically tracks policy feeds, classifies relevance, and prepares daily briefings — running on a schedule so the Institute is alerted to developments early.",
    state: "automatic",
    icon: icon(
      '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />',
    ),
  },
];

const stateLabel: Record<AiTool["state"], { label: string; className: string }> = {
  live: { label: "Try it now", className: "ai-badge--live" },
  "live-embedded": { label: "Embedded on every page", className: "ai-badge--embedded" },
  automatic: { label: "Runs on a schedule", className: "ai-badge--automatic" },
};

export default function AiStudioPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="ai-hero">
          <div className="container ai-hero__inner">
            <span className="ai-hero__eyebrow">NISER Research AI Studio</span>
            <h1 className="ai-hero__title">
              Every answer, grounded in the NISER archive.
            </h1>
            <p className="ai-hero__lead">
              One hub for the Institute&apos;s AI tools — research chat, semantic
              search, literature review, policy brief generation, and translation.
              Each tool cites the sources it draws from and labels anything that
              falls outside the repository.
            </p>
            <div className="ai-hero__actions">
              <Link href="/chatbot" className="btn btn--primary btn--lg">
                Ask the NISER Assistant
              </Link>
              <Link href="/search" className="btn btn--outline btn--lg">
                Search the archive
              </Link>
            </div>
          </div>
        </section>

        <section className="ai-section" aria-labelledby="ai-tools-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">AI Capabilities</span>
                <h2 id="ai-tools-heading" className="home-section__title">
                  Research tools
                </h2>
              </div>
            </div>

            <ul className="ai-grid" role="list">
              {tools.map((tool) => {
                const state = stateLabel[tool.state];
                const inner = (
                  <>
                    <div className="ai-tool__icon" aria-hidden="true">
                      {tool.icon}
                    </div>
                    <div className="ai-tool__body">
                      <div className="ai-tool__head">
                        <h3 className="ai-tool__title">{tool.title}</h3>
                        <span className={`ai-badge ${state.className}`}>{state.label}</span>
                      </div>
                      <p className="ai-tool__desc">{tool.description}</p>
                      {tool.example && (
                        <p className="ai-tool__example">
                          <span aria-hidden="true">↳</span> {tool.example}
                        </p>
                      )}
                    </div>
                  </>
                );
                return (
                  <li key={tool.id}>
                    {tool.href ? (
                      <Link href={tool.href} className="card ai-tool ai-tool--link">
                        {inner}
                      </Link>
                    ) : (
                      <article className="card ai-tool">{inner}</article>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="ai-note" aria-labelledby="ai-note-heading">
          <div className="container">
            <h2 id="ai-note-heading" className="ai-note__title">
              How NISER keeps AI honest
            </h2>
            <ul className="ai-note__list" role="list">
              <li>
                <strong>Cited answers.</strong> Retrieval surfaces the exact
                publications or briefs behind each response.
              </li>
              <li>
                <strong>Labelled knowledge.</strong> Web or general-knowledge
                answers are always marked as such — never presented as NISER
                evidence.
              </li>
              <li>
                <strong>Human review.</strong> Machine-drafted briefs and
                translations pass through editorial and translation review
                before publication.
              </li>
              <li>
                <strong>Continuous monitoring.</strong> An AI quality review
                loop checks for drift or inaccuracy across the archive.
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}