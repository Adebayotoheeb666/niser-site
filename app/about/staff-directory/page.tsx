import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getResearchers } from '@/lib/cms/client';
import './../staff.css';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Staff Directory | About NISER',
  description: 'NISER staff directory and contact information.',
};

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Policy',
  agriculture: 'Agriculture & Food Policy',
  governance: 'Governance & Institutions',
  industry: 'Industry & Enterprise',
};

const supportServices = [
  {
    icon: '🛎️',
    title: 'SERVICOM - Service Excellence',
    contact: 'Charter Desk Officer: Teneilabe Millicent O.',
    email: 'mteneilabe@gmail.com',
    phone: '08033492855',
  },
  {
    icon: '🛡️',
    title: 'ACTU - Anti-Corruption Unit',
    contact: 'Dr. (Mrs) Foluso M. Adeyinka (Chairperson)',
    email: 'actu@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
  {
    icon: '⚖️',
    title: 'Legal Unit',
    contact: 'Head, Legal Unit',
    email: 'legal@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
  {
    icon: '📋',
    title: 'Internal Audit Unit',
    contact: 'Head, Internal Audit',
    email: 'audit@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
];

export default async function StaffDirectoryPage() {
  const researchers = await getResearchers({ active: true });
  const getInitials = (name?: string) =>
    (name || 'Staff').split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2);

  const staffByDepartment = researchers.reduce<
    Record<string, { department: string; staff: typeof researchers }>
  >((acc, researcher) => {
    const department = researcher.division
      ? divisionLabels[researcher.division] ?? researcher.division
      : 'Research Staff';
    if (!acc[department]) {
      acc[department] = { department, staff: [] };
    }
    acc[department].staff.push(researcher);
    return acc;
  }, {});

  const departments = Object.values(staffByDepartment);
  const totalStaff = researchers.length;

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="staff-hero">
          <div className="staff-container">
            <span className="about-kicker">About NISER &middot; Our People</span>
            <h1 className="staff-hero__title">Staff Directory</h1>
            <p className="staff-hero__lead">
              Meet the researchers, administrators, and support teams who advance NISER&apos;s
              mission of evidence-based policy research for national development.
            </p>
            <div className="staff-hero__meta">
              <span className="staff-hero__meta-item">
                <strong>{totalStaff || 0}</strong> staff profiles
              </span>
              <span className="staff-hero__meta-item">
                <strong>{departments.length || 0}</strong> departments
              </span>
              <span className="staff-hero__meta-item">
                <strong>{supportServices.length}</strong> support services
              </span>
            </div>
          </div>
        </section>

        <div className="staff-container">
          {totalStaff === 0 ? (
            <p className="staff-dept__empty">Staff profiles are being prepared and will appear here shortly.</p>
          ) : (
            departments.map((dept, deptIdx) => (
              <section key={dept.department} className="staff-dept" aria-label={dept.department}>
                <div className="staff-dept__top">
                  <span className="staff-dept__index" aria-hidden="true">
                    {String(deptIdx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="staff-dept__title">{dept.department}</h2>
                  <span className="staff-dept__count">
                    {dept.staff.length} {dept.staff.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="staff-grid">
                  {dept.staff.map((member) => (
                    <Link
                      key={member.slug}
                      href={`/about/staff/${member.slug}`}
                      className="staff-card"
                    >
                      <div className="staff-card__media">
                        {member.photo ? (
                          <Image
                            src={member.photo}
                            alt={member.fullName}
                            className="staff-card__img"
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <span className="staff-card__initials" aria-hidden="true">
                            {getInitials(member.fullName)}
                          </span>
                        )}
                      </div>
                      <div className="staff-card__body">
                        <h3 className="staff-card__name">{member.fullName}</h3>
                        <p className="staff-card__position">{member.position}</p>
                        <span className="staff-card__link">
                          View profile &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Support services */}
          <section className="staff-support" aria-labelledby="support-heading">
            <div className="staff-head">
              <h2 id="support-heading" className="staff-head__title">
                Support Services
              </h2>
              <p className="staff-head__desc">Units that keep the Institute running.</p>
            </div>
            <div className="staff-services">
              {supportServices.map((service) => (
                <div key={service.title} className="staff-service">
                  <span className="staff-service__icon" aria-hidden="true">{service.icon}</span>
                  <h3 className="staff-service__title">{service.title}</h3>
                  <p className="staff-service__contact">{service.contact}</p>
                  <div className="staff-service__row">
                    <span className="staff-service__row-label">Email</span>
                    <a href={`mailto:${service.email}`}>{service.email}</a>
                  </div>
                  <div className="staff-service__row">
                    <span className="staff-service__row-label">Phone</span>
                    <a href={`tel:${service.phone.replace(/\s/g, '')}`}>{service.phone}</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Offices */}
          <section className="staff-info" aria-label="NISER offices">
            <div className="staff-info__grid">
              <div className="staff-info__card">
                <h2 className="staff-info__title">Main Office</h2>
                <address>
                  Nigerian Institute of Social and Economic Research (NISER)
                  <br />
                  PMB 5, University of Ibadan Post Office
                  <br />
                  Ibadan, Oyo State
                  <br />
                  Nigeria
                </address>
                <div className="staff-info__links">
                  <a href="tel:+2347033545404">+234 (0) 703 354 5404</a>
                  <a href="mailto:info@niser.gov.ng">info@niser.gov.ng</a>
                </div>
              </div>
              <div className="staff-info__card">
                <h2 className="staff-info__title">Liaison Offices</h2>
                <div>
                  <p className="staff-info__sub">Abuja Liaison Office</p>
                  <p className="staff-info__desc">
                    For inquiries and services in Abuja and Northern Nigeria
                  </p>
                </div>
                <div>
                  <p className="staff-info__sub">Lagos Liaison Office</p>
                  <p className="staff-info__desc">
                    For inquiries and services in Lagos and South-Western Nigeria
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
