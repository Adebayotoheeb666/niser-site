import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Management Team | About NISER',
  description: 'NISER management team and senior leadership.',
};

export default function ManagementTeamPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Management Team"
              description="Senior leadership and executive staff"
            />
            <div className="prose max-w-4xl">
              <p>
                NISER&apos;s management team works collaboratively to advance the institution&apos;s research mission
                and strategic objectives.
              </p>
              

              <div className="mt-8 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <Image
                  src="/mgt-team.webp"
                  alt="NISER management team image"
                  width={1200}
                  height={800}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
