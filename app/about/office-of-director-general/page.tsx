import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Office of the Director General | About NISER',
  description: 'The Office of the Director General at NISER.',
};

export default function OfficeOfDirectorGeneralPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Office of the Director General"
              description="Leadership and strategic direction"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Prof. Antonia Taiye Simbine - Director-General</h2>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-3">Short Biographical Profile</h3>
                  <p className="mb-4">
                    Prof A.T Simbine (nee Okoosi) (PhD, Ibadan) is a Professor of Political Science & International Relations. 
                    She was appointed as NISER Director-General (DG) by President Muhammadu Buhari on May 20, 2022. Her appointment 
                    took effect from June 1, 2022. Prof Simbine is the first woman to be appointed DG of Nigeria's 62-year-old premiere Think Tank.
                  </p>
                  <p>
                    Until her appointment as DG, she was Research Professor in the Political and Governance Policy Department (PGPD) 
                    and Head, Knowledge Management Department (KMD), NISER. She started her career at NISER as a Youth Corps member in 1984 
                    and rose to the rank of Research Professor in 2010.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Research and Consulting Interests</h3>
                  <p>
                    Public sector governance, the Legislature, Politics and Elections in Nigeria; Gender issues especially Women&apos;s Education 
                    and Political Participation; International Relations; Peacekeeping and Conflict Resolution; as well as issues in 
                    socio-economic development and good governance.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Education</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ahmadu Bello University Zaria</li>
                      <li>University of Ibadan, Ibadan</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Languages</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Fluent in English</li>
                      <li>Fluent in Hausa</li>
                      <li>Fluent in Yoruba</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Professional & Academic Experience</h3>
                  <p className="mb-3">
                    A member of several local and international professional organizations that promote democratic governance and development. 
                    She taught Peace and Conflict Studies at the University of Ibadan and served as External Examiner (undergraduate and 
                    post-graduate) to the Universities of Benin, Ilorin and Al-Hikmah University in Ilorin, Kwara State. She is a 2021 Fellow, 
                    Academy of Politics, Nigeria Political Science Association (NPSA). She is widely published.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Consulting & Public Service Experience</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>National Commissioner, INEC, representing North Central geopolitical zone (2015-2020)</li>
                    <li>Faculty Member and Reviewer for the New York-based Next Generation Social Sciences in Africa Fellowship Program of the Social Science Research Council (2013)</li>
                    <li>Member, INEC Registration and Election Review Committee (IRERC) (2011)</li>
                    <li>Consultant to the Presidency&apos;s Electoral Reform Committee (ERC), and Sub-Committee on Electoral Systems (2008)</li>
                    <li>Resource Person for the International Institute for Democracy and Electoral Assistance (IDEA) on "Democracy Assessment in Nigeria" (2000)</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Awards</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Exchange Program scholarship at the Centre for the Study of Developing Societies (CSDS), New Delhi (2002/2003)</li>
                    <li>British Council Fellowship award to the University of Leeds, United Kingdom (1993)</li>
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Publications</h3>
                  <p>
                    <a 
                      href="https://scholar.google.com/citations?user=vHsO5wsAAAAJ&hl=en&oi=ao" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Google Scholar Page
                    </a>
                  </p>
                </div>
              </section>

              <section className="border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Office Structure</h2>
                <p className="mb-6">
                  The Office of Director-General consists of the Director-General, who is the Chief Executive of the Institute, six units 
                  and two liaison offices. The units and liaison offices are as follows:
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Units under the Office of Director-General</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Anti-Corruption and Transparency Unit (ACTU)</li>
                      <li>Internal Audit Unit</li>
                      <li>Legal Unit</li>
                      <li>Public Affairs and Information Unit (PAIU)</li>
                      <li>SERVICOM Unit</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Liaison Offices</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Abuja Liaison Office</li>
                      <li>Lagos Liaison Office</li>
                    </ul>
                  </div>
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
