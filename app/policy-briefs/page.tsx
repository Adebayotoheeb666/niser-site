import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Policy Briefs | NISER',
  description: 'Access NISER&apos;s policy briefs - concise, evidence-based recommendations for policymakers.',
};

export default function PolicyBriefsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Policy Briefs</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Concise, evidence-based policy recommendations addressing critical development challenges facing Nigeria.
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="border-b border-surface-gray py-12 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search policy briefs..."
                className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest"
              />
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest">
                <option>All Topics</option>
                <option>Macroeconomics</option>
                <option>Agriculture</option>
                <option>Governance</option>
              </select>
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest">
                <option>Latest</option>
                <option>Most Read</option>
                <option>Most Cited</option>
              </select>
            </div>
          </div>
        </section>

        {/* Policy Briefs Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <span className="inline-block px-3 py-1 bg-accent-mint/20 text-accent-mint rounded-full font-label-sm text-label-sm mb-4">
                    Policy Brief
                  </span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3 line-clamp-2">
                    Policy Recommendation {i}: Enhancing Economic Framework
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-3">
                    Evidence-based recommendations for improving policy implementation and achieving sustainable development goals...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-outline">May 2024</span>
                    <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                      Read <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
