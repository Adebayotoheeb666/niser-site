import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Governance Structure | About NISER',
  description: 'NISER governance structure and organizational framework.',
};

export default function GovernanceStructurePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Governance Structure"
              description="Organizational framework and decision-making bodies"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER operates under a well-defined governance structure that ensures institutional effectiveness
                and accountability.
              </p>
              <p>
                Details about the organizational structure, committees, and governance framework will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
