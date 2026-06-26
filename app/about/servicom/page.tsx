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
              title="SERVICOM NISER"
              description="Service Excellence and Complaints Management"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">About SERVICOM NISER</h2>
                
                <p className="mb-4">
                  Following the new reforms initiative by the Institute, the operational departments have been restructured and reorganized from five (5) to Eleven (11), comprising of Eight (8) research and Three (3) Non-research departments. This was done to meet the needs of the emerging socio-economic realities facing the nation.
                </p>

                <p className="mb-6">
                  Therefore, updating the integrated service charter became necessary to give our clients accurate information about our services and capabilities. This charter represents the daily operationalization of service compact with all Nigerian citizens (SERVICOM) upon which the people shall expect and demand prompt quality service delivery without let and hindrance.
                </p>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="font-semibold">
                    The Integrated service charter is the social contract between the institute and its esteemed clients throughout Nigeria and beyond.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Roles and Responsibilities</h2>
                
                <h3 className="text-lg font-semibold mb-4">The Reform Coordination and Service Improvement Division</h3>
                <p className="mb-4">This division comprises of three (3) units:</p>
                <ol className="list-decimal list-inside space-y-2 mb-6">
                  <li>SERVICOM</li>
                  <li>Reform</li>
                  <li>Customer Service/Complaint</li>
                </ol>

                <h3 className="text-lg font-semibold mb-4">Primary Roles of SERVICOM in NISER</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Help create awareness about service delivery activities in the Institute</li>
                  <li>Assist in improving the capability of staff to meet the Institute delivery objectives contained in the charter</li>
                  <li>Provide and set standards as a process of improving quality of service</li>
                  <li>Conducts SERVICOM compliance evaluation of services provided by and to the Institute</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Service Delivery Standards</h2>
                <p className="mb-4">Our clients should expect the following:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Easy access to the service charter which will be produced as hand book and hand bills displayed on the notice board in the offices</li>
                  <li>Prompt and courteous service</li>
                  <li>Adequate provision of information</li>
                  <li>Explanation of some of the constraints under which the institute operates</li>
                  <li>Provision of all necessary information that the institution may require to facilitate timely processing of requests/complaints</li>
                  <li>Effective consultation in plain language</li>
                  <li>Responsiveness of the charter, including responsiveness to the needs of vulnerable groups</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Monitoring Activities</h2>
                <p className="mb-4">
                  The SERVICOM unit carries out oversight function to ascertain and publish the overall performance against service delivery standards through on-the-spot assessment, oral interview, regular consultations and written complaints.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Grievances Redress Mechanism</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">How to Lodge a Complaint</h3>
                  <p className="mb-4"><strong>Complaint Procedures:</strong> Written and unwritten complaints are accepted</p>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold mb-3">Who to Complain To:</h4>
                    <p className="mb-4">Grievances should be channeled to:</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold">The Director General</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>Email: <a href="mailto:dg@niser.gov.ng" className="text-blue-600 hover:underline">dg@niser.gov.ng</a></li>
                          <li>Tel: <a href="tel:+2347033545404" className="text-blue-600 hover:underline">07033545404</a></li>
                        </ul>
                      </div>

                      <div className="text-center text-gray-500">OR</div>

                      <div>
                        <p className="font-semibold">The Nodal Officer</p>
                        <p className="text-sm">MARAFA SULEIMAN MOHAMMED</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>Tel: <a href="tel:+2348032602426" className="text-blue-600 hover:underline">08032602426</a></li>
                          <li>Email: <a href="mailto:marafasuleiman6@gmail.com" className="text-blue-600 hover:underline">marafasuleiman6@gmail.com</a></li>
                        </ul>
                      </div>

                      <div className="text-center text-gray-500">OR</div>

                      <div>
                        <p className="font-semibold">Charter Desk Officer</p>
                        <p className="text-sm">TENEILABE MILLICENT O.</p>
                        <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                          <li>Tel: <a href="tel:+2348033492855" className="text-blue-600 hover:underline">08033492855</a></li>
                          <li>Email: <a href="mailto:mteneilabe@gmail.com" className="text-blue-600 hover:underline">mteneilabe@gmail.com</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">Time Limits for Response:</p>
                      <p className="text-sm">24 hours to respond to simple complaints/requests; one week for complaints/requests that require investigation/consultation</p>
                    </div>

                    <div>
                      <p className="font-semibold">Action to be Taken:</p>
                      <p className="text-sm">Action shall be taken by the institute within 24 hours after a thorough evaluation and investigation</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Redress Available</h3>
                  <p className="mb-4">Where and whenever service delivery fails to meet expectations, a client shall be entitled to seek redress in the following manner:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Lodge a well detailed grievance/request with the Director General of the Institute</li>
                    <li>Seek redress via the office&apos;s suggestion box placed at the reception desk</li>
                    <li>Contact or address a petition to the Nodal Officer or the complaints&apos; desk officer</li>
                  </ol>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Obligations and Expectations from Our Clients</h2>
                <p className="mb-4">It is expected that our esteemed clients shall:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Have access to SERVICOM charter produced in form of handbooks and also displayed on notice boards and reception desk</li>
                  <li>Submit in writing all requests that require the attention of the Institute</li>
                  <li>Show maximum understanding for some of the unavoidable constraints within which the Institute operates</li>
                  <li>Provide all necessary information(s) that the Institute may require to facilitate prompt processing of requests/complaints</li>
                  <li>Ensure regular consultations with the Institute to avoid hitches that could constitute service failure</li>
                  <li>Observe all procedures while seeking for service or redress in the Institute</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Stakeholder Participation</h2>
                <p>
                  Regular and timely stakeholders&apos; consultative forums such as workshops, seminars, and conferences are organized to determine the preferences of our esteemed clients.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Existing Limitations</h2>
                <p className="mb-4">The Institute operates within the following constraints:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Paucity of funds (low budgetary allocation)</li>
                  <li>Inadequate office equipment such as computers and internet facilities</li>
                  <li>Irregular training of staff</li>
                  <li>Change in Government policy</li>
                  <li>Approval limitations of funds provided</li>
                </ul>
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
