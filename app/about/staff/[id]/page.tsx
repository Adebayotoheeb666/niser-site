import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getResearcherBySlug, getResearchers } from '@/lib/cms/client';
import '../../staff.css';

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Policy',
  agriculture: 'Agriculture & Food Policy',
  governance: 'Governance & Institutions',
  industry: 'Industry & Enterprise',
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const staff = await getResearcherBySlug(params.id);
  return {
    title: `${staff?.fullName || 'Staff'} | NISER`,
    description: `${staff?.fullName || 'Staff Member'} - ${staff?.position || 'Researcher'} at NISER`,
  };
}

export async function generateStaticParams() {
  const researchers = await getResearchers({ active: true });
  return researchers.map((researcher) => ({
    id: researcher.slug,
  }));
}

export default async function StaffDetailPage({ params }: { params: { id: string } }) {
  const [staff, researchers] = await Promise.all([
    getResearcherBySlug(params.id),
    getResearchers({ active: true }),
  ]);
  const getInitials = (name?: string) =>
    (name || 'Staff').split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2);
  const cleanHtml = (html?: string) =>
    html
      ? html
          .replace(/<!--\s*wp:[\s\S]*?-->/g, '')
          .replace(/<!--\s*\/wp:[\s\S]*?-->/g, '')
          .trim()
      : '';
  const biographyHtml = cleanHtml(staff?.biography);
  const otherStaff = researchers.filter((researcher) => researcher.slug !== params.id);
  const divisionLabel = staff?.division ? divisionLabels[staff.division] ?? staff.division : null;

  if (!staff) {
    return (
      <>
        <Header />
        <main id="main-content">
          <div className="section">
            <div className="container">
              <div className="py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Staff Member Not Found</h1>
                <p className="text-gray-600 mb-8">The staff member you&apos;re looking for doesn&apos;t exist.</p>
                <Link
                  href="/about/staff-directory"
                  className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  Back to Staff Directory
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="staff-container">
          <div className="staff-profile">
            <Link href="/about/staff-directory" className="staff-back">
              <span aria-hidden="true">&larr;</span> Back to Staff Directory
            </Link>

            <div className="profile-grid">
              {/* Aside */}
              <aside className="profile-aside">
                <div className="profile-photo">
                  {staff.photo ? (
                    <Image
                      src={staff.photo}
                      alt={`Portrait of ${staff.fullName}`}
                      className="profile-photo__img"
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                    />
                  ) : (
                    <span className="profile-photo__initials" aria-hidden="true">
                      {getInitials(staff.fullName)}
                    </span>
                  )}
                </div>

                <div className="profile-contact">
                  <h2 className="profile-contact__title">Contact Information</h2>
                  <dl>
                    {staff.email && (
                      <div>
                        <dt>Email</dt>
                        <dd>
                          <a href={`mailto:${staff.email}`}>{staff.email}</a>
                        </dd>
                      </div>
                    )}
                    {staff.phone && (
                      <div>
                        <dt>Phone</dt>
                        <dd>
                          <a href={`tel:${staff.phone}`}>{staff.phone}</a>
                        </dd>
                      </div>
                    )}
                    {staff.linkedin && (
                      <div>
                        <dt>LinkedIn</dt>
                        <dd>
                          <a href={staff.linkedin} target="_blank" rel="noreferrer">
                            {staff.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                    {staff.websiteUrl && (
                      <div>
                        <dt>Website</dt>
                        <dd>
                          <a href={staff.websiteUrl} target="_blank" rel="noreferrer">
                            {staff.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                    {staff.orcid && (
                      <div>
                        <dt>ORCID</dt>
                        <dd>
                          <a href={staff.orcid} target="_blank" rel="noreferrer">
                            {staff.orcid.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                  {divisionLabel && (
                    <div className="profile-chips">
                      <span className="profile-chip">{divisionLabel}</span>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main */}
              <div className="profile-main">
                <span className="about-kicker">Researcher Profile</span>
                <h1 className="profile-name">{staff.fullName}</h1>
                <p className="profile-position">{staff.position}</p>

                <section className="profile-section" aria-labelledby="biography-heading">
                  <h2 id="biography-heading" className="profile-section__title">
                    Biography
                  </h2>
                  {biographyHtml ? (
                    <div
                      className="about-staff-bio text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: biographyHtml }}
                    />
                  ) : (
                    <p className="profile-empty">
                      A biography is not currently available from the CMS.
                    </p>
                  )}
                </section>

                {staff.researchInterests && staff.researchInterests.length > 0 && (
                  <section className="profile-section" aria-labelledby="interests-heading">
                    <h2 id="interests-heading" className="profile-section__title">
                      Research Interests
                    </h2>
                    <ul className="profile-interests" role="list">
                      {staff.researchInterests.map((interest, idx) => (
                        <li key={idx} className="profile-chip">
                          {interest}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Other staff */}
          <section className="profile-other" aria-labelledby="other-heading">
            <h2 id="other-heading" className="profile-other__title">
              Other Staff Profiles
            </h2>
            {otherStaff.length > 0 ? (
              <div className="profile-other__grid">
                {otherStaff.slice(0, 4).map((researcher) => (
                  <Link
                    key={researcher.slug}
                    href={`/about/staff/${researcher.slug}`}
                    className="profile-other__card"
                  >
                    <div className="profile-other__avatar">
                      {researcher.photo ? (
                        <Image
                          src={researcher.photo}
                          alt=""
                          width={72}
                          height={72}
                        />
                      ) : (
                        <span aria-hidden="true">{getInitials(researcher.fullName)}</span>
                      )}
                    </div>
                    <div>
                      <p className="profile-other__name">{researcher.fullName}</p>
                      <p className="profile-other__pos">{researcher.position}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="profile-empty">No other staff profiles are currently available.</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
