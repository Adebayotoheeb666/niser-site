import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'News & Announcements | NISER',
  description: 'Latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.',
};

interface NewsItem {
  id: number;
  date: string;
  category: 'Major Announcement' | 'Media Mention' | 'Official Release' | 'Internal Update' | 'Press Release';
  type: 'Institutional Update' | 'External Publication' | 'Institutional News' | 'Infrastructure' | 'Staff Update';
  title: string;
  excerpt: string;
  content?: string;
  featured?: boolean;
  icon?: string;
}

export default function NewsPage() {
  // Mock news items - can be replaced with CMS fetch
  const newsItems: NewsItem[] = [
    {
      id: 1,
      date: 'October 24, 2024',
      category: 'Major Announcement',
      type: 'Institutional Update',
      title: 'NISER Unveils Strategic Plan 2025-2030',
      excerpt: 'The institute outlines its roadmap for becoming Africa\'s leading data-driven policy research center.',
      content:
        'Director-General Antonia Taiye Simbine highlighted the institute\'s commitment to leveraging digital transformation for national economic growth during the press conference held at the Ibadan headquarters. The strategic plan encompasses five core pillars: research excellence, digital sovereignty, capacity building, continental integration, and institutional sustainability.',
      featured: true,
      icon: '🏛️',
    },
    {
      id: 2,
      date: 'September 18, 2024',
      category: 'Media Mention',
      type: 'External Publication',
      title: 'NISER Experts Featured on NTA Network News',
      excerpt:
        'Discussion centered on the implications of the new fiscal policy on small and medium enterprises (SMEs) across Southwestern Nigeria.',
      icon: '📺',
    },
    {
      id: 3,
      date: 'September 12, 2024',
      category: 'Official Release',
      type: 'Institutional News',
      title: 'New Research Partnership with African Union',
      excerpt:
        'Official memorandum of understanding signed to collaborate on trans-border economic data sharing and policy harmonization for West Africa.',
      icon: '🤝',
    },
    {
      id: 4,
      date: 'September 5, 2024',
      category: 'Internal Update',
      type: 'Infrastructure',
      title: 'Digital Library Upgrade Completion',
      excerpt:
        'NISER\'s central digital archives have completed a major infrastructure migration, providing 10x faster access to historic policy documents.',
      icon: '💾',
    },
    {
      id: 5,
      date: 'August 28, 2024',
      category: 'Press Release',
      type: 'Staff Update',
      title: 'Welcome New Research Fellows',
      excerpt:
        'NISER onboards ten exceptional early-career researchers across multiple divisions, strengthening research capacity.',
      icon: '👥',
    },
    {
      id: 6,
      date: 'August 15, 2024',
      category: 'Major Announcement',
      type: 'Institutional Update',
      title: 'Open Call for Research Proposals 2025',
      excerpt:
        'NISER invites research proposals from local and international institutions for collaborative policy research projects.',
      icon: '📝',
    },
    {
      id: 7,
      date: 'July 30, 2024',
      category: 'Media Mention',
      type: 'External Publication',
      title: 'NISER Data Cited in World Bank Policy Report',
      excerpt:
        'Latest NISER analysis on informal economy dynamics featured prominently in global development policy discussions.',
      icon: '🌍',
    },
    {
      id: 8,
      date: 'July 12, 2024',
      category: 'Official Release',
      type: 'Institutional News',
      title: 'Annual Research Symposium Scheduled for October',
      excerpt:
        'NISER to host its annual research symposium bringing together policy makers, academics, and development partners.',
      icon: '🎓',
    },
  ];

  const featuredItem = newsItems.find((item) => item.featured);
  const otherItems = newsItems.filter((item) => !item.featured);

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Major Announcement': { bg: 'bg-accent-mint', text: 'text-nigeria-green-deep', border: 'border-l-accent-mint' },
    'Media Mention': { bg: 'bg-research-blue/10', text: 'text-research-blue', border: 'border-l-research-blue' },
    'Official Release': { bg: 'bg-nigeria-green-vibrant/10', text: 'text-nigeria-green-vibrant', border: 'border-l-nigeria-green-vibrant' },
    'Internal Update': { bg: 'bg-surface-container', text: 'text-on-surface', border: 'border-l-outline-variant' },
    'Press Release': { bg: 'bg-secondary-container/10', text: 'text-secondary', border: 'border-l-secondary' },
  };

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-32 pb-24 bg-background">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Header Section */}
          <section className="mb-12 border-b border-surface-gray pb-8">
            <span className="text-nigeria-green-vibrant font-label-sm text-label-sm tracking-widest uppercase mb-2 block">
              Institutional Media Hub
            </span>
            <h1 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">News &amp; Announcements</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              The latest institutional updates, press releases, and media mentions from the Nigerian Institute of Social and Economic Research.
            </p>
          </section>

          {/* Featured News Item */}
          {featuredItem && (
            <div className="mb-20 relative grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <div className="md:col-span-7 rounded-xl overflow-hidden shadow-xl shadow-primary/5 group">
                <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-nigeria-green-deep to-research-blue flex items-center justify-center">
                  <span className="text-8xl">{featuredItem.icon || '📰'}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-nigeria-green-deep/80 to-transparent flex flex-col justify-end p-8">
                  <span className="bg-accent-mint text-nigeria-green-deep font-label-sm text-label-sm px-3 py-1 rounded-full w-fit mb-4">
                    {featuredItem.category}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-white mb-2">{featuredItem.title}</h2>
                  <p className="text-white/80 font-body-md text-body-md line-clamp-2">{featuredItem.excerpt}</p>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-surface-container-lowest p-8 border border-surface-gray rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-nigeria-green-deep">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{featuredItem.date}</p>
                      <p className="font-label-md text-label-md text-nigeria-green-vibrant">{featuredItem.type}</p>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{featuredItem.title}</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                    {featuredItem.content || featuredItem.excerpt}
                  </p>
                  <a
                    className="text-research-blue font-label-md flex items-center gap-2 hover:gap-4 transition-all cursor-pointer"
                    href="#"
                  >
                    Read Full Press Release <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Feed */}
          <div className="relative space-y-16">
            {/* Timeline decorative element */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1px] bg-surface-gray -translate-x-1/2 hidden md:block" />

            {/* Month Marker */}
            <div className="flex justify-center relative z-10">
              <span className="bg-surface-gray text-on-surface-variant font-label-sm text-label-sm px-6 py-2 rounded-full border border-outline-variant">
                Recent Updates
              </span>
            </div>

            {/* Timeline Items */}
            {otherItems.map((item, index) => {
              const colors = categoryColors[item.category] || categoryColors['Internal Update'];
              const isEven = index % 2 === 0;

              return (
                <div key={item.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-gutter items-start group">
                  {/* Timeline connector */}
                  <div className="absolute left-1/2 top-12 w-4 h-4 rounded-full bg-white border-4 border-nigeria-green-vibrant -translate-x-1/2 z-20 hidden md:block" />

                  {isEven ? (
                    <>
                      {/* Left side */}
                      <div className="md:pr-12 md:text-right">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.date}</p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      {/* Right side */}
                      <div className="md:pl-12">
                        <div
                          className={`p-6 rounded-xl hover:shadow-lg transition-all border-l-4 ${colors.border} bg-surface-container-lowest border border-surface-gray`}
                        >
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">{item.excerpt}</p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-surface-container-low flex items-center justify-center text-2xl">
                              {item.icon || '📄'}
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
                      {/* Left side (hidden on this alternate layout) */}
                      <div className="md:order-2 md:pl-12">
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">{item.date}</p>
                        <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-research-blue transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      {/* Right side */}
                      <div className="md:order-1 md:text-right md:pr-12">
                        <div
                          className={`p-6 rounded-xl hover:shadow-lg transition-all border-r-4 ${colors.border} bg-surface-container-lowest border border-surface-gray`}
                        >
                          <p className="text-on-surface-variant font-body-md text-body-md mb-4">{item.excerpt}</p>
                          <div className="flex items-center gap-4 justify-end">
                            <div className="text-right">
                              <p className="font-label-md text-label-md text-on-surface">{item.category}</p>
                              <p className="text-label-sm font-label-sm text-on-surface-variant">{item.type}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-research-blue/10 flex items-center justify-center text-xl">
                              {item.icon || '📰'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="mt-16 text-center">
            <button className="bg-nigeria-green-deep text-on-primary px-10 py-3 rounded-lg font-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 mx-auto">
              <span className="material-symbols-outlined">expand_more</span>
              Load More News
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
