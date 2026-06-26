import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Staff database - can be moved to a separate data file or database
const allStaff = [
  {
    id: 'prof-antonia-taiye-simbine',
    name: 'Prof. Antonia Taiye Simbine',
    position: 'Director-General',
    department: 'Office of the Director-General',
    email: 'dg@niser.gov.ng',
    phone: '07033545404',
    biography: 'Prof A.T Simbine (nee Okoosi) (PhD, Ibadan) is a Professor of Political Science & International Relations. She was appointed as NISER Director-General (DG) by President Muhammadu Buhari on May 20, 2022. Her appointment took effect from June 1, 2022. Prof Simbine is the first woman to be appointed DG of Nigeria\'s 62-year-old premiere Think Tank.',
    qualifications: ['PhD in Political Science, University of Ibadan', 'Bachelor\'s Degree in Political Science'],
    research_interests: ['Public sector governance', 'Gender and Development', 'International Relations', 'Peacekeeping and Conflict Resolution'],
  },
  {
    id: 'staff-001',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Agricultural and Food Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-002',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Economic and Business Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-003',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Environmental and Physical Infrastructure Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-004',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Human Capital Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-005',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Innovation and Technology Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-006',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Social Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-007',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Political and Governance Policy Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-008',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Knowledge Management Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-009',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Research Management Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
  {
    id: 'staff-010',
    name: 'To be updated',
    position: 'Head of Department',
    department: 'Administration and Finance Department',
    email: 'contact@niser.gov.ng',
    phone: '+234 (0) 803 000 0000',
    biography: 'Staff biography will be updated soon.',
    qualifications: [],
    research_interests: [],
  },
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const staff = allStaff.find((s) => s.id === params.id);
  return {
    title: `${staff?.name || 'Staff'} | NISER`,
    description: `${staff?.name} - ${staff?.position} at NISER`,
  };
}

export async function generateStaticParams() {
  return allStaff.map((staff) => ({
    id: staff.id,
  }));
}

export default function StaffDetailPage({ params }: { params: { id: string } }) {
  const staff = allStaff.find((s) => s.id === params.id);

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
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
        <div className="section">
          <div className="container max-w-4xl">
            <Link
              href="/about/staff-directory"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
            >
              <span className="mr-2">←</span>
              Back to Staff Directory
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Staff Photo Section */}
              <div className="md:col-span-1">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-6">
                  <div className="text-center text-gray-500">
                    <p className="text-lg">Staff Photo</p>
                    <p className="text-sm mt-2">Image Placeholder</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <a
                        href={`mailto:${staff.email}`}
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {staff.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <a
                        href={`tel:${staff.phone}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {staff.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Department</p>
                      <p className="text-sm font-medium text-gray-900">{staff.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Details Section */}
              <div className="md:col-span-2">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2 text-gray-900">{staff.name}</h1>
                  <p className="text-xl text-blue-600 font-semibold mb-2">{staff.position}</p>
                  <p className="text-gray-600">{staff.department}</p>
                </div>

                {/* Biography */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Biography</h2>
                  <p className="text-gray-700 leading-relaxed">{staff.biography}</p>
                </div>

                {/* Qualifications */}
                {staff.qualifications.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Qualifications</h2>
                    <ul className="space-y-2">
                      {staff.qualifications.map((qual, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-600 mr-3 mt-1">✓</span>
                          <span className="text-gray-700">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Research Interests */}
                {staff.research_interests.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Research Interests</h2>
                    <div className="flex flex-wrap gap-2">
                      {staff.research_interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Staff */}
            <div className="border-t pt-12 mt-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Other Staff Members in {staff.department}</h2>
              <div className="text-gray-600">
                <p>More staff information will be available soon. Return to the</p>
                <Link href="/about/staff-directory" className="text-blue-600 hover:underline">
                  Staff Directory
                </Link>
                {' '}to view all staff.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
