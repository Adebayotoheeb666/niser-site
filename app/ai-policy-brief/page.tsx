"use client";

import { useState, useEffect, useMemo } from "react";
import type { Publication } from "@/types/cms";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trackMatomoEvent } from "@/lib/matomo";
import "./brief.css";

interface PolicyBriefSection {
  heading: string;
  content: string;
  citations: string[];
}

interface PolicyBriefSource {
  title: string;
  url: string;
  year?: number;
}

interface PolicyBriefDraft {
  id: string;
  title: string;
  selectedIds: string[];
  audience: string;
  focusAngle: string;
  sections: PolicyBriefSection[];
  coverageWarning?: string;
  sources: PolicyBriefSource[];
  createdAt: string;
}

const DRAFT_STORAGE_KEY = 'niser-policy-brief-drafts';

const AUDIENCE_OPTIONS = [
  { value: "federal-ministry", label: "Federal Ministry" },
  { value: "media-press", label: "Media & Press" },
  { value: "private-sector", label: "Private Sector" },
  { value: "development-partners", label: "Development Partners" },
];

const STEP_LABELS = ["Source Material", "Audience & Angle", "Draft & Review", "Finalize"];

const Icon = ({ path, size = 18 }: { path: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
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

const icons = {
  search: '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />',
  check: '<path d="M20 6 9 17l-5-5" />',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />',
  arrowBack: '<path d="M19 12H5M12 19l-7-7 7-7" />',
  arrowForward: '<path d="M5 12h14M12 5l7 7-7 7" />',
  spark: '<path d="M12 3v4m0 10v4m9-9h-4M7 12H3m15.5-6.5-3 3m-7 7-3 3m13 0-3-3m-7-7-3-3" />',
  save: '<path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 21h14" />',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 21h14" />',
  print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />',
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8" />',
  layers: '<path d="m12 2 10 6-10 6L2 8z" /><path d="m2 13 10 6 10-6" />',
  fileRestore: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 15.5 6 12.5l3-3" /><path d="M6 12.5H12a3 3 0 0 1 3 3" />',
};

function formatPublicationType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PolicyBriefStudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [audience, setAudience] = useState("federal-ministry");
  const [focusAngle, setFocusAngle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefSections, setBriefSections] = useState<PolicyBriefSection[]>([]);
  const [coverageWarning, setCoverageWarning] = useState<string | null>(null);
  const [sourcesMeta, setSourcesMeta] = useState<PolicyBriefSource[]>([]);
  const [drafts, setDrafts] = useState<PolicyBriefDraft[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadPublications() {
      try {
        const cmsBase =
          process.env.NEXT_PUBLIC_CMS_URL ??
          "http://localhost:10003/wp-json/niser/v1";
        const res = await fetch(`${cmsBase}/publications?limit=12&type=policy_brief`);
        if (res.ok) {
          setPublications(await res.json());
        } else {
          console.error("Failed to load policy briefs from CMS:", res.status);
        }
      } catch (error) {
        console.error("Error loading policy briefs from CMS:", error);
      } finally {
        setLoadingPublications(false);
      }
    }

    loadPublications();
    if (typeof window !== "undefined") {
      loadDrafts();
    }
  }, []);

  const researchPapers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return publications
      .map((publication) => ({
        id: publication.id,
        title: publication.title,
        category: formatPublicationType(publication.publicationType),
        date: String(publication.publishedYear),
        selected: selectedPapers.includes(publication.id),
      }))
      .filter(
        (paper) =>
          !query ||
          paper.title.toLowerCase().includes(query) ||
          paper.category.toLowerCase().includes(query),
      );
  }, [publications, searchTerm, selectedPapers]);

  const togglePaperSelection = (id: string) => {
    if (selectedPapers.includes(id)) {
      setSelectedPapers(selectedPapers.filter((p) => p !== id));
    } else if (selectedPapers.length < 3) {
      setSelectedPapers([...selectedPapers, id]);
    }
  };

  const canGoTo = (step: number) =>
    step === 1 ||
    (step === 2 && selectedPapers.length > 0) ||
    (step === 3 && focusAngle.trim()) ||
    (step === 4 && briefSections.length > 0);

  const goToStep = (step: number) => {
    if (canGoTo(step)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const loadDrafts = () => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as PolicyBriefDraft[];
      setDrafts(Array.isArray(stored) ? stored : []);
    } catch {
      setDrafts([]);
    }
  };

  const saveDraft = () => {
    if (briefSections.length === 0) return;
    const draft: PolicyBriefDraft = {
      id: `${Date.now()}`,
      title: `Policy brief draft ${new Date().toLocaleDateString()}`,
      selectedIds: selectedPapers,
      audience,
      focusAngle,
      sections: briefSections,
      coverageWarning: coverageWarning ?? undefined,
      sources: sourcesMeta,
      createdAt: new Date().toISOString(),
    };
    const nextDrafts = [draft, ...drafts].slice(0, 5);
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextDrafts));
    setDrafts(nextDrafts);
    setErrorMessage("Draft saved locally.");
  };

  const restoreDraft = (draft: PolicyBriefDraft) => {
    setSelectedPapers(draft.selectedIds);
    setAudience(draft.audience);
    setFocusAngle(draft.focusAngle);
    setBriefSections(draft.sections);
    setCoverageWarning(draft.coverageWarning ?? null);
    setSourcesMeta(draft.sources);
    setCurrentStep(3);
    setErrorMessage(null);
  };

  const downloadWord = () => {
    const header = `<html><head><meta charset="utf-8"><title>Policy Brief</title></head><body>`;
    const bodyContent = briefSections
      .map(
        (section) =>
          `<h2>${section.heading}</h2><p>${section.content.replace(/\n/g, "<br/>")}</p><p><strong>Citations:</strong> ${section.citations.join(", ")}</p>`,
      )
      .join("<hr/>");
    const doc = `${header}${bodyContent}</body></html>`;
    const blob = new Blob([doc], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "niser-policy-brief.doc";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    window.print();
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    void trackMatomoEvent("policy_brief", "generated", audience, 1);

    try {
      const response = await fetch("/api/policy-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIds: selectedPapers, audience, focusAngle }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate policy brief");
      }

      const sections = Array.isArray(data.sections)
        ? data.sections
        : [
            {
              heading: "Executive Summary",
              content: data.briefText || "",
              citations: [],
            },
          ];

      setBriefSections(sections);
      setCoverageWarning(data.coverageWarning || null);
      setSourcesMeta(Array.isArray(data.sources) ? data.sources : []);
      setCurrentStep(3);
    } catch (error) {
      setErrorMessage((error as Error).message || "Unable to generate policy brief.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    setCurrentStep(4);
    void trackMatomoEvent("policy_brief", "published", audience, 1);
  };

  const resetAll = () => {
    setCurrentStep(1);
    setSelectedPapers([]);
    setAudience("federal-ministry");
    setFocusAngle("");
    setBriefSections([]);
    setCoverageWarning(null);
    setSourcesMeta([]);
    setErrorMessage(null);
    setSearchTerm("");
  };

  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="brief-hero">
          <div className="container brief-hero__inner">
            <span className="brief-hero__eyebrow">NISER Policy Brief Studio</span>
            <h1 className="brief-hero__title">
              From research to policy — a concise, citable draft.
            </h1>
            <p className="brief-hero__lead">
              Select up to three NISER sources, choose the audience and analytical
              angle, and generate a structured policy brief with citations you can
              edit before export.
            </p>
            <div className="brief-hero__actions">
              <button className="btn btn--primary" onClick={() => goToStep(1)}>
                Start a new brief
              </button>
              {drafts.length > 0 && (
                <button className="btn btn--outline" onClick={() => restoreDraft(drafts[0])}>
                  Resume last draft
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="brief-shell container">
          {/* ── Stepper ───────────────────────────────────────────────────── */}
          <nav className="brief-progress" aria-label="Policy brief steps">
            {STEP_LABELS.map((label, index) => {
              const step = index + 1;
              const active = currentStep === step;
              const done = currentStep > step;
              const locked = !canGoTo(step);
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStep(step)}
                  disabled={locked}
                  className={`brief-step${active ? " is-active" : ""}${done ? " is-done" : ""}${locked ? " is-locked" : ""}`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="brief-step__num">
                    {done ? <Icon path={icons.check} size={14} /> : String(step).padStart(2, "0")}
                  </span>
                  <span className="brief-step__label">{label}</span>
                </button>
              );
            })}
          </nav>

          {errorMessage && (
            <div className="brief-alert brief-alert--error" role="status">
              {errorMessage}
            </div>
          )}

          {/* ── Step 1: Source material ───────────────────────────────────── */}
          {currentStep === 1 && (
            <section className="brief-panel">
              <header className="brief-panel__head">
                <div>
                  <span className="home-eyebrow">Step 1 of 4</span>
                  <h2 className="brief-panel__title">Select source materials</h2>
                </div>
                <span className="brief-count" aria-live="polite">
                  {selectedPapers.length} / 3 selected
                </span>
              </header>

              <p className="brief-panel__desc">
                Choose up to three policy-focused NISER publications to synthesise
                into your brief.
              </p>

              <div className="brief-search">
                <span className="brief-search__icon">
                  <Icon path={icons.search} />
                </span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search publications…"
                  aria-label="Search publications"
                  className="brief-search__input"
                />
              </div>

              {loadingPublications ? (
                <div className="brief-grid" aria-label="Loading publications">
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="brief-paper brief-paper--skeleton">
                      <span className="skeleton" />
                      <span className="skeleton" />
                      <span className="skeleton" />
                    </div>
                  ))}
                </div>
              ) : researchPapers.length === 0 ? (
                <div className="brief-empty">
                  {searchTerm.trim()
                    ? "No publications match your search."
                    : "No publications available. Add policy briefs in the CMS to use this tool."}
                </div>
              ) : (
                <ul className="brief-grid" role="list">
                  {researchPapers.map((paper) => (
                    <li key={paper.id}>
                      <button
                        type="button"
                        onClick={() => togglePaperSelection(paper.id)}
                        aria-pressed={paper.selected}
                        className={`brief-paper${paper.selected ? " is-selected" : ""}`}
                      >
                        <span className="brief-paper__check">
                          {paper.selected && <Icon path={icons.check} />}
                        </span>
                        <span className="brief-paper__category">{paper.category}</span>
                        <h3 className="brief-paper__title">{paper.title}</h3>
                        <span className="brief-paper__meta">
                          <Icon path={icons.calendar} size={14} />
                          {paper.date}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <footer className="brief-panel__foot">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  disabled={selectedPapers.length === 0}
                  className="btn btn--primary"
                >
                  Continue to configuration
                  <Icon path={icons.arrowForward} />
                </button>
              </footer>
            </section>
          )}

          {/* ── Step 2: Audience & angle ──────────────────────────────────── */}
          {currentStep === 2 && (
            <section className="brief-panel brief-panel--narrow">
              <header className="brief-panel__head">
                <div>
                  <span className="home-eyebrow">Step 2 of 4</span>
                  <h2 className="brief-panel__title">Audience &amp; angle</h2>
                </div>
              </header>

              <p className="brief-panel__desc">
                Define who the brief is for and the lens the AI should use to read
                the sources.
              </p>

              <fieldset className="brief-fieldset">
                <legend className="brief-fieldset__legend">Who is this brief for?</legend>
                <div className="brief-audience">
                  {AUDIENCE_OPTIONS.map((option) => {
                    const active = audience === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`brief-audience__option${active ? " is-active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={option.value}
                          checked={active}
                          onChange={(e) => setAudience(e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="brief-field">
                <label className="brief-field__label" htmlFor="focus-angle">
                  Focus angle
                </label>
                <p className="brief-field__hint">
                  The lens through which the AI should interpret the source data.
                </p>
                <textarea
                  id="focus-angle"
                  value={focusAngle}
                  onChange={(e) => setFocusAngle(e.target.value)}
                  placeholder="e.g., Focus on the budgetary requirements for implementing gender-sensitive digital training programs…"
                  rows={5}
                  className="brief-field__area"
                />
                <p className="brief-field__count">{focusAngle.length} characters</p>
              </div>

              <footer className="brief-panel__foot brief-panel__foot--split">
                <button type="button" onClick={() => goToStep(1)} className="btn btn--ghost">
                  <Icon path={icons.arrowBack} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={!focusAngle.trim() || isGenerating}
                  className="btn btn--primary"
                >
                  {isGenerating ? (
                    <>
                      <span className="brief-spinner" aria-hidden="true" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Icon path={icons.spark} />
                      Generate draft
                    </>
                  )}
                </button>
              </footer>
            </section>
          )}

          {/* ── Step 3: Draft & review ────────────────────────────────────── */}
          {currentStep === 3 && (
            <section className="brief-panel">
              <header className="brief-panel__head">
                <div>
                  <span className="home-eyebrow">Step 3 of 4</span>
                  <h2 className="brief-panel__title">Draft &amp; review</h2>
                </div>
                <span className="brief-chip">
                  {audience.replace("-", " ")}
                </span>
              </header>

              <p className="brief-panel__desc">
                Review each generated section, adjust wording, and export when ready.
              </p>

              {coverageWarning && (
                <div className="brief-alert brief-alert--warning">
                  <strong>Coverage warning:</strong> {coverageWarning}
                </div>
              )}

              {sourcesMeta.length > 0 && (
                <div className="brief-sources">
                  <h3 className="brief-sources__title">Selected sources</h3>
                  <ol className="brief-sources__list">
                    {sourcesMeta.map((source, index) => (
                      <li key={`${source.url}-${index}`}>
                        <span className="brief-sources__num">{index + 1}</span>
                        <span>
                          {source.title} {source.year ? `(${source.year})` : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {briefSections.length === 0 ? (
                <div className="brief-empty">
                  No draft is available yet. Go back and generate a draft to get started.
                </div>
              ) : (
                <div className="brief-draft">
                  {briefSections.map((section, index) => (
                    <div key={`${section.heading}-${index}`} className="brief-section">
                      <div className="brief-section__head">
                        <h3 className="brief-section__title">{section.heading}</h3>
                        <span className="brief-section__tag">Section {index + 1}</span>
                      </div>
                      <p className="brief-section__citations">
                        Citations: {section.citations.join(", ") || "None"}
                      </p>
                      <label className="sr-only" htmlFor={`section-${index}`}>
                        Edit {section.heading}
                      </label>
                      <textarea
                        id={`section-${index}`}
                        value={section.content}
                        onChange={(e) => {
                          const nextSections = [...briefSections];
                          nextSections[index] = { ...section, content: e.target.value };
                          setBriefSections(nextSections);
                        }}
                        rows={8}
                        className="brief-section__editor"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="brief-actions">
                <div className="brief-actions__primary">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={briefSections.length === 0}
                    className="btn btn--secondary"
                  >
                    <Icon path={icons.save} />
                    Save draft
                  </button>
                  <button
                    type="button"
                    onClick={downloadWord}
                    disabled={briefSections.length === 0}
                    className="btn btn--secondary"
                  >
                    <Icon path={icons.download} />
                    Download Word
                  </button>
                  <button
                    type="button"
                    onClick={exportPdf}
                    disabled={briefSections.length === 0}
                    className="btn btn--secondary"
                  >
                    <Icon path={icons.print} />
                    Print / PDF
                  </button>
                </div>

                <div className="brief-drafts">
                  <h3 className="brief-drafts__title">Saved drafts</h3>
                  {drafts.length === 0 ? (
                    <p className="brief-drafts__empty">No saved drafts yet.</p>
                  ) : (
                    <ul className="brief-drafts__list" role="list">
                      {drafts.map((draft) => (
                        <li key={draft.id}>
                          <button
                            type="button"
                            onClick={() => restoreDraft(draft)}
                            className="brief-drafts__item"
                          >
                            <Icon path={icons.fileRestore} size={16} />
                            <span>
                              <span className="brief-drafts__name">{draft.title}</span>
                              <span className="brief-drafts__date">
                                Saved {new Date(draft.createdAt).toLocaleString()}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <footer className="brief-panel__foot brief-panel__foot--split">
                <button type="button" onClick={() => goToStep(2)} className="btn btn--ghost">
                  <Icon path={icons.arrowBack} />
                  Back to configuration
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={briefSections.length === 0}
                  className="btn btn--accent"
                >
                  <Icon path={icons.document} />
                  Approve &amp; publish
                </button>
              </footer>
            </section>
          )}

          {/* ── Step 4: Success ───────────────────────────────────────────── */}
          {currentStep === 4 && (
            <section className="brief-success">
              <div className="brief-success__icon">
                <Icon path={icons.check} size={40} />
              </div>
              <span className="home-eyebrow">Step 4 of 4 — Complete</span>
              <h2 className="brief-success__title">Policy brief ready</h2>
              <p className="brief-success__desc">
                Your AI policy brief draft is ready. Review the final content below
                and copy it into your internal workflows.
              </p>

              {briefSections.length > 0 ? (
                <div className="brief-success__doc">
                  {briefSections.map((section) => (
                    <section key={section.heading}>
                      <h3>{section.heading}</h3>
                      <p>{section.content}</p>
                      {section.citations.length > 0 && (
                        <p className="brief-success__cite">
                          Citations: {section.citations.join(", ")}
                        </p>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                <div className="brief-empty">No brief content was generated.</div>
              )}

              <div className="brief-success__actions">
                <button type="button" onClick={downloadWord} className="btn btn--secondary">
                  <Icon path={icons.download} />
                  Download Word
                </button>
                <button type="button" onClick={exportPdf} className="btn btn--secondary">
                  <Icon path={icons.print} />
                  Print / PDF
                </button>
                <button type="button" onClick={resetAll} className="btn btn--primary">
                  <Icon path={icons.layers} />
                  Generate another
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}