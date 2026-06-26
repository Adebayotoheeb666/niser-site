import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'FG Funded Projects | NISER Research',
  description: 'Research projects funded by the Federal Government of Nigeria.',
};

export default function FGFundedProjectsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="FG Funded Projects"
              description="Research supported by Federal Government funding"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER's Federal Government-funded research projects address priority development
                and policy issues for Nigeria.
              </p>
              <p>
                Portfolio of FG-funded projects and their research outcomes will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
