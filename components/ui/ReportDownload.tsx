"use client";

import { jsPDF } from "jspdf";

interface ReportDownloadProps {
  title: string;
  year: number;
  highlights?: string;
  description?: string;
}

const NISER_GREEN: [number, number, number] = [0, 107, 63];
const GRAY: [number, number, number] = [90, 100, 110];

function buildPdf({ title, year, highlights, description }: ReportDownloadProps) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 56;
  const contentWidth = pageWidth - margin * 2;
  const maxY = doc.internal.pageSize.getHeight() - margin;

  // ── Header band ─────────────────────────────────────────────────────────
  doc.setFillColor(...NISER_GREEN);
  doc.rect(0, 0, pageWidth, 84, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NISER", margin, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("National Institute of Social and Economic Research", margin, 60);

  // ── Title ───────────────────────────────────────────────────────────────
  let y = 130;
  doc.setTextColor(...NISER_GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const titleLines = doc.splitTextToSize(title || `${year} Annual Report`, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 26 + 10;

  doc.setDrawColor(...GRAY);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;

  // ── Metadata ────────────────────────────────────────────────────────────
  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Annual Report · ${year}`, margin, y);
  y += 18;
  doc.text("Institutional record of research activities and achievements.", margin, y);
  y += 34;

  // ── Body ────────────────────────────────────────────────────────────────
  doc.setTextColor(40, 48, 58);
  doc.setFontSize(12);

  const body = [description, highlights]
    .filter((block): block is string => Boolean(block))
    .join("\n\n");

  if (body) {
    const lines = doc.splitTextToSize(body, contentWidth);
    for (const line of lines) {
      if (y > maxY - 40) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      const lineHeight = doc.getFontSize() * 1.45;
      y += lineHeight;
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.text("Full report content will be added here by the Institute.", margin, y);
  }

  // ── Footer ──────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(
    "Downloaded from niser.gov.ng · For attribution, cite as: NISER. (" + year + "). NISER Annual Report.",
    margin,
    maxY + 8,
  );

  return doc;
}

export default function ReportDownload({ title, year, highlights, description }: ReportDownloadProps) {
  const handleDownload = () => {
    const doc = buildPdf({ title, year, highlights, description });
    doc.save(`niser-annual-report-${year}.pdf`);
  };

  return (
    <button type="button" onClick={handleDownload} className="btn btn--primary btn--sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
        <path d="M5 21h14" />
      </svg>
      Download PDF
    </button>
  );
}