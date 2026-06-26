import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Research Methodology Training | NISER',
  description: 'Comprehensive training in research methodology and design at NISER.',
};

export default function ResearchMethodologyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Research Methodology Training"
              description="Develop essential research skills and methodologies"
            />
            <div className="prose max-w-4xl">
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Research Skills and Competence</h2>
                
                <p className="mb-6">
                  NISER recognizes the need for updating and upgrading the research skills and competence of scholars so as to build the teaching and research capacity of their various institutions. Based on this, NISER&apos;s Research Methodology training has commenced both intensive and crash trainings in social and economic related research methodologies. The trainings target emerging thinking in social and economic research, ethical issues in social and economic research, mainstreaming gender and environmental issues, developing research proposals, choosing and formulating study approaches and designs, planning and managing social economic research and writing research reports.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Main Objective</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="font-semibold text-lg">
                    To update and upgrade the research skills and competence of scholars so as to develop research capacity and capability of their various institutions.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Specific Objectives</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold flex-shrink-0">•</span>
                    <span>Expose researchers to skills specific to particular methodologies, e.g. quantitative and qualitative approaches</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold flex-shrink-0">•</span>
                    <span>Expose researchers to analytical skills needed to evaluate policies; analyse and assess research orientations, strategies and diffusion; evaluate programmes and projects</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold flex-shrink-0">•</span>
                    <span>Expose researchers to computer skills in research</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold flex-shrink-0">•</span>
                    <span>Expose researchers to training in methods relevant to issues such as environment and development, and gender sensitive research</span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <div className="mb-8 flex flex-col md:flex-row gap-8">
                  <div className="md:w-64 flex-shrink-0">
                    <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <p className="text-sm">Training Session</p>
                        <p className="text-xs mt-2">Image Placeholder</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-6">Training Coverage</h2>
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-600 pl-4">
                        <h3 className="font-semibold mb-2">Social and Economic Research Methodologies</h3>
                        <p className="text-sm text-gray-700">Comprehensive coverage of research approaches relevant to policy development and institutional capacity building.</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4">
                        <h3 className="font-semibold mb-2">Ethical and Gender Considerations</h3>
                        <p className="text-sm text-gray-700">Incorporation of ethical issues and gender sensitivity into research design and implementation.</p>
                      </div>
                      <div className="border-l-4 border-green-600 pl-4">
                        <h3 className="font-semibold mb-2">Practical Skills Development</h3>
                        <p className="text-sm text-gray-700">Hands-on training in proposal development, research design selection, and technical implementation.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">How to Apply</h2>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="mb-4">
                    The Research Methodology Training is conducted depending upon the availability of participants. A call for application is posted on NISER&apos;s website and interested applicants are encouraged to apply.
                  </p>
                  <p className="font-semibold mb-3">Please keep on visiting the website for the call or register for our Online Newsletter and we will notify you whenever a new call or any other relevant content is posted.</p>
                  
                  <div className="mt-6 p-4 bg-white rounded border-l-4 border-green-600">
                    <h3 className="font-semibold mb-2">Application Process</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Visit the NISER website for the training call announcement</li>
                      <li>Complete and submit the application form with required documents</li>
                      <li>Await confirmation of your participation</li>
                      <li>Join the training session at the scheduled date and time</li>
                    </ol>
                  </div>
                </div>
              </section>

              <section className="border-t pt-12">
                <h2 className="text-2xl font-bold mb-6">Training Format</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Intensive Training</h3>
                    <p className="text-sm text-gray-700">Comprehensive, full-time programs designed for deep skill development and hands-on practice in research methodologies.</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3">Crash Training</h3>
                    <p className="text-sm text-gray-700">Short-term, focused programs for professionals and scholars seeking quick updates in specific research methodology areas.</p>
                  </div>
                </div>
              </section>

              <section className="border-t pt-12">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="mb-4">
                    <strong>How can we help you?</strong>
                  </p>
                  <p>
                    Contact us at the NISER office nearest to you or submit an inquiry online for more information about upcoming research methodology trainings.
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
