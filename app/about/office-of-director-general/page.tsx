import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Office of the Director General | About NISER',
  description: 'The Office of the Director General at NISER.',
};

export default function OfficeOfDirectorGeneralPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Office of the Director General"
              description="Leadership and strategic direction"
            />
            <div className="prose max-w-3xl">
              <p>
                The Office of the Director General oversees NISER's strategic direction and institutional operations.
              </p>
              <p>
                Information about the Director General and office functions will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
