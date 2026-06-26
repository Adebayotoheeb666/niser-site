import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPublications } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Publications Archive | NISER",
  description:
    "Browse NISER's complete archive of research publications, working papers, and policy briefs.",
};

export default async function PublicationsArchivePage() {
  const publications = await getPublications({ limit: 30 });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Publications Archive
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Explore NISER&apos;s comprehensive collection of research
              publications, working papers, policy briefs, and policy memos
              spanning decades of research excellence.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="border-b border-surface-gray py-12">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <input
                type="text"
                placeholder="Search publications..."
                className="col-span-1 md:col-span-2 px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface"
              />
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface">
                <option>Publication Type</option>
                <option>Working Paper</option>
                <option>Policy Brief</option>
                <option>Research Report</option>
                <option>Policy Memo</option>
              </select>
              <select className="px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface">
                <option>Year</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {publications.length === 0 ? (
              <p className="text-body-md text-on-surface-variant py-16 text-center">
                No publications available yet. Visit our{" "}
                <a
                  href="/publications"
                  className="text-nigeria-green-vibrant underline"
                >
                  Publications page
                </a>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publications.map((pub) => {
                  const authors = pub.authors.map((a) => a.fullName).join(", ");
                  const type = pub.publicationType.replace(/_/g, " ");
                  const division = pub.researchDivision?.replace(/_/g, " ");

                  return (
                    <div
                      key={pub.id}
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <span className="inline-block px-3 py-1 bg-research-blue/10 text-research-blue rounded-full font-label-sm text-label-sm mb-4 capitalize">
                        {type}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2 line-clamp-2">
                        {pub.title}
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-4 line-clamp-2">
                        {pub.abstract}
                      </p>
                      <div className="flex justify-between items-center text-label-sm text-outline mb-2">
                        <span>{pub.publishedYear}</span>
                        {division && (
                          <span className="capitalize">{division}</span>
                        )}
                      </div>
                      {authors && (
                        <p className="text-label-sm text-on-surface-variant mb-4 line-clamp-1">
                          {authors}
                        </p>
                      )}
                      <div className="flex flex-col gap-2">
                        <a
                          href={"/publications/" + pub.slug}
                          className="w-full bg-nigeria-green-deep text-on-primary px-4 py-2 rounded font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-base">
                            open_in_new
                          </span>{" "}
                          View Publication
                        </a>
                        {pub.pdfFile && (
                          <a
                            href={pub.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full border border-nigeria-green-deep text-nigeria-green-deep px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">
                              download
                            </span>{" "}
                            Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
