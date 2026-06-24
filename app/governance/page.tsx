import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Governance | NISER',
  description: 'Learn about NISER&apos;s governance structure, leadership, and strategic direction.',
};

export default function GovernancePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Governance & Leadership</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              NISER is governed by a Board of Trustees and led by an experienced executive team committed to research excellence and institutional integrity.
            </p>
          </div>
        </section>

        {/* Leadership Structure */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {/* Executive Leadership */}
            <div className="mb-20">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Executive Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Director General', name: 'Prof. Gbadebo O. Durotoye', bio: 'Distinguished scholar with 30+ years in policy research' },
                  { title: 'Deputy Director General', name: 'Dr. Adeola Adeniji', bio: 'Leading macroeconomist and institutional strategist' },
                  { title: 'Director, Research Programs', name: 'Prof. Muyiwa Awe', bio: 'Expert in development economics and empirical research' },
                  { title: 'Director, Administration', name: 'Hajia Hauwa Ibrahim', bio: 'Efficient institutional management and operations' },
                ].map((leader, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg">
                    <span className="text-label-md text-research-blue font-bold">{leader.title}</span>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2 mt-2">{leader.name}</h3>
                    <p className="text-body-md text-on-surface-variant">{leader.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Board of Trustees */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Board of Trustees</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-surface-container-lowest p-6 rounded-lg border border-surface-gray">
                    <h4 className="font-label-md text-nigeria-green-deep font-bold mb-1">Chairman/Member {i}</h4>
                    <p className="text-body-md text-on-surface-variant">Position and professional background</p>
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
