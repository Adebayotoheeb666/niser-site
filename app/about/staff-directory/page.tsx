import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Staff Directory | About NISER',
  description: 'NISER staff directory and contact information.',
};

export default function StaffDirectoryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Staff Directory"
              description="Find contact information for NISER staff members"
            />
            <div className="prose max-w-3xl">
              <p>
                Our dedicated team of researchers, administrators, and support staff work together
                to advance NISER's mission.
              </p>
              <p>
                The staff directory will be available here for contacting specific departments and individuals.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
