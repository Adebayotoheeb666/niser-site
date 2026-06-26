import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'NISER Research Seminar Series | NISER',
  description: 'NISER Research Seminar Series - regular seminars featuring researchers and policy experts.',
};

export default function SeminarSeriesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="NISER Research Seminar Series"
              description="Regular seminars featuring leading researchers and policy experts"
            />
            <div className="prose max-w-3xl">
              <p>
                The NISER Research Seminar Series provides a platform for researchers to share findings,
                discuss policy implications, and engage with the academic and policy communities.
              </p>
              <p>
                Upcoming seminars, past presentations, and registration information will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
