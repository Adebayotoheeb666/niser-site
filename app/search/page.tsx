'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

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
  }, [debouncedQuery, selectedType, selectedDivision, selectedYear, page]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)' }}>
        {/* Search Hero Area */}
        <section className="section" style={{ paddingBottom: '2rem', backgroundColor: '#fff', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--niser-green)' }}>
                Unified Search
              </h1>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                Search across all NISER publications, researchers, policy insights, and events in one place.
              </p>

              {/* Search Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type keywords (e.g., poverty, reform, Simbine...)"
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        fontSize: '1.125rem',
                        border: '2px solid var(--niser-green)',
                        borderRadius: 'var(--radius-lg)',
                        outline: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        fontFamily: 'var(--font-sans)',
                      }}
                      aria-label="Search query"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--gray-400)',
                          fontSize: '1.25rem',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Semantic Search Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)' }}>
                      <input
                        type="checkbox"
                        checked={isSemantic}
                        onChange={(e) => setIsSemantic(e.target.checked)}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: 'var(--niser-green)',
                        }}
                      />
                      <span>Enable AI-Enhanced Semantic Search</span>
                    </label>
                  </div>
                  {isSemantic && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--niser-green)', background: 'var(--niser-green-pale)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                      ✨ AI Hybrid Rank Active (BM25 + kNN)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Results Area */}
        <section className="section" style={{ paddingTop: '2rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {/* Filter Tabs */}
              <div style={{ borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
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
                    onClick={() => {
                      setSelectedType(tab.value);
                      setPage(1);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      fontWeight: 600,
                      color: selectedType === tab.value ? 'var(--niser-green)' : 'var(--gray-500)',
                      borderBottom: selectedType === tab.value ? '3px solid var(--niser-green)' : '3px solid transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Advanced Filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label htmlFor="division-filter" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    RESEARCH DIVISION
                  </label>
                  <select
                    id="division-filter"
                    value={selectedDivision}
                    onChange={(e) => {
                      setSelectedDivision(e.target.value);
                      setPage(1);
                    }}
                    style={{
                      padding: '0.5rem 1.5rem 0.5rem 0.5rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      background: '#fff',
                    }}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label htmlFor="year-filter" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                      PUBLISHED YEAR
                    </label>
                    <select
                      id="year-filter"
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setPage(1);
                      }}
                      style={{
                        padding: '0.5rem 1.5rem 0.5rem 0.5rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        background: '#fff',
                      }}
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

              {/* Results count */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontWeight: 500, color: 'var(--gray-600)' }}>
                  {loading ? 'Searching...' : `Found ${total} result${total === 1 ? '' : 's'}`}
                </p>
              </div>

              {/* Results Grid / List */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                  <div className="search-spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid var(--gray-200)',
                    borderTop: '4px solid var(--niser-green)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <style jsx global>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ) : results.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {results.map((hit) => (
                    <div
                      key={hit.id}
                      style={{
                        backgroundColor: '#fff',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                      className="search-result-card"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: hit.type === 'publication' ? 'var(--niser-green-pale)' : hit.type === 'researcher' ? 'var(--niser-gold-pale)' : '#f3f4f6',
                            color: hit.type === 'publication' ? 'var(--niser-green)' : hit.type === 'researcher' ? 'var(--niser-green-dark)' : 'var(--gray-600)',
                          }}
                        >
                          {hit.type}
                        </span>
                        {hit.extraInfo && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                            {hit.extraInfo}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-sans)' }}>
                        <Link href={hit.url} style={{ color: 'var(--niser-green-dark)', textDecoration: 'none', fontWeight: 600 }}>
                          {hit.title}
                        </Link>
                      </h3>
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: 0 }}>
                        {hit.excerpt}
                      </p>
                      <div style={{ alignSelf: 'flex-start' }}>
                        <Link
                          href={hit.url}
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--niser-green)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                      <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="btn btn--outline"
                        style={{ padding: '0.5rem 1rem', opacity: page === 1 ? 0.5 : 1 }}
                      >
                        ← Previous
                      </button>
                      <span style={{ fontWeight: 500, color: 'var(--gray-600)' }}>
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="btn btn--outline"
                        style={{ padding: '0.5rem 1rem', opacity: page === totalPages ? 0.5 : 1 }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4rem 2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.25rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>
                    No results found for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                  <p style={{ color: 'var(--gray-400)', fontSize: '0.9375rem' }}>
                    Try checking your spelling or searching for broader terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
