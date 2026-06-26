import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Mastercard Project | NISER Research',
  description: 'NISER Mastercard research project details and findings.',
};

export default function MastercardProjectPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Mastercard Project"
              description="Partnership research and collaborative initiatives"
            />
            <div className="prose max-w-3xl">
              <p>
                The Mastercard Project represents NISER's partnership research in critical development areas.
              </p>
              <p>
                Project details, objectives, and research outputs will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
