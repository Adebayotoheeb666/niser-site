import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ResearcherCard from '@/components/ui/ResearcherCard';
import { getResearchers } from '@/lib/cms/client';
import type { ResearchDivision } from '@/types/cms';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Researchers',
  description:
    'Meet the researchers and scholars at NISER. Browse profiles by research division, expertise, and publications.',
};

const divisionTabs: { value: ResearchDivision | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'macroeconomics', label: 'Macroeconomics' },
  { value: 'poverty_social', label: 'Poverty & Social' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'governance', label: 'Governance' },
  { value: 'industry', label: 'Industry' },
];

function formatDivisionLabel(value?: string) {
  const match = divisionTabs.find((tab) => tab.value === value);
  return match?.label ?? 'Researchers';
}

interface PeoplePageProps {
  searchParams: { division?: string };
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const divisionFilter = (searchParams.division as ResearchDivision) || undefined;
  const researchers = await getResearchers({ active: true, division: divisionFilter });

  const currentFilterLabel = formatDivisionLabel(divisionFilter || '');

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,107,63,0.12),_transparent_30%)]" />
          <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid items-end gap-8 lg:grid-cols-[1.7fr_0.9fr]">
              <div>
                <span className="inline-flex items-center rounded-full border border-[#DCEFE4] bg-[#F2FBF6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                  NISER scholars
                </span>
                <h1 className="mt-5 max-w-3xl font-['Playfair_Display',_Georgia,_serif] text-4xl font-bold tracking-tight text-[#0b1b13] sm:text-5xl lg:text-6xl">
                  Researchers driving evidence for national development.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  NISER&apos;s multidisciplinary team of economists, sociologists, agronomists,
                  policy analysts, and institutional specialists works across research, teaching,
                  consultancy, and public engagement.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="#directory"
                    className="inline-flex items-center justify-center rounded-full bg-[#0A5F3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084d34]"
                  >
                    Browse researchers
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                  >
                    Learn about NISER
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Research capacity
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-['Playfair_Display',_Georgia,_serif] text-5xl font-bold text-white">
                    {researchers.length}
                  </span>
                  <span className="pb-2 text-sm text-slate-300">active profiles</span>
                </div>
                <div className="mt-6 space-y-4 text-sm text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span>Research divisions</span>
                    <span className="font-semibold text-[#D8F5E3]">5</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <span>Areas of expertise</span>
                    <span className="font-semibold text-[#D8F5E3]">Multi-disciplinary</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current view</span>
                    <span className="font-semibold text-[#D8F5E3]">{currentFilterLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <nav className="flex flex-wrap gap-2" aria-label="Filter by division">
              {divisionTabs.map((tab) => {
                const isActive = (searchParams.division ?? '') === tab.value;
                const href = tab.value ? `/people?division=${tab.value}` : '/people';

                return (
                  <Link
                    key={tab.value || 'all'}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#0A5F3D] text-white shadow-sm'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <section id="directory" className="container mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A5F3D]">
                Directory
              </p>
              <h2 className="mt-2 font-['Playfair_Display',_Georgia,_serif] text-3xl font-bold text-slate-900 sm:text-4xl">
                {divisionFilter ? `${currentFilterLabel} researchers` : 'All researchers'}
              </h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
              {researchers.length} profile{researchers.length === 1 ? '' : 's'}
            </span>
          </div>

          {researchers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {researchers.map((researcher) => (
                <ResearcherCard key={researcher.id} researcher={researcher} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
              <p className="text-lg font-medium text-slate-800">No researchers found in this division.</p>
              <Link
                href="/people"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
              >
                View all researchers
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

