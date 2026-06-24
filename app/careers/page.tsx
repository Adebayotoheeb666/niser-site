import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Careers | NISER',
  description: 'Explore career opportunities at NISER and join our team of policy research professionals.',
};

export default function CareersPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Careers at NISER</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Join us in advancing policy research excellence and contributing to national development through meaningful work.
            </p>
          </div>
        </section>

        {/* Why Join NISER */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto mb-20">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Why Join NISER?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Impactful Work', desc: 'Contribute to policy research that shapes national development' },
                { title: 'Professional Growth', desc: 'Access to training, conferences, and skill development' },
                { title: 'Collaborative Environment', desc: 'Work with leading researchers and thought leaders' },
                { title: 'Competitive Compensation', desc: 'Attractive salary and benefits package' },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <span className="material-symbols-outlined text-nigeria-green-vibrant text-2xl flex-shrink-0">check_circle</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-1">{benefit.title}</h3>
                    <p className="text-body-md text-on-surface-variant">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto border-t border-surface-gray pt-16">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Open Positions</h2>
            <div className="space-y-4">
              {[
                { title: 'Senior Economist', dept: 'Macroeconomics Division', level: 'Senior', posted: 'May 2024' },
                { title: 'Research Analyst', dept: 'Poverty Studies', level: 'Mid-level', posted: 'May 2024' },
                { title: 'Data Scientist', dept: 'Research Programs', level: 'Mid-level', posted: 'April 2024' },
                { title: 'Research Coordinator', dept: 'Administration', level: 'Entry-level', posted: 'April 2024' },
              ].map((job, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">{job.title}</h3>
                      <p className="text-body-md text-on-surface-variant">{job.dept}</p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-research-blue/10 text-research-blue rounded-full font-label-sm text-label-sm whitespace-nowrap">
                      {job.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label-sm text-outline">Posted: {job.posted}</span>
                    <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                      View Details <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
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
