import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Annual Reports | NISER',
  description: 'Access NISER&apos;s annual reports documenting research activities, achievements, and institutional performance.',
};

export default function AnnualReportsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Annual Reports</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Comprehensive documentation of NISER&apos;s research activities, achievements, and institutional performance.
            </p>
          </div>
        </section>

        {/* Reports Archive */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="space-y-4">
              {[
                { year: 2023, highlights: 'Record research output, 45 new publications' },
                { year: 2022, highlights: 'Institutional expansion, 12 new partnerships' },
                { year: 2021, highlights: 'Digital transformation, training programs launched' },
                { year: 2020, highlights: 'COVID-19 response research, policy briefs' },
                { year: 2019, highlights: 'Strategic planning, research centers established' },
              ].map((report, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex justify-between items-center hover:shadow-lg transition-shadow">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">{report.year} Annual Report</h3>
                    <p className="text-body-md text-on-surface-variant">{report.highlights}</p>
                  </div>
                  <button className="bg-nigeria-green-deep text-on-primary px-6 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap">
                    <span className="material-symbols-outlined text-base">download</span> Download PDF
                  </button>
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
