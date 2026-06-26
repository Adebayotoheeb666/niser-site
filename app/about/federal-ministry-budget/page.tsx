import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Federal Ministry of Budget and Economic Planning | About NISER',
  description: 'Relationship between NISER and the Federal Ministry of Budget and Economic Planning.',
};

export default function FederalMinistryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Federal Ministry of Budget and Economic Planning"
              description="Institutional oversight and coordination"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER operates under the purview of the Federal Ministry of Budget and Economic Planning.
              </p>
              <p>
                Information about institutional relationships and coordination will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
