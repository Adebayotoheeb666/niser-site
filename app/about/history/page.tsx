import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'History | About NISER',
  description: 'The history and evolution of the Nigerian Institute of Social and Economic Research.',
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="History of NISER"
              description="From establishment to present day"
            />
            <div className="prose max-w-3xl">
              <p>
                The Nigerian Institute of Social and Economic Research (NISER) was established in 1960
                as Nigeria's premier policy research institution.
              </p>
              <p>
                Content about NISER's founding, development, and evolution will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
