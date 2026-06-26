import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Departments | About NISER',
  description: 'NISER departments and research divisions.',
};

export default function DepartmentsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Departments"
              description="Research divisions and organizational units"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Research Departments</h2>
                <p className="mb-6">
                  NISER operates eight research departments, each focused on critical policy areas essential to Nigeria&apos;s development.
                </p>

                <div className="space-y-6">
                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Agricultural and Food Policy Department</h3>
                    <p className="font-medium text-green-700 mb-2">Contribute to evidence-based Agricultural and Food Policy Development</p>
                    <p className="text-sm text-gray-700">Focal areas: Agriculture Production and Value Chain Development, Rural Development and Extension Services, Agricultural Technology and Innovation, Gender and Youth Empowerment in Agriculture, Agricultural Diversification and Trade, Climate-smart agriculture, Agricultural Finance and Agri-business.</p>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Economic and Business Policy Department</h3>
                    <p className="font-medium text-blue-700 mb-2">Anchor Economic and Business Policy by Providing Credible Research</p>
                    <p className="text-sm text-gray-700">Research focus: Real Sector Development and Economic Diversification, Unemployment and Employment Dynamics, Fiscal Policy and Public Debt Management, Monetary Policy and Price Stability, External Trade Policies, Revenue Diversification, Energy Diversification, Industrialization and MSME, Investment and Growth, Trade and Regional Integration, and Informal sector dynamics.</p>
                  </div>

                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Environmental and Physical Infrastructure Policy Department</h3>
                    <p className="font-medium text-purple-700 mb-2">Support Environment and Physical Infrastructure Policy Development</p>
                    <p className="text-sm text-gray-700">Research focus: Transport development, Environment, Housing, Renewable Energy, Population studies, Climate change and Disaster risks management, Urban and rural development planning, Waste management, Natural Resource Management, and GIS applications.</p>
                  </div>

                  <div className="border-l-4 border-orange-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Human Capital Policy Department</h3>
                    <p className="font-medium text-orange-700 mb-2">Contribute to the advancement of Human Capital Policy Development</p>
                    <p className="text-sm text-gray-700">Research focus: Human resource planning, Education curriculum development, Vocational and technical education, Labour market analysis, Educational access and quality, and Innovation and Technology Policy.</p>
                  </div>

                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Innovation and Technology Policy Department</h3>
                    <p className="font-medium text-red-700 mb-2">Promote innovation and technological advancement</p>
                    <p className="text-sm text-gray-700">Research focus: Innovation and industrial policy, Technological innovation, Science, technology, and innovation, and Intellectual property and copyrights issues.</p>
                  </div>

                  <div className="border-l-4 border-pink-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Social Policy Department</h3>
                    <p className="font-medium text-pink-700 mb-2">Contribute to effective social policy formulation and implementation</p>
                    <p className="text-sm text-gray-700">Core thematic areas: Population &amp; Demographic Issues, Social related Health issues, Child &amp; Maternal Health Issues, Reproductive Health, Gender &amp; Development, Human Rights Issues, Criminology, Poverty Reduction &amp; Social Protection, Culture &amp; Tourism, and Labour &amp; Industrial Relations.</p>
                  </div>

                  <div className="border-l-4 border-cyan-600 pl-4">
                    <h3 className="text-lg font-semibold mb-2">Political and Governance Policy Department</h3>
                    <p className="font-medium text-cyan-700 mb-2">Provide evidence towards the advancement of political and government policy development</p>
                    <p className="text-sm text-gray-700">Focal areas: Governance and rule of law, Political participation and gender inclusion, Accountability of government and allied institutions, Security, conflicts, and development, Public sector &amp; Intergovernmental Relations, and Foreign Relations.</p>
                  </div>
                </div>
              </section>

              <section className="border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Non-Research Departments</h2>
                <p className="mb-6">
                  NISER operates three non-research departments that support and strengthen the institute&apos;s operations and research delivery.
                </p>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Knowledge Management Department</h3>
                    <p className="font-medium text-gray-700 mb-2">Create a knowledge repository for the institute and country</p>
                    <p className="text-sm text-gray-600 mb-3"><strong>Strategic Objectives:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Create a national data centre</li>
                      <li>Manage NISER&apos;s knowledge repository to drive productivity in the country</li>
                      <li>Create and market NISER brand to local and international audiences</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Research Management Department</h3>
                    <p className="font-medium text-gray-700 mb-2">Central coordination and management of research activities</p>
                    <p className="text-sm text-gray-600"><strong>Strategic Objective:</strong> To ensure research quality</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Administration and Finance Department</h3>
                    <p className="font-medium text-gray-700 mb-2">Support research activities through management of resources</p>
                    <p className="text-sm text-gray-600 mb-3"><strong>Strategic Objectives:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      <li>Continuously improve service delivery through improved communication, efficiency, and effectiveness</li>
                      <li>Strategically align energies and resources to support the research agenda</li>
                      <li>Advise the institute&apos;s CEO on all financial matters</li>
                      <li>Align financial resources to support NISER&apos;s research agenda</li>
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
