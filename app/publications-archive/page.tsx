import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PublicationArchiveClient from "@/components/publications/PublicationArchiveClient";
import { getPublications } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Publications Archive | NISER",
  description:
    "Browse NISER's complete archive of research publications, working papers, and policy briefs.",
};

export default async function PublicationsArchivePage() {
  const publications = await getPublications({ limit: 30 });

  const publicationTypes = new Set(
    publications
      .map((pub) => (pub.publicationType ?? "Research").replace(/_/g, " "))
      .filter(Boolean)
  );

  const years = new Set(
    publications
      .map((pub) => pub.publishedYear)
      .filter((year): year is number => typeof year === "number")
  );

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Research archive
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Publications that chart NISER&apos;s research legacy.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Explore the institute&apos;s collection of working papers, policy briefs, research reports, and archived outputs that reflect years of public-interest scholarship.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{publications.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Publications archived</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{publicationTypes.size}</p>
                <p className="mt-1 text-sm text-emerald-100">Research formats</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{years.size}</p>
                <p className="mt-1 text-sm text-emerald-100">Years represented</p>
              </div>
            </div>
          </div>
        </section>

        <PublicationArchiveClient publications={publications} />
      </main>
      <Footer />
    </>
  );
}
