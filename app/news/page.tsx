import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'News & Announcements | NISER',
  description: 'Latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.',
};

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      date: 'October 24, 2024',
      category: 'Major Announcement',
      type: 'Institutional Update',
      title: 'NISER Unveils Strategic Plan 2025-2030',
      excerpt: 'The institute outlines its roadmap for becoming Africa\'s leading data-driven policy research center.',
      content: 'Director-General Antonia Taiye Simbine highlighted the institute\'s commitment to leveraging digital transformation for national economic growth during the press conference held at the Ibadan headquarters.',
      featured: true,
    },
    {
      id: 2,
      date: 'September 18, 2024',
      category: 'Media Mention',
      type: 'External Publication',
      title: 'NISER Experts Featured on NTA Network News',
      excerpt: 'Discussion centered on the implications of the new fiscal policy on small and medium enterprises (SMEs) across Southwestern Nigeria.',
    },
    {
      id: 3,
      date: 'September 12, 2024',
      category: 'Official Release',
      type: 'Institutional News',
      title: 'New Research Partnership with African Union',
      excerpt: 'Official memorandum of understanding signed to collaborate on trans-border economic data sharing and policy harmonization for West Africa.',
    },
    {
      id: 4,
      date: 'September 5, 2024',
      category: 'Internal Update',
      type: 'Infrastructure',
      title: 'Digital Library Upgrade Completion',
      excerpt: 'NISER\'s central digital archives have completed a major infrastructure migration, providing 10x faster access to historic policy documents.',
    },
    {
      id: 5,
      date: 'August 28, 2024',
      category: 'Press Release',
      type: 'Staff Update',
      title: 'Welcome New Research Fellows',
      excerpt: 'NISER onboards ten exceptional early-career researchers across multiple divisions, strengthening research capacity.',
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-32 pb-24">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Header Section */}
          <section className="mb-12 border-b border-surface-gray pb-8">
            <span className="text-nigeria-green-vibrant font-label-sm text-label-sm tracking-widest uppercase mb-2 block">Institutional Media Hub</span>
            <h1 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">News &amp; Announcements</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              The latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.
            </p>
          </section>

          {/* Sticky Navigation/Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-12 sticky top-20 bg-background/80 backdrop-blur-md py-4 z-40">
            <button className="bg-nigeria-green-deep text-white px-6 py-2 rounded-full font-label-md text-label-md shadow-lg shadow-nigeria-green-deep/10">All Updates</button>
            <button className="border border-outline-variant text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors">Press Releases</button>
            <button className="border border-outline-variant text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors">Media Mentions</button>
            <button className="border border-outline-variant text-on-surface-variant px-6 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container transition-colors">Announcements</button>
            <div className="ml-auto relative hidden md:block">
              <input className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-research-blue focus:outline-none w-64" placeholder="Filter announcements..." type="text"/>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">filter_list</span>
            </div>
          </div>

          {/* Chronological Feed Layout */}
          <div className="relative space-y-16">
            {/* Timeline decorative element */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-surface-gray -translate-x-1/2 hidden md:block"></div>

            {/* Featured News Item */}
            {newsItems[0] && (
              <div className="relative grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
                <div className="md:col-span-7 rounded-xl overflow-hidden shadow-xl shadow-primary/5 group">
                  <div className="relative h-96 w-full overflow-hidden bg-surface-container-low flex items-center justify-center">
                    <span className="text-8xl">🏛️</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-nigeria-green-deep/80 to-transparent flex flex-col justify-end p-8">
                    <span className="bg-accent-mint text-nigeria-green-deep font-label-sm text-label-sm px-3 py-1 rounded-full w-fit mb-4">Major Announcement</span>
                    <h2 className="font-headline-lg text-headline-lg text-white mb-2">{newsItems[0].title}</h2>
                    <p className="text-white/80 font-body-md text-body-md line-clamp-2">{newsItems[0].excerpt}</p>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="bg-surface-container-lowest p-8 border border-surface-gray rounded-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-nigeria-green-deep">
                        <span className="material-symbols-outlined">campaign</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{newsItems[0].date}</p>
                        <p className="font-label-md text-label-md text-nigeria-green-vibrant">{newsItems[0].type}</p>
                      </div>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{newsItems[0].title}</h3>
                    <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                      {newsItems[0].content}
                    </p>
                    <a className="text-research-blue font-label-md flex items-center gap-2 hover:gap-4 transition-all" href="#">
                      Read Full Press Release <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Feed Items */}
            <div className="space-y-12">
              {/* Month Marker */}
              <div className="flex justify-center relative z-10">
                <span className="bg-surface-gray text-on-surface-variant font-label-sm text-label-sm px-6 py-2 rounded-full border border-outline-variant">Recent Updates</span>
              </div>

              {/* Timeline Items */}
              {newsItems.slice(1).map((item, index) => (
                <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-gutter items-start group">
                  {/* Connector point for timeline */}
                  <div className="absolute left-1/2 top-12 w-4 h-4 rounded-full bg-white border-4 border-nigeria-green-vibrant -translate-x-1/2 z-20 hidden md:block"></div>
                  
                  {index % 2 === 0 ? (
                    <>
                      <div className="md:pr-12 md:text-right">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.date}</p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">{item.title}</h3>
                      </div>
                      <div className="md:pl-12">
                        <div className="bg-surface-container-lowest border border-surface-gray p-6 rounded-xl hover:shadow-lg transition-all border-l-4 border-l-accent-mint">
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">
                            {item.excerpt}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-cover bg-center border border-surface-gray bg-surface-container-low flex items-center justify-center">
                              <span className="text-xl">📰</span>
                            </div>
                            <div>
                              <p className="font-label-md text-label-md text-on-surface">{item.category}</p>
                              <p className="text-label-sm font-label-sm text-on-surface-variant">{item.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="md:order-2 md:pl-12">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.date}</p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">{item.title}</h3>
                      </div>
                      <div className="md:order-1 md:text-right md:pr-12">
                        <div className="bg-surface-container-lowest border border-surface-gray p-6 rounded-xl hover:shadow-lg transition-all border-r-4 border-r-research-blue">
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">
                            {item.excerpt}
                          </p>
                          <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                              <p className="font-label-md text-label-md text-on-surface">{item.category}</p>
                              <p className="text-label-sm font-label-sm text-on-surface-variant">{item.type}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-research-blue/10 flex items-center justify-center text-research-blue">
                              <span className="material-symbols-outlined">newspaper</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="bg-nigeria-green-deep text-on-primary px-8 py-3 rounded-lg font-label-md hover:opacity-90 transition-all">
              Load More News
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
