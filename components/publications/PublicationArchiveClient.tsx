'use client';

import { useMemo, useState } from 'react';
import type { Publication } from '@/types/cms';
import { filterPublications } from '@/lib/publications/archive';

interface PublicationArchiveClientProps {
  publications: Publication[];
}

export default function PublicationArchiveClient({ publications }: PublicationArchiveClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          publications
            .map((pub) => pub.publicationType)
            .filter(Boolean)
            .map((type) => type.replace(/_/g, ' '))
        )
      ).sort(),
    [publications]
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        new Set(
          publications
            .map((pub) => String(pub.publishedYear))
            .filter(Boolean)
        )
      ).sort((a, b) => Number(b) - Number(a)),
    [publications]
  );

  const filteredPublications = useMemo(
    () => filterPublications(publications, searchTerm, selectedType, selectedYear),
    [publications, searchTerm, selectedType, selectedYear]
  );

  return (
    <>
      <section className="border-b border-slate-200 bg-white/70 py-12 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search publications..."
              className="col-span-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 md:col-span-2"
            />

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All years</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Archive collection
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Research and policy outputs from across our programmes
              </h2>
            </div>

            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
              {filteredPublications.length} result{filteredPublications.length === 1 ? '' : 's'}
            </div>
          </div>

          {filteredPublications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No publications match your search.</p>
              <p className="mt-2 text-slate-600">Try another keyword, publication type, or year.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPublications.map((pub) => {
                const authors = pub.authors
                  ?.map((author) => author.fullName)
                  .filter(Boolean)
                  .join(', ') || 'NISER Research Team';
                const type = (pub.publicationType ?? 'Research').replace(/_/g, ' ');
                const division = pub.researchDivision?.replace(/_/g, ' ');

                return (
                  <article
                    key={pub.id}
                    className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 capitalize">
                        {type}
                      </span>
                      {pub.publishedYear ? (
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                          {pub.publishedYear}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 md:text-2xl">{pub.title}</h3>

                    <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">
                      {pub.abstract || 'Research summary will be published here.'}
                    </p>

                    <div className="mt-5 border-t border-slate-200 pt-4">
                      {division ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700 capitalize">
                          {division}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm text-slate-500">{authors}</p>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <a
                        href={`/publications/${pub.slug}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f3d2f] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        View publication
                      </a>
                      {pub.pdfFile ? (
                        <a
                          href={pub.pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0f3d2f] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f3d2f] transition hover:bg-emerald-50"
                        >
                          Download PDF
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
