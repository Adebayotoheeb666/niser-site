import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Gallery - Videos | NISER',
  description: 'NISER video content and multimedia resources.',
};

export default function VideosPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Video Gallery"
              description="NISER seminars, research presentations, and institutional videos"
            />
            <div className="prose max-w-3xl">
              <p>
                Watch video content from NISER events, research seminars, and institutional activities.
              </p>
              <p>
                Video gallery content will be displayed here.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
