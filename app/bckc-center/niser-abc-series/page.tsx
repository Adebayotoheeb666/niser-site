import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'NISER ABC Series | BCKC Center',
  description: 'NISER ABC Series - Applied Behavioral Change research publications.',
};

export default function ABCSeriesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="NISER ABC Series"
              description="Applied Behavioral Change research publications and working papers"
            />
            <div className="prose max-w-3xl">
              <p>
                The NISER ABC Series publishes cutting-edge research on applied behavioral change initiatives.
              </p>
              <p>
                Access to working papers, research briefs, and publications will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
