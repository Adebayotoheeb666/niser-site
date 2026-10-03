'use client';

import { useState } from 'react';

interface CitationCopyProps {
  authors: { fullName: string }[];
  title: string;
  year?: number;
  doi?: string;
  slug?: string;
}

type Format = 'APA' | 'BibTeX' | 'Chicago';

function buildAPA(authors: { fullName: string }[], title: string, year?: number, doi?: string): string {
  const authorStr = authors.length > 0
    ? authors.map((a) => {
        const parts = a.fullName.trim().split(/\s+/);
        const last = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map((n) => `${n[0]}.`).join(' ');
        return `${last}, ${initials}`.trim().replace(/,\s*$/, '');
      }).join(', & ')
    : 'NISER';
  const yearPart = year ? `(${year})` : '(n.d.)';
  const doiPart = doi ? ` https://doi.org/${doi}` : '';
  return `${authorStr} ${yearPart}. ${title}. National Institute of Social and Economic Research (NISER).${doiPart}`;
}

function buildBibTeX(authors: { fullName: string }[], title: string, year?: number, doi?: string, slug?: string): string {
  const key = slug?.replace(/[^a-z0-9]/gi, '') ?? `niser${year ?? 'nd'}`;
  const authorStr = authors.map((a) => a.fullName).join(' and ') || 'NISER';
  const lines = [
    `@techreport{${key},`,
    `  author    = {${authorStr}},`,
    `  title     = {${title}},`,
    `  institution = {National Institute of Social and Economic Research (NISER)},`,
    year ? `  year      = {${year}},` : '  year      = {n.d.},',
    doi ? `  doi       = {${doi}},` : null,
    slug ? `  url       = {https://niser.gov.ng/publications/${slug}},` : null,
    `}`,
  ].filter(Boolean).join('\n');
  return lines;
}

function buildChicago(authors: { fullName: string }[], title: string, year?: number, doi?: string): string {
  const authorStr = authors.length > 0
    ? authors.map((a, i) => {
        if (i === 0) {
          const parts = a.fullName.trim().split(/\s+/);
          const last = parts[parts.length - 1];
          const first = parts.slice(0, -1).join(' ');
          return `${last}, ${first}`;
        }
        return a.fullName;
      }).join(', ')
    : 'NISER';
  const yearPart = year ?? 'n.d.';
  const doiPart = doi ? ` https://doi.org/${doi}.` : '';
  return `${authorStr}. ${yearPart}. "${title}." Ibadan: National Institute of Social and Economic Research (NISER).${doiPart}`;
}

export default function CitationCopy({ authors, title, year, doi, slug }: CitationCopyProps) {
  const [format, setFormat] = useState<Format>('APA');
  const [copied, setCopied] = useState(false);

  const citation =
    format === 'APA'
      ? buildAPA(authors, title, year, doi)
      : format === 'BibTeX'
      ? buildBibTeX(authors, title, year, doi, slug)
      : buildChicago(authors, title, year, doi);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = citation;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="citation-copy" aria-label="Citation export">
      {/* Format selector */}
      <div className="citation-copy__tabs" role="tablist" aria-label="Citation format">
        {(['APA', 'BibTeX', 'Chicago'] as Format[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={format === f}
            className={`citation-copy__tab${format === f ? ' citation-copy__tab--active' : ''}`}
            onClick={() => setFormat(f)}
            type="button"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Citation text */}
      <pre className="citation-copy__text" aria-live="polite">
        {citation}
      </pre>

      {/* Copy button */}
      <button
        type="button"
        className={`btn btn--sm ${copied ? 'btn--success' : 'btn--outline'} citation-copy__btn`}
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy citation to clipboard'}
      >
        {copied ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Copy Citation
          </>
        )}
      </button>
    </div>
  );
}
