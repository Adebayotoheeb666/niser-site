'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { trackMatomoEvent } from '@/lib/matomo';
import './search.css';

interface SearchResultItem {
  id: string;
  type: 'publication' | 'researcher' | 'insight' | 'event' | 'news';
  title: string;
  excerpt: string;
  url: string;
  division?: string;
  year?: number;
  extraInfo?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isSemantic, setIsSemantic] = useState(true);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch results
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: debouncedQuery,
        type: selectedType,
        division: selectedDivision,
        year: selectedYear,
        page: page.toString(),
        mode: isSemantic ? 'semantic' : 'keyword',
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.hits || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedType, selectedDivision, selectedYear, page, isSemantic]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    void trackMatomoEvent('search', 'query', `${selectedType}:${isSemantic ? 'semantic' : 'keyword'}`, 1);
  }, [debouncedQuery, selectedType, isSemantic]);

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
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
                Search
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Search NISER</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Find publications, researchers, policy insights, and sector events across the institute’s digital archive.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{total || 0}</p>
                <p className="mt-1 text-sm text-emerald-100">Results found</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{selectedType === 'all' ? 'All' : selectedType}</p>
                <p className="mt-1 text-sm text-emerald-100">Current filter</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{isSemantic ? 'AI' : 'Keyword'}</p>
                <p className="mt-1 text-sm text-emerald-100">Search mode</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Unified search</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Navigate NISER’s knowledge base in one place</h2>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-6">
              <div className="search-shell">
                <section className="search-hero">
                  <div className="container">
                    <div className="search-hero__inner">
                      <h1 className="search-hero__title">Unified Search</h1>
                      <p className="search-hero__desc">
                        Search across all NISER publications, researchers, policy insights, and events in one place.
                      </p>

                      <div className="search-box">
                        <div className="search-box__row">
                          <div className="search-box__input-wrap">
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Type keywords (e.g., poverty, reform, Simbine...)"
                              className="search-box__input"
                              aria-label="Search query"
                            />
                            {query && (
                              <button
                                onClick={() => setQuery('')}
                                className="search-box__clear"
                                aria-label="Clear search"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="search-box__toggle-row">
                          <label className="search-box__toggle">
                            <input
                              type="checkbox"
                              checked={isSemantic}
                              onChange={(e) => setIsSemantic(e.target.checked)}
                            />
                            <span>Enable AI-Enhanced Semantic Search</span>
                          </label>
                          {isSemantic && (
                            <span className="search-badge">✨ AI Hybrid Rank Active (BM25 + kNN)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="section">
                  <div className="container">
                    <div className="search-results">
                      <div className="search-tabs" role="tablist" aria-label="Filter results by type">
                        {[
                          { value: 'all', label: 'All Results' },
                          { value: 'publication', label: 'Publications' },
                          { value: 'researcher', label: 'Researchers' },
                          { value: 'insight', label: 'Policy Insights' },
                          { value: 'event', label: 'Events' },
                          { value: 'news', label: 'News' },
                        ].map((tab) => (
                          <button
                            key={tab.value}
                            type="button"
                            role="tab"
                            aria-selected={selectedType === tab.value}
                            onClick={() => {
                              setSelectedType(tab.value);
                              setPage(1);
                            }}
                            className={`search-tab${selectedType === tab.value ? ' search-tab--active' : ''}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="search-filters">
                        <div className="search-field">
                          <label htmlFor="division-filter" className="search-field__label">
                            Research Division
                          </label>
                          <select
                            id="division-filter"
                            value={selectedDivision}
                            onChange={(e) => {
                              setSelectedDivision(e.target.value);
                              setPage(1);
                            }}
                            className="search-field__select"
                          >
                            <option value="all">All Divisions</option>
                            <option value="macroeconomics">Macroeconomics</option>
                            <option value="poverty_social">Poverty & Social Development</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="governance">Governance</option>
                            <option value="industry">Industry & Manufacturing</option>
                          </select>
                        </div>

                        {selectedType === 'publication' && (
                          <div className="search-field">
                            <label htmlFor="year-filter" className="search-field__label">
                              Published Year
                            </label>
                            <select
                              id="year-filter"
                              value={selectedYear}
                              onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setPage(1);
                              }}
                              className="search-field__select"
                            >
                              <option value="all">All Years</option>
                              <option value="2026">2026</option>
                              <option value="2025">2025</option>
                              <option value="2024">2024</option>
                              <option value="2023">2023</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <p className="search-count" role="status" aria-live="polite">
                        {loading ? 'Searching...' : `Found ${total} result${total === 1 ? '' : 's'}`}
                      </p>

                      {loading ? (
                        <div className="spinner-wrap">
                          <div className="spinner" role="status" aria-label="Searching" />
                        </div>
                      ) : results.length > 0 ? (
                        <div className="search-list">
                          {results.map((hit) => (
                            <article key={hit.id} className="search-card">
                              <div className="search-card__top">
                                <span
                                  className={`search-tag${hit.type === 'publication' ? ' search-tag--publication' : hit.type === 'researcher' ? ' search-tag--researcher' : ''}`}
                                >
                                  {hit.type}
                                </span>
                                {hit.extraInfo && (
                                  <span className="search-card__meta">{hit.extraInfo}</span>
                                )}
                              </div>
                              <h3 className="search-card__title">
                                <Link href={hit.url}>{hit.title}</Link>
                              </h3>
                              <p className="search-card__excerpt">{hit.excerpt}</p>
                              <Link className="search-card__link" href={hit.url}>
                                Read More →
                              </Link>
                            </article>
                          ))}

                          {totalPages > 1 && (
                            <div className="search-pagination">
                              <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="btn btn--outline"
                              >
                                ← Previous
                              </button>
                              <span className="search-pagination__page">
                                Page {page} of {totalPages}
                              </span>
                              <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="btn btn--outline"
                              >
                                Next →
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="search-empty">
                          <p className="search-empty__title">No results found for &ldquo;{debouncedQuery}&rdquo;</p>
                          <p className="search-empty__desc">
                            Try checking your spelling or searching for broader terms.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
