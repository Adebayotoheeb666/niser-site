import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import './history.css';

export const metadata: Metadata = {
  title: 'History | About NISER',
  description: 'The history and evolution of the Nigerian Institute of Social and Economic Research.',
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* ─ About NISER ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--right">
              <div className="section-content">
                <h2 className="section-title">About NISER</h2>
                <div className="prose">
                  <p>
                    Nigerian Institute Of Social And Economic Research is a public research institute
                    located in Ibadan. The center is one of the foremost publicly funded think tanks in
                    the country. Prior to the creation of NISER, colonial authorities established the
                    West African Institute of Social and Economic Research. The center was founded in
                    1950 and headquartered in Ibadan with a mission to provide information on economic
                    and social ideas that will be pivotal to development of British West African
                    countries. The institute was affiliated with University of Ibadan and was publicly
                    funded.
                  </p>
                  <p>
                    In 1957, Ghana obtained political independence and opted out of the institute. After
                    Nigeria gained independence in 1960, the name of the institute was changed to
                    Nigerian Institute of Social and Economic Research. In 1977, the military government
                    made NISER an autonomous body. Thereafter, NISER's responsibilities include
                    coordinating social and economic research in federal universities. The institute also
                    carries out independent research on social and economic issues, and provides
                    consultative service to the government based on research findings. The institute's
                    facilities are used as a venue for seminars and conferences.
                  </p>
                </div>
              </div>
              <div className="section-image-placeholder" />
            </div>
          </div>
        </section>

        {/* ─ History of NISER ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--left">
              <div className="section-image-placeholder" />
              <div className="section-content">
                <h2 className="section-title">History of NISER</h2>
                <div className="prose">
                  <p>
                    The Federal Government established the Nigerian Institute of Social and Economic
                    Research (NISER) in 1960 and domiciled it in the University of Ibadan, Ibadan. This
                    followed the dissolution of the West African Institute of Social and Economic
                    Research (WAISER), which the colonial government established in 1950 to serve as a
                    Think Tank in the field of social and economic development for the then British West
                    Africa territory.
                  </p>
                  <p>
                    In 1977, the Federal Government detached the Institute from the University of Ibadan
                    and made it autonomous via NISER Act No. 70 of 1977 (now Laws of the Federation of
                    Nigeria 2006 CAP 115). In 1987, NISER moved out of the University of Ibadan to its
                    headquarters at Ojoo, Ibadan and was placed under the Presidency. In 2006, the
                    Federal Government merged the National Manpower Board (NMB) with NISER and placed the
                    Institute under the National Planning Commission (NPC).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ Our Vision ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--right">
              <div className="section-content">
                <h2 className="section-title">Our Vision</h2>
                <div className="prose">
                  <p>
                    To be a world class think tank in the area of social and economic policy research.
                  </p>
                </div>
              </div>
              <div className="section-image-placeholder" />
            </div>
          </div>
        </section>

        {/* ─ Our Mission ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--left">
              <div className="section-image-placeholder" />
              <div className="section-content">
                <h2 className="section-title">Our Mission</h2>
                <div className="prose">
                  <p>
                    To consistently generate credible knowledge through quality research, conduct
                    specialized training and consultancy services while interacting with relevant
                    segments of the Nigerian society in the task of national development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ Our Mandate ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--right">
              <div className="section-content">
                <h2 className="section-title">Our Mandate</h2>
                <div className="prose">
                  <p>
                    Section 4 of the Nigerian Institute of Social and Economic Research (NISER) Act of
                    1977 [NISER Act, Laws of the Federation of Nigeria, 2006 CAP 115] empowers the
                    Institute to:
                  </p>
                  <ul className="mandate-list">
                    <li>
                      <strong>Conduct research</strong> into the economic and social problems of the
                      country with a view to the application of the results thereof
                    </li>
                    <li>
                      <strong>Provide consultancy services</strong> to Federal and State Governments,
                      their agencies and other organisations, in the field of economic and social
                      development
                    </li>
                    <li>
                      <strong>Organise seminars and conferences</strong> on problems of economic and
                      social development in the country, whether on its own accounts or on behalf of the
                      governments of Nigeria or their agencies
                    </li>
                    <li>
                      <strong>Cooperate with Nigerian universities</strong>, research institutes and
                      other institutions in the mobilization of the country's research potential for the
                      task of national development and dissemination of research findings for the use of
                      policymakers at all levels
                    </li>
                  </ul>
                </div>
              </div>
              <div className="section-image-placeholder" />
            </div>
          </div>
        </section>

        {/* ─ Organizational Structure ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--left">
              <div className="section-image-placeholder" />
              <div className="section-content">
                <h2 className="section-title">Organizational Structure</h2>
                <div className="prose">
                  <p>
                    The NISER Act and NISER Medium-Term Strategic Plan 2011-2015 determine the
                    organizational structure of the Institute.
                  </p>
                  <p>
                    The Institute has a Governing Council, Office of Director-General and departments.
                    There are five departments consisting of three research departments and two
                    non-research departments. Research departments are organized in two working groups
                    each. Non-research departments are organized in divisions and units.
                  </p>
                  <p>
                    A Director-General, who is the Chief Executive, heads the Institute. Each of the five
                    departments has a Director, while working groups, divisions and units have Heads. The
                    Director-General is assisted in the administration of the Institute by the several
                    committees and boards, including the Management Committee. The Management Committee
                    comprises the Director-General, Directors of Departments – five of them, Head of the
                    Technical Collaboration and Corporate Planning Unit (TCCPU) and a secretary. The
                    Institute is self-accounting and it has an internal auditor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─ Regional Framework ─ */}
        <section className="history-section">
          <div className="container">
            <div className="section-layout section-layout--right">
              <div className="section-content">
                <h2 className="section-title">Regional Framework</h2>
                <div className="prose">
                  <p>
                    The Institute has a broad regional framework which comprises the Headquarters in
                    Ibadan, two liaison offices in Abuja and Lagos and six zonal offices, representing
                    the six geo-political zones of the country.
                  </p>
                  <div className="regional-grid">
                    <div className="regional-item">
                      <h3>Headquarters</h3>
                      <p>Ibadan</p>
                    </div>
                    <div className="regional-item">
                      <h3>Liaison Offices</h3>
                      <ul>
                        <li>Abuja</li>
                        <li>Lagos</li>
                      </ul>
                    </div>
                    <div className="regional-item">
                      <h3>Zonal Offices</h3>
                      <ul>
                        <li>North-East: Bauchi</li>
                        <li>North-Central: Minna</li>
                        <li>North-West: Sokoto</li>
                        <li>South-East: Owerri</li>
                        <li>South-South: Port-Harcourt</li>
                        <li>South-West: Akure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section-image-placeholder" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
