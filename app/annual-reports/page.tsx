import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReportDownload from "@/components/ui/ReportDownload";
import { getAnnualReports } from "@/lib/cms/client";
import "./annual-reports.css";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Annual Reports | NISER",
  description:
    "Access NISER&apos;s annual reports documenting research activities, achievements, and institutional performance.",
};

export default async function AnnualReportsPage() {
  const allReports = await getAnnualReports();
  const published = allReports.filter(
    (report) => report.status === "publish" || report.status === "published",
  );
  const reports = [...published].sort((a, b) => b.year - a.year);
  const latestYear = reports[0]?.year;
  const archiveCount = reports.length;

  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="ar-hero">
          <div className="container ar-hero__inner">
            <span className="ar-hero__eyebrow">Institutional Record</span>
            <h1 className="ar-hero__title">Annual Reports</h1>
            <p className="ar-hero__lead">
              Comprehensive documentation of NISER&apos;s research activities,
              achievements, and institutional performance — the Institute&apos;s
              official record of progress, year by year.
            </p>
            <div className="ar-hero__stats">
              {[
                { value: latestYear ? String(latestYear) : "—", label: "Latest year on record" },
                { value: String(archiveCount), label: "Reports in the archive" },
                { value: "PDF", label: "Downloadable format" },
              ].map((stat) => (
                <div key={stat.label} className="ar-hero__stat">
                  <span className="ar-hero__stat-value">{stat.value}</span>
                  <span className="ar-hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Archive ──────────────────────────────────────────────────────── */}
        <section className="ar-section" aria-labelledby="archive-heading">
          <div className="container">
            <div className="home-section__head">
              <div>
                <span className="home-eyebrow">The Archive</span>
                <h2 id="archive-heading" className="home-section__title">
                  {latestYear ? `Reports from ${latestYear}` : "Annual reports"}
                </h2>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="ar-empty">
                <p className="home-eyebrow" aria-hidden="true">Archive</p>
                <p className="ar-empty__title">No annual reports available yet</p>
                <p className="ar-empty__desc">
                  The Institute&apos;s reports will appear here as they are digitised.
                </p>
              </div>
            ) : (
              <ul className="ar-list" role="list">
                {reports.map((report, index) => {
                  const hasDownload = Boolean(report.pdfFile);
                  return (
                    <li key={report.id}>
                      <article className={`ar-row${index === 0 ? " ar-row--latest" : ""}`}>
                        <div className="ar-row__cover" style={{ position: "relative" }}>
                          {report.coverImage ? (
                            <Image
                              src={report.coverImage}
                              alt={`${report.year} Annual Report cover`}
                              className="ar-row__cover-img"
                              fill
                              sizes="(max-width: 768px) 100vw, 200px"
                            />
                          ) : (
                            <div className="ar-row__cover-fallback" aria-hidden="true">
                              <span>{report.year}</span>
                              <small>NISER · Annual Report</small>
                            </div>
                          )}
                        </div>

                        <div className="ar-row__body">
                          {index === 0 ? (
                            <span className="ar-row__badge">Latest</span>
                          ) : null}
                          <h3 className="ar-row__title">
                            {report.title ?? `${report.year} Annual Report`}
                          </h3>
                          <p className="ar-row__year">
                            {`${report.year}`} &middot; Institutional Report
                          </p>
                          {report.highlights && (
                            <p className="ar-row__highlights">{report.highlights}</p>
                          )}
                        </div>

                        <div className="ar-row__action">
                          {hasDownload ? (
                            <Link
                              href={report.pdfFile as string}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn--primary btn--sm"
                            >
                              <DownloadIcon />
                              Download PDF
                            </Link>
                          ) : (
                            <ReportDownload
                              title={report.title ?? `${report.year} Annual Report`}
                              year={report.year}
                              highlights={report.highlights}
                              description={report.description}
                            />
                          )}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="ar-note" aria-labelledby="note-heading">
          <div className="container ar-note__inner">
            <span className="home-eyebrow home-eyebrow--light">Why it matters</span>
            <h2 id="note-heading" className="ar-note__title">
              A public record of national service
            </h2>
            <p className="ar-note__text">
              Every report captures the studies, seminars, and consultancies NISER
              delivered in that year — accountability and contribution, in one place.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function DownloadIcon() {
  return (
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
  );
}
