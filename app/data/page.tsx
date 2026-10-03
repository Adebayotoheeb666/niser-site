'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import './data.css';

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
      <main id="main-content" className="data-shell">
        {/* Banner Area */}
        <section className="data-banner">
          <div className="container">
            <h1 className="data-banner__title">Open Data Catalogue</h1>
            <p className="data-banner__desc">
              Access, download, and analyse social and economic datasets curated by NISER researchers. Supporting transparency and evidence-based development in Nigeria.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="section">
          <div className="container">
            <div className="data-layout">
              {/* Sidebar Filters */}
              <aside className="data-sidebar">
                <div className="data-filter-panel">
                  <h2 className="data-filter-panel__title">Filter Options</h2>

                  {/* Format Filter */}
                  <div className="data-filter-group">
                    <p className="data-filter-group__label">Resource Format</p>
                    <div className="data-filter-options">
                      <label className="data-radio">
                        <input
                          type="radio"
                          name="format"
                          checked={selectedFormat === 'all'}
                          onChange={() => setSelectedFormat('all')}
                        />
                        <span>All Formats</span>
                      </label>
                      {formats.map((f) => (
                        <label key={f} className="data-radio">
                          <input
                            type="radio"
                            name="format"
                            checked={selectedFormat === f}
                            onChange={() => setSelectedFormat(f)}
                          />
                          <span>{f}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Division Filter */}
                  <div className="data-filter-group">
                    <p className="data-filter-group__label">Organization</p>
                    <div className="data-filter-options">
                      <label className="data-radio">
                        <input
                          type="radio"
                          name="org"
                          checked={selectedOrg === 'all'}
                          onChange={() => setSelectedOrg('all')}
                        />
                        <span>All Organizations</span>
                      </label>
                      {organizations.map(([name, title]) => (
                        <label key={name} className="data-radio">
                          <input
                            type="radio"
                            name="org"
                            checked={selectedOrg === name}
                            onChange={() => setSelectedOrg(name)}
                          />
                          <span className="data-radio__title">{title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Dataset listing */}
              <div className="data-content">
                {/* Search field */}
                <div className="data-search">
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input data-search__input"
                    aria-label="Search datasets"
                  />
                </div>

                <p className="data-count" role="status" aria-live="polite">
                  {loading ? 'Loading datasets...' : `Displaying ${filteredDatasets.length} dataset${filteredDatasets.length === 1 ? '' : 's'}`}
                </p>

                {/* List cards */}
                {loading ? (
                  <div className="spinner-wrap">
                    <div className="spinner" role="status" aria-label="Loading datasets" />
                  </div>
                ) : filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <article key={dataset.id} className="data-card">
                      <div className="data-card__top">
                        <span className="data-org-badge">🏛️ {dataset.organization.title}</span>
                        <span className="data-modified">
                          Modified: {new Date(dataset.metadataModified).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="data-card__title">
                        <Link href={`/data/${dataset.id}`}>{dataset.title}</Link>
                      </h2>
                      <p className="data-card__notes">
                        {dataset.notes.length > 200 ? dataset.notes.substring(0, 200) + '...' : dataset.notes}
                      </p>

                      {/* Tags */}
                      <div className="data-tags">
                        {dataset.tags.map((tag) => (
                          <span key={tag} className="data-tag">#{tag}</span>
                        ))}
                      </div>

                      {/* Resources / Downloads */}
                      <div className="data-card__footer">
                        <div className="data-formats">
                          {dataset.resources.map((res) => (
                            <span
                              key={res.id}
                              className={`data-badge data-badge--${res.format.toLowerCase()}`}
                            >
                              {res.format}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/data/${dataset.id}`}
                          className="btn btn--outline btn--sm"
                        >
                          View Details & Explore →
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="data-empty">
                    <p className="data-empty__title">No datasets matches your search criteria.</p>
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
