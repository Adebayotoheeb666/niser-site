'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { trackMatomoEvent } from '@/lib/matomo';

const languageOptions = [
  { value: 'yo', label: 'Yoruba' },
  { value: 'ig', label: 'Igbo' },
  { value: 'ha', label: 'Hausa' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
];

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState('yo');
  const [translatedText, setTranslatedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setStatusMessage('Please enter text to translate.');
      return;
    }

    setIsTranslating(true);
    setStatusMessage('Translating...');
    setTranslatedText('');
    void trackMatomoEvent('translation', 'requested', targetLang, 1);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, targetLang }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      setTranslatedText(data.translatedText ?? '');
      setStatusMessage('Translation completed.');
    } catch (error) {
      setStatusMessage((error as Error).message || 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Translation
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Translation assistant</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Translate text into major Nigerian languages and selected regional languages using NISER&apos;s translation API.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Yoruba</p>
                <p className="mt-1 text-sm text-emerald-100">Major language support</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Igbo</p>
                <p className="mt-1 text-sm text-emerald-100">Regional coverage</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Hausa</p>
                <p className="mt-1 text-sm text-emerald-100">Cross-language access</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
                <div className="mb-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Translate text</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Quick multilingual translation</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Source text</label>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      rows={10}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Enter text to translate..."
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-slate-700">Target language</label>
                      <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      >
                        {languageOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleTranslate}
                      disabled={isTranslating}
                      className="rounded-full bg-[#0f3d2f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#184f42] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                  </div>

                  {statusMessage ? (
                    <div className="rounded-2xl border border-slate-200 bg-[#edf5f0] p-4 text-sm text-slate-700">
                      {statusMessage}
                    </div>
                  ) : null}
                </div>
              </section>

              <aside className="rounded-[2rem] border border-slate-200 bg-[#edf5f0] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Translated output</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">Result</h3>
                <div className="mt-5 min-h-[300px] rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 whitespace-pre-wrap">
                  {translatedText || 'Your translated text will appear here after you submit the request.'}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">How it works</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    This page submits your text to the translation API at <span className="font-semibold text-slate-900">/api/translate</span>, which forwards the request to the configured language model backend for contextual translation.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
