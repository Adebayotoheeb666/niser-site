import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Management Team | About NISER',
  description: 'NISER management team and senior leadership.',
};

export default function ManagementTeamPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Management Team"
              description="Senior leadership and executive staff"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER's management team works collaboratively to advance the institution's research mission
                and strategic objectives.
              </p>
              <p>
                Details about management team members and their roles will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
