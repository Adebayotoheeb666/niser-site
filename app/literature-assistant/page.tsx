'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LiteratureAssistantPage() {
  const [researchQuestion, setResearchQuestion] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [synthesisText, setSynthesisText] = useState('');
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [references, setReferences] = useState<Array<{ sourceId: string; title: string; summary: string; url: string; sourceType?: string; score?: number }>>([]);
  const [evidence, setEvidence] = useState<Array<{ sourceId: string; title: string; url: string; sourceType?: string; excerpt?: string; content?: string; score?: number }>>([]);
  const [refinementMode, setRefinementMode] = useState<'initial' | 'expand' | 'narrow' | 'compare'>('initial');
  const [history, setHistory] = useState<Array<{ id: string; mode: string; query: string; summary: string; createdAt: string }>>([]);

  async function handleSynthesize(mode: 'initial' | 'expand' | 'narrow' | 'compare' = 'initial') {
    if (!researchQuestion.trim()) return;

    setSummaryError(null);
    setIsSynthesizing(true);
    setRefinementMode(mode);

    try {
      const res = await fetch('/api/literature-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuestion, refinement: mode === 'initial' ? undefined : mode, previousSummary: mode !== 'initial' ? synthesisText : undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to synthesize literature');

      setSynthesisText(data.summary ?? '');
      setReferences(Array.isArray(data.references) ? data.references : []);
      setEvidence(Array.isArray(data.evidence) ? data.evidence : []);
      setShowSynthesis(true);

      setHistory((current) => [
        { id: `${Date.now()}`, mode, query: researchQuestion, summary: data.summary ?? '', createdAt: new Date().toISOString() },
        ...current,
      ].slice(0, 6));
    } catch (err) {
      setSummaryError((err as Error).message || 'Unable to synthesize literature.');
    } finally {
      setIsSynthesizing(false);
    }
  }

  return (
    <>
      <Header />

      <header className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
        <div className="container py-16 md:py-20">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Research tools</span>
          <h1 className="mt-6 text-3xl md:text-5xl font-bold">Literature Assistant</h1>
          <p className="mt-4 max-w-3xl text-emerald-50">Search NISER&apos;s corpus and produce concise literature syntheses, evidence lists, and references to accelerate reviews and policy briefs.</p>
        </div>
      </header>

      <main id="main-content" className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border">
            <label className="text-sm font-semibold text-slate-700">Research question</label>
            <textarea
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              placeholder="Describe the research question, keywords, or hypothesis..."
              rows={5}
              className="mt-3 w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />

            <div className="mt-4 space-y-3">
              <button
                onClick={() => handleSynthesize('initial')}
                disabled={!researchQuestion.trim() || isSynthesizing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0d3b2a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#123f2f] disabled:opacity-50"
              >
                {isSynthesizing ? 'Synthesizing…' : 'Synthesize literature'}
              </button>

              <div className="flex gap-2">
                <button onClick={() => handleSynthesize('expand')} disabled={!showSynthesis || isSynthesizing} className="flex-1 rounded-lg border px-3 py-2 text-sm">Expand</button>
                <button onClick={() => handleSynthesize('narrow')} disabled={!showSynthesis || isSynthesizing} className="flex-1 rounded-lg border px-3 py-2 text-sm">Narrow</button>
              </div>

              <div className="rounded-lg bg-[#f1f7f3] p-3 text-sm">
                <strong>Scope:</strong> NISER publications and processed uploads only.
              </div>
            </div>
          </aside>

          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Generated synthesis</h2>
                  <p className="text-sm text-slate-600">Refine, expand, or compare the synthesis using the controls.</p>
                </div>
                <div className="text-sm text-slate-500">Refinement: {refinementMode}</div>
              </div>

              {summaryError ? (
                <div className="mt-4 rounded p-3 bg-red-50 text-red-700 border">{summaryError}</div>
              ) : null}

              <div className="mt-4 min-h-[160px]">
                <div className="prose max-w-none text-sm text-slate-700 whitespace-pre-wrap">{synthesisText || 'No synthesis yet — enter a research question and click synthesize.'}</div>
              </div>
            </div>

            {evidence.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Exact evidence</h3>
                  <span className="text-sm text-emerald-700">{evidence.length} chunks</span>
                </div>
                <div className="grid gap-4">
                  {evidence.map((it, i) => (
                    <article key={`${it.sourceId}-${i}`} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="font-semibold text-slate-900">{it.title}</div>
                          <a className="text-sm text-slate-500" href={it.url}>{it.sourceType ?? 'Source'}</a>
                        </div>
                        <div className="text-sm text-slate-500">#{i + 1}</div>
                      </div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">{it.content || it.excerpt}</div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {references.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-3">Sources referenced</h3>
                <ul className="space-y-3">
                  {references.map((r) => (
                    <li key={r.sourceId} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{r.title}</div>
                          <div className="text-sm text-slate-500">{r.sourceType}</div>
                        </div>
                        <div className="text-sm text-slate-500">Score: {r.score?.toFixed(2) ?? 'N/A'}</div>
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{r.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="font-semibold mb-3">Refinement history</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {history.map((h) => (
                    <li key={h.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{h.mode === 'initial' ? 'Initial' : h.mode}</div>
                        <div className="text-xs text-slate-500">{h.query}</div>
                      </div>
                      <div className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .prose p { margin: 0; }
      `}</style>
    </>
  );
}
