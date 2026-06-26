import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'BCKC Center | NISER',
  description: 'Behavioural Change Knowledge Center at NISER.',
};

export default function BCKCCenterPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Behavioural Change Knowledge Center"
              description="Research and resources on behavior change"
            />
            <div className="prose max-w-3xl">
              <p>
                The Behavioural Change Knowledge Center (BCKC) at NISER focuses on research and resources
                related to behavior change and development.
              </p>
              <p>
                Information about the center's mission, programs, and research will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
