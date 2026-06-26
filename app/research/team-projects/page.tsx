import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Team Research Projects | NISER',
  description: 'Collaborative team research projects at NISER.',
};

export default function TeamProjectsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Team Research Projects"
              description="Collaborative research initiatives across NISER divisions"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER's team research projects bring together researchers from multiple divisions to
                tackle complex policy challenges.
              </p>
              <p>
                Details about collaborative research projects and their focus areas will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
