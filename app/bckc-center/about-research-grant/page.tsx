import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'About Research Grant | BCKC Center',
  description: 'Information about BCKC research grants and funding opportunities.',
};

export default function AboutResearchGrantPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="About Research Grant"
              description="Funding opportunities and grant programs"
            />
            <div className="prose max-w-3xl">
              <p>
                The BCKC offers research grants to support innovative behavior change research.
              </p>
              <p>
                Details about grant programs, eligibility criteria, and application procedures will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
