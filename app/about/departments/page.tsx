import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Departments | About NISER',
  description: 'NISER departments and research divisions.',
};

export default function DepartmentsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Departments"
              description="Research divisions and organizational units"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER is organized into specialized departments that focus on critical policy research areas.
              </p>
              <p>
                Information about each department and their research focus will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
