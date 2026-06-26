import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Externally Funded Projects | NISER Research',
  description: 'Research projects funded by international organizations and development partners.',
};

export default function ExternallyFundedProjectsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Externally Funded Projects"
              description="International partnerships and donor-funded research initiatives"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER collaborates with international organizations and development partners to conduct
                research on global development challenges.
              </p>
              <p>
                Portfolio of externally-funded projects and partnerships will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
