import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Governing Council | About NISER',
  description: 'NISER Governing Council members and responsibilities.',
};

export default function GoverningCouncilPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Governing Council"
              description="Leadership and institutional governance"
            />
            <div className="prose max-w-3xl">
              <p>
                The Governing Council provides strategic oversight and ensures NISER meets its institutional mandate.
              </p>
              <p>
                Information about Council members and responsibilities will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
