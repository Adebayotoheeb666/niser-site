import Link from 'next/link';
import Image from 'next/image';
import type { Researcher } from '@/types/cms';

const divisionLabels: Record<string, string> = {
  macroeconomics: 'Macroeconomics',
  poverty_social: 'Poverty & Social Dev.',
  agriculture: 'Agriculture',
  governance: 'Governance',
  industry: 'Industry',
};

interface ResearcherCardProps {
  researcher: Researcher;
}

export default function ResearcherCard({ researcher }: ResearcherCardProps) {
  const initials = researcher.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const divisionLabel =
    (divisionLabels[researcher.division] ?? researcher.division) || 'Unspecified Division';

  return (
    <article className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#BFE6CF] hover:shadow-xl">
      <div className="border-b border-slate-200 bg-[#F8FBF9] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#E9F7EE] text-sm font-bold text-[#0A5F3D]">
              {researcher.photo ? (
                <Image
                  src={researcher.photo}
                  alt={`Photo of ${researcher.fullName}`}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || 'N'
              )}
            </div>
            <div>
              {researcher.titlePrefix && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {researcher.titlePrefix}
                </p>
              )}
              <Link href={`/people/${researcher.slug}`} className="block">
                <h3 className="font-['Playfair_Display',_Georgia,_serif] text-xl font-bold text-slate-900 transition group-hover:text-[#0A5F3D]">
                  {researcher.fullName}
                </h3>
              </Link>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            {divisionLabel}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-700">{researcher.position}</p>

        {researcher.researchInterests && researcher.researchInterests.length > 0 && (
          <ul className="flex flex-wrap gap-2" role="list" aria-label="Research interests">
            {researcher.researchInterests.slice(0, 3).map((interest) => (
              <li key={interest}>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {interest}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/people/${researcher.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-[#0A5F3D] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#084d34]"
          >
            View profile
          </Link>

          {researcher.orcid && (
            <a
              href={`https://orcid.org/${researcher.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
              aria-label={`${researcher.fullName} on ORCID`}
            >
              ORCID ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

