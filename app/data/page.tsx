'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import Link from 'next/link';

interface DatasetResource {
  id: string;
  name: string;
  format: 'CSV' | 'JSON' | 'PDF' | 'XLSX';
  url: string;
  size?: string;
  description?: string;
}

interface Dataset {
  id: string;
  title: string;
  notes: string;
  author: string;
  tags: string[];
  resources: DatasetResource[];
  organization: {
    name: string;
    title: string;
    description?: string;
  };
  metadataCreated: string;
  metadataModified: string;
}

export default function DataPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          setDatasets(data);
        } else {
          console.error('Unexpected response loading datasets', res.status);
        }
      } catch (err) {
        console.error('Error fetching datasets:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter logic
  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesSearch =
        dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFormat =
        selectedFormat === 'all' ||
        dataset.resources.some((r) => r.format === selectedFormat);

      const matchesOrg =
        selectedOrg === 'all' || dataset.organization.name === selectedOrg;

      return matchesSearch && matchesFormat && matchesOrg;
    });
  }, [datasets, searchQuery, selectedFormat, selectedOrg]);

  // Unique orgs and formats for filtering list
  const formats = ['CSV', 'JSON', 'PDF', 'XLSX'];
  const organizations = useMemo(() => {
    const orgs = new Map<string, string>();
    datasets.forEach((d) => orgs.set(d.organization.name, d.organization.title));
    return Array.from(orgs.entries());
  }, [datasets]);

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)' }}>
        {/* Banner Area */}
        <section className="section" style={{ backgroundColor: 'var(--niser-green)', color: '#fff', padding: '4rem 0' }}>
          <div className="container">
            <h1 style={{ color: '#fff', fontSize: '2.75rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
              Open Data Catalogue
            </h1>
            <p style={{ color: 'var(--niser-gold-pale)', fontSize: '1.125rem', maxWidth: '800px', margin: 0 }}>
              Access, download, and analyse social and economic datasets curated by NISER researchers. Supporting transparency and evidence-based development in Nigeria.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="data-layout">
              <style jsx global>{`
                @media (max-width: 768px) {
                  .data-layout {
                    grid-template-columns: 1fr !important;
                  }
                }
              `}</style>

              {/* Sidebar Filters */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--niser-green-dark)' }}>
                    Filter Options
                  </h2>

                  {/* Format Filter */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Resource Format
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="format"
                          checked={selectedFormat === 'all'}
                          onChange={() => setSelectedFormat('all')}
                          style={{ accentColor: 'var(--niser-green)' }}
                        />
                        <span>All Formats</span>
                      </label>
                      {formats.map((f) => (
                        <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="format"
                            checked={selectedFormat === f}
                            onChange={() => setSelectedFormat(f)}
                            style={{ accentColor: 'var(--niser-green)' }}
                          />
                          <span>{f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Division Filter */}
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Organization
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="org"
                          checked={selectedOrg === 'all'}
                          onChange={() => setSelectedOrg('all')}
                          style={{ accentColor: 'var(--niser-green)' }}
                        />
                        <span>All Organizations</span>
                      </label>
                      {organizations.map(([name, title]) => (
                        <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="org"
                            checked={selectedOrg === name}
                            onChange={() => setSelectedOrg(name)}
                            style={{ accentColor: 'var(--niser-green)' }}
                          />
                          <span style={{ fontSize: '0.875rem' }}>{title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>
              </aside>

              {/* Dataset listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Search field */}
                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      outline: 'none',
                      fontSize: '0.9375rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                </div>

                <p style={{ fontWeight: 500, color: 'var(--gray-600)' }}>
                  {loading ? 'Loading datasets...' : `Displaying ${filteredDatasets.length} dataset${filteredDatasets.length === 1 ? '' : 's'}`}
                </p>

                {/* List cards */}
                {loading ? (
                  <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--gray-200)', borderTop: '4px solid var(--niser-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                ) : filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      style={{
                        backgroundColor: '#fff',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--niser-green)', background: 'var(--niser-green-pale)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          🏛️ {dataset.organization.title}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                          Modified: {new Date(dataset.metadataModified).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.375rem', margin: 0, fontFamily: 'var(--font-sans)' }}>
                        <Link href={`/data/${dataset.id}`} style={{ color: 'var(--niser-green-dark)', fontWeight: 600 }}>
                          {dataset.title}
                        </Link>
                      </h2>
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: 0 }}>
                        {dataset.notes.length > 200 ? dataset.notes.substring(0, 200) + '...' : dataset.notes}
                      </p>
                      
                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {dataset.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '0.125rem 0.375rem', borderRadius: 'var(--radius-sm)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Resources / Downloads */}
                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {dataset.resources.map((res) => (
                            <span
                              key={res.id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: res.format === 'CSV' ? '#e0f2fe' : res.format === 'JSON' ? '#fef3c7' : '#fee2e2',
                                color: res.format === 'CSV' ? '#0369a1' : res.format === 'JSON' ? '#b45309' : '#b91c1c',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                              }}
                            >
                              {res.format}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/data/${dataset.id}`}
                          className="btn btn--outline btn--sm"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          View Details & Explore →
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4rem 2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.25rem', color: 'var(--gray-500)' }}>
                      No datasets matches your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
