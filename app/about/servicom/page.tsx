import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Servicom | About NISER',
  description: 'NISER Servicom office and customer service commitment.',
};

export default function ServicecomPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Servicom"
              description="Service Excellence and Complaints Management"
            />
            <div className="prose max-w-3xl">
              <p>
                NISER's Servicom office is committed to excellent service delivery and handling of inquiries.
              </p>
              <p>
                Information about Servicom services and contact details will be added here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
