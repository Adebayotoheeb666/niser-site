import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Gallery - Images | NISER',
  description: 'NISER photo gallery and institutional imagery.',
};

export default function ImagesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Image Gallery"
              description="NISER events, facilities, and team"
            />
            <div className="prose max-w-3xl">
              <p>
                Browse photos from NISER events, research activities, facilities, and team members.
              </p>
              <p>
                Image gallery content will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
