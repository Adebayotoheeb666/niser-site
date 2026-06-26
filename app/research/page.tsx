import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Research | NISER',
  description: 'NISER research programs, projects, and initiatives.',
};

export default function ResearchPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Research Programs"
              description="Explore NISER's research initiatives and projects"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER conducts multidisciplinary research on critical policy issues affecting Nigeria's
                development and economic growth.
              </p>
              <p>
                Information about all research programs and initiatives will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
