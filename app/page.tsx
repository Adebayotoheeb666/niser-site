import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'NISER | Nigerian Institute of Social and Economic Research',
  description: 'Advancing National Development Through Excellence in Policy Research. Explore publications, insights, data, and more from Nigeria\'s premier think-tank.',
};

export default async function HomePage() {
  // Mock data - replace with CMS calls as needed
  const publications = [
    {
      id: 1,
      title: 'Monetary Policy Transmission in Nigeria: An Empirical Review',
      category: 'Working Paper',
      date: 'Oct 2024',
      image: '📊',
    },
    {
      id: 2,
      title: 'Leveraging Digital Economy for Youth Employment in Oyo State',
      category: 'Policy Brief',
      date: 'Sept 2024',
      image: '💻',
    },
    {
      id: 3,
      title: 'Climate Change Impacts on Smallholder Farming Systems',
      category: 'Working Paper',
      date: 'Aug 2024',
      image: '🌱',
    },
  ];

  const events = [
    { month: 'NOV', day: '14', title: 'Annual Policy Dialogue on Industrial Growth', location: 'NISER Conference Hall, Ibadan | 09:00 AM' },
    { month: 'NOV', day: '28', title: 'Seminar: Data Science in Public Policy Analysis', location: 'Virtual Event via Zoom | 11:00 AM' },
    { month: 'DEC', day: '05', title: 'Research Methodology Workshop for Ph.D Fellows', location: 'Division Training Room | 10:00 AM' },
  ];

  const insights = [
    {
      id: 1,
      title: 'Addressing the Revenue-to-Debt Ratio Challenge in Nigeria',
      category: 'FISCAL POLICY',
      author: 'Dr. Omolola Adeyemi',
      image: '📈',
    },
    {
      id: 2,
      title: 'The Economic Imperative of Off-Grid Solar for Rural SMEs',
      category: 'SUSTAINABLE ENERGY',
      author: 'Prof. Ibrahim Salami',
      image: '☀️',
    },
    {
      id: 3,
      title: 'E-Governance and Public Service Delivery in Nigerian States',
      category: 'GOVERNANCE',
      author: 'Dr. Chinedu Okafor',
      image: '💼',
    },
  ];

  const divisions = [
    { title: 'Macroeconomics', description: 'Strategic analysis of fiscal policies and monetary frameworks.', icon: '📊' },
    { title: 'Poverty', description: 'Social protection strategies and welfare impact assessments.', icon: '👥' },
    { title: 'Agriculture', description: 'Food security, value chains, and rural development policies.', icon: '🌾' },
    { title: 'Governance', description: 'Institutional reform, political economy, and public sector efficiency.', icon: '🏛️' },
    { title: 'Industry', description: 'Industrialization pathways and trade competitiveness studies.', icon: '🏭' },
  ];

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-surface-container-lowest overflow-hidden h-[600px] flex items-center">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center opacity-40 animate-fade-in-slow"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(19, 51, 6, 0.3), rgba(19, 51, 6, 0.3)), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%23133306%22 width=%221200%22 height=%22600%22/%3E%3Cpath fill=%22%232D7012%22 opacity=%220.1%22 d=%22M0 300L100 250L200 300L300 250L400 300L500 250L600 300L700 250L800 300L900 250L1000 300L1100 250L1200 300V600H0Z%22/%3E%3C/svg%3E")',
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />

          <div className="relative z-10 w-full px-margin-desktop max-w-max-width mx-auto">
            <div className="max-w-2xl">
              <span className="text-nigeria-green-vibrant font-label-md tracking-widest block mb-4 uppercase animate-slide-up-stagger-1">
                ESTABLISHED 1960
              </span>
              <h1 className="font-display-lg text-display-lg text-nigeria-green-deep mb-6 animate-slide-up-stagger-2">
                Advancing National Development Through Excellence in Policy Research.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed animate-slide-up-stagger-3">
                NISER stands as Nigeria&apos;s premier think-tank, dedicated to providing high-quality socioeconomic intelligence and strategic policy frameworks that drive sustainable national growth.
              </p>
              <div className="flex gap-4 flex-wrap animate-slide-up-stagger-4">
                <Link
                  href="/publications"
                  className="bg-nigeria-green-deep text-on-primary px-8 py-3 rounded shadow-lg font-label-md hover:translate-y-[-2px] transition-all"
                >
                  Explore Publications
                </Link>
                <Link
                  href="/about"
                  className="border border-nigeria-green-deep text-nigeria-green-deep px-8 py-3 rounded font-label-md hover:bg-surface-container-low transition-all"
                >
                  About the Institute
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Research Divisions */}
        <section className="py-20 bg-surface">
          <div className="px-margin-desktop max-w-max-width mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-2">Research Divisions</h2>
                <p className="text-on-surface-variant max-w-xl">
                  Our multidisciplinary approach covers the critical pillars of Nigeria&apos;s socioeconomic landscape.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {divisions.map((div, idx) => (
                <div
                  key={div.title}
                  className={`bg-surface-container-lowest border border-surface-gray p-6 hover:border-nigeria-green-vibrant transition-all group cursor-pointer hover:shadow-md hover:translate-y-[-4px] animate-slide-up`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="material-symbols-outlined text-research-blue mb-4 text-3xl block group-hover:scale-110 transition-transform">{div.icon}</span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{div.title}</h3>
                  <p className="text-label-md text-on-surface-variant">{div.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Publications & Events */}
        <section className="py-20 border-y border-surface-gray">
          <div className="px-margin-desktop max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Latest Publications */}
            <div className="lg:col-span-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep">Latest Publications</h2>
                <Link href="/publications" className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                  View All Publications
                  <span className="material-symbols-outlined ml-1">arrow_forward</span>
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x snap-mandatory">
                {publications.map((pub, idx) => (
                  <div key={pub.id} className="min-w-[300px] md:min-w-[350px] snap-start animate-slide-up" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="bg-surface-container-lowest border border-surface-gray p-0 rounded overflow-hidden hover:shadow-lg transition-all hover:translate-y-[-4px] group">
                      <div className="h-40 bg-surface-container-low flex items-center justify-center p-8 overflow-hidden">
                        <span className="text-5xl group-hover:scale-110 transition-transform">{pub.image}</span>
                      </div>
                      <div className="p-6">
                        <span className="text-research-blue font-label-sm uppercase tracking-wider mb-2 block">{pub.category}</span>
                        <h4 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3 line-clamp-2 group-hover:text-research-blue transition-colors">{pub.title}</h4>
                        <div className="flex justify-between items-center text-label-sm text-outline">
                          <span>{pub.date}</span>
                          <button className="text-nigeria-green-vibrant flex items-center font-bold hover:text-research-blue transition-colors group-hover:translate-x-[2px]">
                            PDF <span className="material-symbols-outlined text-sm ml-1">download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="lg:col-span-4 border-l border-surface-gray lg:pl-8">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Events &amp; Seminars</h2>
              <div className="space-y-6">
                {events.map((event, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-nigeria-green-deep text-on-primary rounded group-hover:scale-110 transition-transform group-hover:shadow-md">
                      <span className="font-label-sm">{event.month}</span>
                      <span className="font-headline-md text-headline-md">{event.day}</span>
                    </div>
                    <div>
                      <h5 className="font-label-md text-nigeria-green-deep group-hover:text-nigeria-green-vibrant transition-colors">
                        {event.title}
                      </h5>
                      <p className="text-label-sm text-on-surface-variant">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/events"
                className="block mt-8 py-3 border border-outline text-on-surface-variant font-label-md rounded hover:bg-surface-container-low transition-all text-center"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Insights */}
        <section className="py-20 bg-surface-container-lowest">
          <div className="px-margin-desktop max-w-max-width mx-auto">
            <div className="mb-12">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-2">Recent Insights</h2>
              <p className="text-on-surface-variant">Brief, actionable intelligence for policymakers and stakeholders.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {insights.map((insight, idx) => (
                <article key={insight.id} className="flex flex-col h-full border-b border-surface-gray pb-8 animate-slide-up group" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="h-48 w-full mb-6 overflow-hidden rounded bg-gradient-to-br from-nigeria-green-deep to-research-blue flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform">{insight.image}</span>
                  </div>
                  <span className="text-nigeria-green-vibrant font-label-sm mb-2">{insight.category}</span>
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-4 hover:text-research-blue cursor-pointer transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-6 flex-grow">
                    Evidence-based insights into how policy decisions impact economic growth and social welfare across Nigeria&apos;s regions.
                  </p>
                  <div className="flex items-center gap-3 group-hover:translate-x-[2px] transition-transform">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-nigeria-green-pale transition-colors">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <span className="text-label-sm font-bold">{insight.author}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
