import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NISER Literature Review Assistant',
  description: 'AI-powered literature review tool to synthesize research and identify gaps in the literature.',
};

export default function LiteratureAssistantPage() {
  return (
    <>
      <Header />
      <main className="mt-20 flex-grow">
        {/* Hero Section */}
        <section className="bg-research-blue text-on-primary py-20 px-4 md:px-16">
          <div className="max-w-5xl mx-auto">
            <span className="text-accent-mint font-label-sm text-label-sm uppercase tracking-widest">Research Tool</span>
            <h1 className="font-display-lg text-display-lg mt-4 mb-6">Literature Review Assistant</h1>
            <p className="font-body-lg text-body-lg opacity-90 max-w-2xl">
              Accelerate your research with AI-powered literature synthesis. Identify research gaps, synthesize findings, and generate comprehensive literature reviews using NISER&apos;s research corpus.
            </p>
            <button className="mt-8 bg-accent-mint text-research-blue px-8 py-4 rounded-lg font-label-md hover:shadow-lg transition-all">
              Start Review
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 md:px-16 max-w-5xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Smart Search', desc: 'Intelligent search across NISER publications and research' },
              { title: 'Gap Analysis', desc: 'Identify research gaps and opportunities in your field' },
              { title: 'Auto-Synthesis', desc: 'Automatically synthesize findings across multiple sources' },
              { title: 'Citation Management', desc: 'Automatic citation generation in multiple formats' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-surface-container-low rounded-lg border border-surface-gray">
                <h3 className="font-headline-md text-headline-md text-research-blue mb-2">{feature.title}</h3>
                <p className="text-body-md text-on-surface-variant">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-high py-16 px-4 md:px-16">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">Streamline Your Research</h2>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Save time and gain deeper insights into policy research literature.
            </p>
            <button className="bg-research-blue text-on-primary px-10 py-4 rounded-lg font-label-md hover:opacity-90 transition-all">
              Access Assistant
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
