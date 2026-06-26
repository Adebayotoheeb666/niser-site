import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'ACTU in NISER',
  description: 'Information about ACTU in NISER.',
};

export default function ACTUPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="ACTU in NISER"
              description="Academic and Career Development"
            />
            <div className="prose max-w-3xl">
              <p>
                ACTU supports academic excellence and career development at NISER.
              </p>
              <p>
                Details about ACTU programs and initiatives will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
