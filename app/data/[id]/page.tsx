'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  maintainer?: string;
  licenseTitle?: string;
  rowsCount?: number;
  previewData?: Record<string, string | number>[];
}

export default function DatasetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { getDatasetById } = await import('@/lib/ckan');
        const data = await getDatasetById(id);
        setDataset(data);
      } catch (err) {
        console.error('Error fetching dataset detail:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main id="main-content" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--gray-200)', borderTop: '4px solid var(--niser-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!dataset) {
    return (
      <>
        <Header />
        <main id="main-content" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-error)' }}>Dataset Not Found</h1>
          <p>The requested dataset could not be found in our catalogue.</p>
          <Link href="/data" className="btn btn--primary">
            Back to Catalogue
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Extract columns for preview table
  const columns = dataset.previewData && dataset.previewData.length > 0
    ? Object.keys(dataset.previewData[0])
    : [];

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)', padding: '2rem 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <Link href="/data" style={{ color: 'var(--niser-green)', fontWeight: 500 }}>
              ← Back to Catalogue
            </Link>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }} className="detail-layout">
            <style jsx global>{`
              @media (max-width: 768px) {
                .detail-layout {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>

            {/* Left Column: Metadata and Resources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--niser-green-dark)', marginBottom: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                  {dataset.title}
                </h1>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {dataset.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--gray-600)', background: 'var(--gray-100)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Description</h2>
                <p style={{ color: 'var(--gray-700)', fontSize: '1rem', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                  {dataset.notes}
                </p>
              </div>

              {/* Resources / Downloads */}
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--niser-green-dark)', fontWeight: 700 }}>
                  Data Resources
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dataset.resources.map((res) => (
                    <div
                      key={res.id}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '50px',
                            height: '50px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            background: res.format === 'CSV' ? '#e0f2fe' : res.format === 'JSON' ? '#fef3c7' : '#fee2e2',
                            color: res.format === 'CSV' ? '#0369a1' : res.format === 'JSON' ? '#b45309' : '#b91c1c',
                          }}
                        >
                          {res.format}
                        </span>
                        <div>
                          <h3 style={{ fontSize: '1rem', margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{res.name}</h3>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', margin: 0 }}>
                            {res.description || 'No description provided'} {res.size && `(${res.size})`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Downloading mock resource: ${res.name}`)}
                        className="btn btn--primary btn--sm"
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Preview Table */}
              {columns.length > 0 && dataset.previewData && (
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--niser-green-dark)', fontWeight: 700 }}>
                    Dataset Preview
                  </h2>
                  <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    Showing a sample preview of the first 5 records in this dataset. (Total rows: {dataset.rowsCount || 'Unknown'})
                  </p>
                  
                  <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--gray-100)', borderBottom: '2px solid var(--color-border)' }}>
                          {columns.map((col) => (
                            <th key={col} style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--gray-700)', whiteSpace: 'nowrap' }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataset.previewData.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: idx % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                            {columns.map((col) => (
                              <td key={col} style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Metadata Sidebar */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--niser-green-dark)' }}>
                  Dataset Metadata
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>AUTHOR</span>
                    <span style={{ color: 'var(--gray-800)' }}>{dataset.author}</span>
                  </div>
                  
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>MAINTAINER</span>
                    <span style={{ color: 'var(--gray-800)' }}>{dataset.maintainer || 'NISER Data Unit'}</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>LICENSE</span>
                    <span style={{ color: 'var(--gray-800)' }}>{dataset.licenseTitle || 'Public Domain'}</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>CREATED ON</span>
                    <span style={{ color: 'var(--gray-800)' }}>{new Date(dataset.metadataCreated).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>LAST MODIFIED</span>
                    <span style={{ color: 'var(--gray-800)' }}>{new Date(dataset.metadataModified).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block' }}>ORGANIZATION</span>
                    <span style={{ color: 'var(--gray-800)', fontWeight: 500 }}>{dataset.organization.title}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: '0.25rem 0 0 0' }}>
                      {dataset.organization.description}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
