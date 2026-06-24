import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProcurements } from '@/lib/cms/client';

export const revalidate = 86400; // ISR: 24 hours

export const metadata: Metadata = {
  title: 'Procurement & Tenders — NISER',
  description: 'View active expression of interest (EOI), invitations to tender, and recent procurement award notices from the National Institute of Social and Economic Research.',
};

export default async function TendersPage() {
  const notices = await getProcurements();

  // Helper to check if a notice is closed
  const isClosed = (closingDateStr?: string) => {
    if (!closingDateStr) return false;
    const closingDate = new Date(closingDateStr);
    const today = new Date();
    return today > closingDate;
  };

  // Helper to format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)' }}>
        {/* Banner Area */}
        <section className="section" style={{ backgroundColor: 'var(--niser-green)', color: '#fff', padding: '4rem 0' }}>
          <div className="container">
            <h1 style={{ color: '#fff', fontSize: '2.75rem', fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>
              Procurement & Tenders
            </h1>
            <p style={{ color: 'var(--niser-gold-pale)', fontSize: '1.125rem', maxWidth: '800px', margin: 0 }}>
              Invitations to tender, Expressions of Interest (EOI), and official contract awards from NISER. Adhering to the Public Procurement Act to ensure transparency and accountability.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="section">
          <div className="container" style={{ maxWidth: '960px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--niser-green-dark)', fontFamily: 'var(--font-sans)', fontWeight: 700, margin: 0 }}>
                  Active & Recent Notices
                </h2>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-500)' }}>
                  Total notices: {notices.length}
                </span>
              </div>

              {notices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {notices.map((notice) => {
                    const closed = isClosed(notice.closingDate);
                    return (
                      <div
                        key={notice.id}
                        style={{
                          backgroundColor: '#fff',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '1.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.25rem 0.625rem',
                                borderRadius: 'var(--radius-sm)',
                                background: notice.noticeType === 'tender' ? '#dcfce7' : notice.noticeType === 'expression_of_interest' ? '#eff6ff' : '#fef3c7',
                                color: notice.noticeType === 'tender' ? '#15803d' : notice.noticeType === 'expression_of_interest' ? '#1d4ed8' : '#b45309',
                              }}
                            >
                              {notice.noticeType.replace(/_/g, ' ')}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.25rem 0.625rem',
                                borderRadius: 'var(--radius-sm)',
                                background: closed ? '#fee2e2' : '#dcfce7',
                                color: closed ? '#b91c1c' : '#15803d',
                              }}
                            >
                              {closed ? 'Closed' : 'Active'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                            Published: {new Date(notice.issueDate).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--niser-green-dark)' }}>
                          {notice.title}
                        </h3>

                        {notice.description && (
                          <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: 0, lineHeight: '1.6' }}>
                            {notice.description}
                          </p>
                        )}

                        {/* Metas: closing date / award details */}
                        <div
                          className="border-t border-[var(--color-border)] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
                        >
                          <div>
                            {notice.closingDate && (
                              <div>
                                <span className="font-semibold text-[var(--gray-500)]">CLOSING DATE: </span>
                                <span style={{ color: closed ? 'var(--color-error)' : 'var(--gray-800)' }} className="font-medium">
                                  {new Date(notice.closingDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            {notice.noticeType === 'award' && (
                              <div className="text-left sm:text-right">
                                <span className="font-semibold text-[var(--gray-500)]">AWARD VALUE: </span>
                                <span className="text-[var(--niser-green-dark)] font-bold">
                                  {formatCurrency(notice.awardValue)}
                                </span>
                                {notice.awardedTo && (
                                  <div className="text-xs text-[var(--gray-500)] mt-1">
                                    Awarded to: {notice.awardedTo}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Download Document Button */}
                        {notice.documentFile && (
                          <div style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                            <button
                              onClick={() => alert(`Downloading tender document: ${notice.documentFile}`)}
                              className="btn btn--outline btn--sm"
                              style={{ padding: '0.5rem 1rem' }}
                            >
                              📄 Download Tender Document (PDF)
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.25rem', color: 'var(--gray-500)', margin: 0 }}>
                    No procurement notices are currently published.
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
