import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Research Centers | NISER',
  description: 'Explore NISER&apos;s specialized research centers driving innovation in socioeconomic research.',
};

export default function ResearchCentersPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Research Centers</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Specialized centers driving innovation and excellence in socioeconomic research and policy analysis.
            </p>
          </div>
        </section>

        {/* Centers Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="space-y-12">
              {[
                { name: 'Center for Applied Microeconomic Research', director: 'Prof. Adekunle Toyin Adebayo', focus: 'Household surveys, behavioral economics, impact evaluation', established: 2005 },
                { name: 'Center for Macroeconomic Policy Research', director: 'Dr. Omoromoke Adegoke', focus: 'Fiscal policy, monetary transmission, growth dynamics', established: 2010 },
                { name: 'Center for Development Studies', director: 'Prof. Ebele Okonkwo', focus: 'Comparative development, institutional analysis', established: 2008 },
              ].map((center, i) => (
                <div key={i} className="border-l-4 border-nigeria-green-deep pl-8 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-nigeria-green-deep">{center.name}</h3>
                    <span className="text-label-sm text-on-surface-variant">Est. {center.established}</span>
                  </div>
                  <p className="font-label-md text-on-surface-variant mb-3">Director: {center.director}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">{center.focus}</p>
                  <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                    Learn More <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
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
