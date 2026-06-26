import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Governing Council | About NISER',
  description: 'NISER Governing Council members and responsibilities.',
};

export default function GoverningCouncilPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Governing Council"
              description="Leadership and institutional governance"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Composition and Responsibilities</h2>
                
                <p className="mb-6">
                  The Council is responsible for the determination of the overall policy of the Institute. In particular, the Council is responsible for the financial and operational policies and programmes of the Institute and for ensuring their implementation.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-semibold mb-4">Council Composition</h3>
                  <p className="mb-4">The Council consists of twelve members as follows:</p>
                  <ul className="list-disc list-inside space-y-2 mb-4">
                    <li>A Chairman, who is appointed by the President of the Federal Republic of Nigeria on the recommendation of the Honourable Minister, Budget and Economic Planning</li>
                    <li>The Director-General of the Institute</li>
                    <li>The Permanent Secretary, Federal Ministry of Industry, Trade and Investment or his representative</li>
                    <li>The Director, Macro Department, Budget and Economic Planning</li>
                    <li>The Statistician-General, National Bureau of Statistics</li>
                    <li>The Director of Research, Central Bank of Nigeria</li>
                    <li>Four scholars, who are appointed by the Honourable Minister, Budget and Economic Planning, on the recommendation of the Director-General</li>
                    <li>Two persons to represent interests not otherwise represented so far, who are appointed by the Honourable Minister, Budget and Economic Planning</li>
                  </ul>
                </div>
              </section>

              <section className="border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Current Council Members</h2>
                
                <div className="mb-8 flex flex-col md:flex-row gap-8">
                  <div className="md:w-64 flex-shrink-0">
                    <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Chairman</p>
                        <p className="text-xs mt-2">Image Placeholder</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">Inauguration and Recent Developments</h3>
                  <p className="mb-4">
                    On the 14th of February, 2023, The Honorable Minister of State for Budget and National Planning, Prince Clem Agba inaugurated new members of the governing council for the institute.
                  </p>
                  
                  <p className="mb-4">
                    <strong>Previous Council Members (Inaugurated February 14, 2023):</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 mb-6">
                    <li>Dr Emmanuel O. Imafidon (Chairman)</li>
                    <li>Dr Hauwa V. Ibrahim</li>
                    <li>Professor Banji Oyelaran-Oyeyinka</li>
                    <li>Alhaji Sabiu Zakari</li>
                    <li>Alhaji Kalli Gazali</li>
                    <li>Professor Benedict N. Akanegbu</li>
                    <li>Felicia I. Onibon</li>
                  </ul>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-3">Important Notice</h4>
                    <p className="mb-3">
                      With effect from June 16, 2023, President Bola Ahmed Tinubu, GCFR, approved the immediate dissolution of the Governing Boards of all Federal Government Parastatals, Agencies, Institutions, and Government-Owned Companies in the exercise of its Constitutional Powers and in the Public interest.
                    </p>
                    <p className="mb-3">
                      In view of this development the newly inaugurated membership of the Council of NISER was dissolved and until such a time new boards are constituted, the Chief Executive Officers of the Parastatals, Agencies, Institutions, and Government-Owned Companies are directed to refer matters requiring the attention of their Boards to the President, through the Permanent Secretaries of their respective supervisory Ministries and Offices.
                    </p>
                  </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Statutory Council Members</h3>
                  <p className="mb-4">Other members of the Council are:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>The Director of the Institute</li>
                    <li>Permanent Secretary, Federal Ministry of Industries or his representative</li>
                    <li>Director (Macro) in the Ministry of Budget and Economic Planning</li>
                    <li>The Statistician-General, National Bureau of Statistics</li>
                    <li>Director of Research, Central Bank of Nigeria</li>
                  </ul>
                </div>
              </section>

              <section className="border-t pt-12 mt-12">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="mb-4">
                    <strong>How can we help you?</strong>
                  </p>
                  <p>
                    Contact us at the NISER office nearest to you or submit an inquiry online.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
