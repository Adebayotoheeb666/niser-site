import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'ACTU in NISER | About NISER',
  description: 'Anti-Corruption and Transparency Monitoring Unit - Information about ACTU in NISER.',
};

export default function ACTUPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="ACTU in NISER"
              description="Anti-Corruption and Transparency Monitoring Unit"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">What is ACTU?</h2>
                
                <div className="mb-8 flex flex-col md:flex-row gap-8">
                  <div className="md:w-64 flex-shrink-0">
                    <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-sm">ACTU</p>
                        <p className="text-xs mt-2">Image Placeholder</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="mb-4">
                      ACTU means <strong>Anti-Corruption and Transparency Monitoring Unit</strong>. This unit was set up by the Federal Government through the Independent Corrupt Practices and Other Related offences Commission (ICPC), which is the apex body saddled by law with the responsibility to fight corruption and other related offences in Nigeria. The Unit is an autonomous outfit of the Federal Government of Nigeria operational in Ministries, Departments and Agencies (MDAs) with functional linkage with the Office of the Chief Executive of the respective establishments.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Functions of ACTU</h2>
                <p className="mb-4">ACTU is empowered to carry out the following duties:</p>
                <ul className="list-disc list-inside space-y-3">
                  <li>Function as the main link between MDAs and the ICPC</li>
                  <li>Perform all the duties detailed in Section 6 (a) of the Corrupt Practices and Other related Offences Act, 2000 except that of prosecution</li>
                  <li>Examine the practices, systems and procedures in MDAs as provided in Section 6 (B-D) of the Act 2000 not less than twice in a year and make recommendations to the management of their MDA pursuant to its functions</li>
                  <li>Conduct in-house training for the staff of its organization through workshops, seminars, enlightenment programmes, etc., from time to time</li>
                  <li>Meet at least once a month to discuss and review its activities</li>
                  <li>Members of the Unit shall submit themselves to trainings organized by the commission or by anybody as may be approved by the commission to enable them effectively perform their functions</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Membership</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Composition of the Unit</h3>
                  <p className="mb-4">
                    Members of the ACTU shall consist and be drawn from among officers of management level and those with relevant professional skills spread within the organization. There shall be a Chairman and Secretary plus three other members all not below CONRAISS 12. The Chairperson shall not be less than CONRAISS 14.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Tenure</h3>
                  <p>
                    The Chairman, Secretary and other members of the Unit shall hold office for a period of four years and be reappointed for another period of four years but shall not be eligible for reappointment thereafter. The appointment shall be subjected to ratification and confirmation by the ICPC.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">ACTU in NISER</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Original Inauguration (June 15, 2009)</h3>
                  <p className="mb-4">ACTU was inaugurated in NISER on 15th June, 2009. The original membership was as follows:</p>
                  <div className="bg-gray-50 p-4 rounded">
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>T.O Aderibigbe</strong> – Chairperson</li>
                      <li><strong>Mrs. B.R. Agbede</strong> – Member</li>
                      <li><strong>Dr. O.A. Abimbola</strong> – Member</li>
                      <li><strong>Mr. M.M Ibrahim</strong> – Member</li>
                      <li><strong>Mr. W.C Mejuru</strong> – Secretary</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Officers (From March 2018)</h3>
                  <p className="mb-4">By March 2018, the tenure of some of the ACTU members expired. The institute inaugurated new officers to take over the activities of ACTU for the next four years:</p>
                  <div className="bg-gray-50 p-4 rounded">
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Dr. (Mrs) Foluso M. Adeyinka</strong> – Chairperson</li>
                      <li><strong>Mr. M.S. Marafa</strong> – Member</li>
                      <li><strong>Mr. Lokan Y. Yunana</strong> – Member</li>
                      <li><strong>Mr. Samuel I. Iyoho</strong> – Member</li>
                      <li><strong>Mrs. Mercy E. Clarkson</strong> – Secretary</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="border-t pt-12">
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
