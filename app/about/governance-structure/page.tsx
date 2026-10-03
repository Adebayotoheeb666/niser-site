import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Governance Structure | About NISER',
  description: 'NISER governance structure and organizational framework.',
};

export default function GovernanceStructurePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Governance Structure"
              description="Organizational framework and decision-making bodies"
            />
            <div className="prose max-w-5xl">
              <p>
                NISER operates under a well-defined governance structure that ensures institutional effectiveness
                and accountability.
              </p>
             

              <div className="mt-8 flex flex-col gap-6">
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <Image
                    src="/organization-structure.webp"
                    alt="NISER organization structure diagram"
                    width={1200}
                    height={900}
                    className="h-auto w-full rounded-md object-contain"
                  />
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <Image
                    src="/list-structure.webp"
                    alt="NISER list structure diagram"
                    width={1200}
                    height={900}
                    className="h-auto w-full rounded-md object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
