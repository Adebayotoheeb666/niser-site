"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PublicationCard from '@/components/ui/PublicationCard';
import type { Publication } from '@/types/cms';

interface ApiResponse {
  items: Publication[];
  total: number;
  page: number;
  totalPages: number;
}

export default function PublicationsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get('q') ?? '';
  const initialType = searchParams.get('type') ?? '';
  const initialDivision = searchParams.get('division') ?? '';
  const initialYear = searchParams.get('year') ?? '';
  const initialPage = Number(searchParams.get('page') ?? '1');

  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType);
  const [division, setDivision] = useState(initialDivision);
  const [year, setYear] = useState(initialYear);
  const [page, setPage] = useState<number>(initialPage);

  const [items, setItems] = useState<Publication[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<number | null>(null);

  const limit = 9;

  function updateUrl(params: Record<string, string | number | undefined>) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v) !== '') qs.set(k, String(v));
    }
    const href = `/publications?${qs.toString()}`;
    router.push(href);
  }

  async function fetchPage(currentQ: string, currentType: string, currentDivision: string, currentYear: string, currentPage: number) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentQ) params.set('q', currentQ);
      if (currentType) params.set('type', currentType);
      if (currentDivision) params.set('division', currentDivision);
      if (currentYear) params.set('year', currentYear);
      params.set('page', String(currentPage));
      params.set('limit', String(limit));

      const res = await fetch(`/api/publications?${params.toString()}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data: ApiResponse = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setPage(1);
      updateUrl({ q, type, division, year, page: 1 });
      fetchPage(q, type, division, year, 1);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Instant filter changes (non-debounced)
  useEffect(() => {
    setPage(1);
    updateUrl({ q, type, division, year, page: 1 });
    fetchPage(q, type, division, year, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, division, year]);

  // Page change
  useEffect(() => {
    updateUrl({ q, type, division, year, page });
    fetchPage(q, type, division, year, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Initialize on mount
  useEffect(() => {
    fetchPage(q, type, division, year, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="mt-6 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          aria-label="Search publications"
          placeholder="Search publications..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
        />

        <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="working_paper">Working papers</option>
          <option value="policy_brief">Policy briefs</option>
          <option value="annual_report">Annual reports</option>
        </select>

        <select value={division} onChange={(e) => setDivision(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All divisions</option>
          <option value="macroeconomics">Macroeconomics</option>
          <option value="poverty_social">Poverty & Social</option>
          <option value="agriculture">Agriculture</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All years</option>
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      <div className="mb-3 text-sm text-slate-600">{loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''}`}</div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <PublicationCard key={p.id} publication={p} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((s) => Math.max(1, s - 1))}
            disabled={page <= 1}
            className={`rounded-md px-4 py-2 text-sm ${page <= 1 ? 'opacity-40' : ''}`}
          >
            Previous
          </button>

          <div className="text-sm">Page {page} of {totalPages}</div>

          <button
            onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
            disabled={page >= totalPages}
            className={`rounded-md px-4 py-2 text-sm ${page >= totalPages ? 'opacity-40' : 'bg-[#0A5F3D] text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
