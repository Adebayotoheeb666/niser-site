import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Internship Programs | NISER',
  description: 'Join NISER as an intern and gain practical experience in policy research and economic analysis.',
};

export default function InternshipsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Internship Programs</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Gain hands-on experience in policy research, economic analysis, and institutional management at Nigeria&apos;s premier think-tank.
            </p>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { title: 'Summer Internship', duration: '10-12 weeks', available: 'June - September' },
                { title: 'Graduate Internship', duration: '6 months', available: 'Year-round' },
                { title: 'Postgraduate Internship', duration: '3-4 months', available: 'Flexible' },
              ].map((program, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg text-center">
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{program.title}</h3>
                  <p className="font-body-md text-on-surface-variant mb-2">{program.duration}</p>
                  <p className="text-label-md text-research-blue">{program.available}</p>
                </div>
              ))}
            </div>

            {/* Current Openings */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Current Openings</h2>
              <div className="space-y-4">
                {[
                  { position: 'Research Intern', department: 'Macroeconomics', deadline: 'May 31, 2024' },
                  { position: 'Data Analysis Intern', department: 'Research Programs', deadline: 'June 15, 2024' },
                  { position: 'Communications Intern', department: 'Administration', deadline: 'June 30, 2024' },
                ].map((opening, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">{opening.position}</h4>
                      <p className="text-body-md text-on-surface-variant">{opening.department} | Deadline: {opening.deadline}</p>
                    </div>
                    <button className="bg-nigeria-green-deep text-on-primary px-6 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity">
                      Apply
                    </button>
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
