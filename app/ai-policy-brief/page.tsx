import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NISER Sovereign Intelligence | AI Policy Brief Generator',
  description: 'Generate data-driven policy briefs using AI technology powered by NISER research.',
};

export default function SovereignIntelligencePage() {
  return (
    <>
      <Header />
      <main className="mt-20 flex-grow">
        {/* Hero Section */}
        <section className="bg-nigeria-green-deep text-on-primary py-20 px-4 md:px-16">
          <div className="max-w-5xl mx-auto">
            <span className="text-accent-mint font-label-sm text-label-sm uppercase tracking-widest">AI-Powered Intelligence</span>
            <h1 className="font-display-lg text-display-lg mt-4 mb-6">NISER Sovereign Intelligence</h1>
            <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
              Generate comprehensive policy briefs powered by AI and NISER&apos;s research database. Transform complex data into actionable insights in minutes.
            </p>
            <button className="mt-8 bg-accent-mint text-nigeria-green-deep px-8 py-4 rounded-lg font-label-md hover:shadow-lg transition-all">
              Start Creating Briefs
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Input Your Topic', desc: 'Provide policy question or research area of interest' },
              { num: '2', title: 'AI Analysis', desc: 'System analyzes NISER database and generates brief' },
              { num: '3', title: 'Export Brief', desc: 'Download as PDF with citations and references' },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="bg-surface-container-low p-8 rounded-lg border border-surface-gray">
                  <div className="text-6xl font-bold text-accent-mint opacity-20 mb-4">{step.num}</div>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{step.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-surface-container-high py-16 px-4 md:px-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">Ready to Generate Your First Brief?</h2>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Access NISER&apos;s research intelligence with AI-powered analysis and insights.
            </p>
            <button className="bg-nigeria-green-deep text-on-primary px-10 py-4 rounded-lg font-label-md hover:opacity-90 transition-all">
              Launch Intelligence Hub
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
