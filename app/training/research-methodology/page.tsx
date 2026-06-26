import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Research Methodology Training | NISER',
  description: 'Comprehensive training in research methodology and design at NISER.',
};

export default function ResearchMethodologyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Research Methodology Training"
              description="Develop essential research skills and methodologies"
            />
            <div className="prose max-w-3xl">
              <p>
                This comprehensive program covers all aspects of research methodology, from research design
                through implementation and analysis.
              </p>
              <p>
                Program details, schedule, and registration information will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
