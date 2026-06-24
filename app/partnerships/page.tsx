import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Partnerships | NISER',
  description: 'Discover NISER&apos;s strategic partnerships with international institutions and development organizations.',
};

export default function PartnershipsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Strategic Partnerships</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              NISER collaborates with leading universities, research institutions, and development organizations globally to advance policy research excellence.
            </p>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { title: 'Academic Partnerships', count: 24, desc: 'Collaborations with universities' },
                { title: 'International Organizations', count: 12, desc: 'Bilateral research agreements' },
                { title: 'Government Agencies', count: 18, desc: 'Policy advisory relationships' },
              ].map((type, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg text-center">
                  <span className="text-4xl font-display-md text-nigeria-green-vibrant mb-2 block">{type.count}</span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{type.title}</h3>
                  <p className="text-body-md text-on-surface-variant">{type.desc}</p>
                </div>
              ))}
            </div>

            {/* Partner Logos/List */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Key Partners</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  'World Bank',
                  'International Monetary Fund',
                  'United Nations Development Programme',
                  'African Development Bank',
                  'London School of Economics',
                  'University of Oxford',
                  'Stanford University',
                  'ICRIER',
                ].map((partner, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex items-center justify-center h-32">
                    <span className="text-label-md text-on-surface-variant text-center">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
