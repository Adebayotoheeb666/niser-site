import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Individual Research Projects | NISER',
  description: 'Individual researcher projects at NISER.',
};

export default function IndividualProjectsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Individual Research Projects"
              description="Standalone research initiatives by NISER researchers"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER researchers conduct individual research projects covering diverse policy and
                economic development topics.
              </p>
              <p>
                Details about individual research projects and researcher profiles will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
