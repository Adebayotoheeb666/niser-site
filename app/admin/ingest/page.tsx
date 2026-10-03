'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';

interface ServiceStatusItem {
  name: string;
  enabled: boolean;
  healthy: boolean;
  detail: string;
}

export default function IngestPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatusItem[]>([]);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch('/api/ai/status');
        const data = await response.json();
        if (Array.isArray(data?.services)) {
          setServiceStatus(data.services);
        }
      } catch (error) {
        console.error('Unable to load AI service status', error);
      }
    };

    void loadStatus();
  }, []);

  const runIngest = async () => {
    setLoading(true);
    setStatus('Starting indexing...');

    try {
      const response = await fetch('/api/admin/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET ?? '' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Indexing failed');
      }

      const summary = `Indexing completed: ${data.count ?? 0} chunks from ${data.sources?.join(', ') ?? 'CMS content'}`;
      const warnings = Array.isArray(data.warnings) && data.warnings.length > 0
        ? data.warnings.map((warning: string) => `- ${warning}`).join('\n')
        : '';
      setStatus(warnings ? `${summary}\n\n${warnings}` : summary);
    } catch (error) {
      setStatus((error as Error).message || 'Indexing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <HeroSection
        title="Vector Indexing"
        description="Trigger a CMS-to-vector ingestion run for the semantic search and chatbot pipelines."
        subtitle="Use this page to populate the embedding index from the local content sources"
      />
      <main id="main-content" className="mt-20 flex-grow bg-background">
        <div className="container py-16">
          <div className="rounded-3xl border border-surface-gray bg-white p-8 shadow-sm">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-3">Run content indexing</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-8">
              This action sends the current CMS content through the embedding pipeline so semantic search and chatbot retrieval can use it.
            </p>
            <button
              onClick={runIngest}
              disabled={loading}
              className="rounded-3xl bg-nigeria-green-deep px-7 py-4 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Indexing...' : 'Run indexing'}
            </button>
            {serviceStatus.length > 0 ? (
              <div className="mt-6 space-y-3 rounded-3xl border border-surface-gray bg-surface-container-low p-4 text-sm text-on-surface-variant">
                <p className="font-semibold text-on-surface">Current AI/search backend status</p>
                <ul className="space-y-2">
                  {serviceStatus.map((service) => (
                    <li key={service.name} className="flex items-start justify-between gap-3 rounded-2xl border border-white/50 bg-white/70 px-3 py-2">
                      <span className="font-medium text-on-surface">{service.name}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${service.healthy ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {service.healthy ? 'healthy' : service.enabled ? 'offline' : 'not configured'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {status ? (
              <div className="mt-6 rounded-3xl border border-surface-gray bg-surface-container-low p-4 text-sm text-on-surface-variant">
                {status}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
