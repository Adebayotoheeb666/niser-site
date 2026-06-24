import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Funding Opportunities | NISER',
  description: 'Explore research funding opportunities, grants, and fellowship programs at NISER.',
};

export default function FundingOpportunitiesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Funding Opportunities</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Research grants, fellowships, and funding programs supporting innovative policy research and capacity building.
            </p>
          </div>
        </section>

        {/* Funding Programs */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Research Grants', desc: 'Individual researcher grants', amount: '₦500K - ₦2M', deadline: 'Rolling' },
                { title: 'Collaborative Research', desc: 'Multi-institution partnerships', amount: '₦2M - ₦5M', deadline: 'Quarterly' },
                { title: 'Post-Doctoral Fellowships', desc: 'Early career research support', amount: '₦1.5M/year', deadline: 'Bi-annually' },
                { title: 'Graduate Student Support', desc: 'Research assistance programs', amount: '₦500K/year', deadline: 'Rolling' },
              ].map((program, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg hover:border-nigeria-green-vibrant transition-colors">
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{program.title}</h3>
                  <p className="text-body-md text-on-surface-variant mb-4">{program.desc}</p>
                  <div className="space-y-2 mb-6 text-label-md text-on-surface-variant">
                    <p><strong>Funding:</strong> {program.amount}</p>
                    <p><strong>Deadline:</strong> {program.deadline}</p>
                  </div>
                  <button className="w-full border border-nigeria-green-deep text-nigeria-green-deep px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                    Learn More
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
