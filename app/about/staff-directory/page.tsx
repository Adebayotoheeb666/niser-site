import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Staff Directory | About NISER',
  description: 'NISER staff directory and contact information.',
};

const staffByDepartment = [
  {
    department: 'Office of the Director-General',
    color: 'border-blue-600',
    staff: [
      {
        id: 'prof-antonia-taiye-simbine',
        name: 'Prof. Antonia Taiye Simbine',
        position: 'Director-General',
        email: 'dg@niser.gov.ng',
        phone: '07033545404',
      },
    ],
  },
  {
    department: 'Agricultural and Food Policy Department',
    color: 'border-green-600',
    staff: [
      {
        id: 'staff-001',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Economic and Business Policy Department',
    color: 'border-indigo-600',
    staff: [
      {
        id: 'staff-002',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Environmental and Physical Infrastructure Policy Department',
    color: 'border-purple-600',
    staff: [
      {
        id: 'staff-003',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Human Capital Policy Department',
    color: 'border-orange-600',
    staff: [
      {
        id: 'staff-004',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Innovation and Technology Policy Department',
    color: 'border-red-600',
    staff: [
      {
        id: 'staff-005',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Social Policy Department',
    color: 'border-pink-600',
    staff: [
      {
        id: 'staff-006',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Political and Governance Policy Department',
    color: 'border-cyan-600',
    staff: [
      {
        id: 'staff-007',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Knowledge Management Department',
    color: 'border-teal-600',
    staff: [
      {
        id: 'staff-008',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Research Management Department',
    color: 'border-emerald-600',
    staff: [
      {
        id: 'staff-009',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
  {
    department: 'Administration and Finance Department',
    color: 'border-amber-600',
    staff: [
      {
        id: 'staff-010',
        name: 'To be updated',
        position: 'Head of Department',
        email: 'contact@niser.gov.ng',
        phone: '+234 (0) 803 000 0000',
      },
    ],
  },
];

const supportServices = [
  {
    title: 'SERVICOM - Service Excellence',
    contact: 'Charter Desk Officer: Teneilabe Millicent O.',
    email: 'mteneilabe@gmail.com',
    phone: '08033492855',
  },
  {
    title: 'ACTU - Anti-Corruption Unit',
    contact: 'Dr. (Mrs) Foluso M. Adeyinka (Chairperson)',
    email: 'actu@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
  {
    title: 'Legal Unit',
    contact: 'Head, Legal Unit',
    email: 'legal@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
  {
    title: 'Internal Audit Unit',
    contact: 'Head, Internal Audit',
    email: 'audit@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
  },
];

export default function StaffDirectoryPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <div className="section">
          <div className="container">
            <SectionHeader
              title="Staff Directory"
              description="Find contact information for NISER staff members"
            />

            <div className="prose max-w-4xl mb-12">
              <p className="mb-6">
                Our dedicated team of researchers, administrators, and support staff work together to advance 
                NISER&apos;s mission of conducting policy research and providing evidence-based recommendations 
                for national development. Use the directory below to find contact information for staff members 
                across our various departments.
              </p>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Research & Support Departments</h2>
              <div className="space-y-6">
                {staffByDepartment.map((dept) => (
                  <div
                    key={dept.department}
                    className={`border-l-4 ${dept.color} bg-white rounded-lg p-6 shadow-sm`}
                  >
                    <h3 className="text-xl font-semibold mb-4">{dept.department}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dept.staff.map((member) => (
                        <Link key={member.id} href={`/about/staff/${member.id}`}>
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer h-full">
                            <div className="aspect-square bg-gray-300 flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <p className="text-sm">Staff Photo</p>
                                  <p className="text-xs mt-1">Image Placeholder</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="font-semibold text-gray-900 line-clamp-2">{member.name}</p>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-1">{member.position}</p>
                              <div className="space-y-2 text-sm">
                                <div className="truncate">
                                  <p className="text-gray-500 text-xs">Email:</p>
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="text-blue-600 hover:underline text-xs truncate block"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {member.email}
                                  </a>
                                </div>
                                <div className="truncate">
                                  <p className="text-gray-500 text-xs">Phone:</p>
                                  <a
                                    href={`tel:${member.phone}`}
                                    className="text-blue-600 hover:underline text-xs truncate block"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {member.phone}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Support Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportServices.map((service) => (
                  <div key={service.title} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">{service.title}</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">{service.contact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Email:</p>
                        <a
                          href={`mailto:${service.email}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {service.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Phone:</p>
                        <a
                          href={`tel:${service.phone}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {service.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Main Office Address</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Nigerian Institute of Social and Economic Research (NISER)</strong>
                </p>
                <p>
                  PMB 5 University of Ibadan Post Office<br />
                  Ibadan, Oyo State<br />
                  Nigeria
                </p>
                <p>
                  <strong>Phone:</strong> <a href="tel:+2347033545404" className="text-blue-600 hover:underline">+234 (0) 703 354 5404</a>
                </p>
                <p>
                  <strong>Email:</strong> <a href="mailto:info@niser.gov.ng" className="text-blue-600 hover:underline">info@niser.gov.ng</a>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h2 className="text-2xl font-bold text-green-900 mb-4">Liaison Offices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Abuja Liaison Office</h3>
                  <p className="text-sm text-green-800">
                    For inquiries and services in Abuja and Northern Nigeria
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Lagos Liaison Office</h3>
                  <p className="text-sm text-green-800">
                    For inquiries and services in Lagos and South-Western Nigeria
                  </p>
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
