import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  getVideoGalleryItemBySlug,
  getVideoGalleryItems,
} from "@/lib/gallery";

interface PageProps {
  params: { slug: string };
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateStaticParams() {
  const items = await getVideoGalleryItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getVideoGalleryItemBySlug(params.slug);
  if (!item) return { title: "Video not found" };

  return {
    title: item.title,
    description: item.description,
  };
}

export default async function VideoGalleryItemPage({ params }: PageProps) {
  const item = await getVideoGalleryItemBySlug(params.slug);
  if (!item) notFound();

  const youtubeEmbedUrl = item.videoUrl ? getYoutubeEmbedUrl(item.videoUrl) : null;

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <nav aria-label="Breadcrumb" className="text-sm text-emerald-100">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/gallery/videos" className="hover:text-white">Videos</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-white">{item.title}</li>
              </ol>
            </nav>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">{item.title}</h1>
            {item.description && (
              <p className="mt-4 max-w-2xl text-base text-emerald-50 md:text-lg">{item.description}</p>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-5xl">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              {item.videoUrl ? (
                youtubeEmbedUrl ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <video
                    controls
                    src={item.videoUrl}
                    poster={item.imageUrl}
                    className="h-[420px] w-full object-cover md:h-[560px]"
                  />
                )
              ) : (
                <div className="relative h-[420px] md:h-[560px]">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="100vw" />
                </div>
              )}

              <div className="p-6 md:p-8">
                <p className="text-base leading-7 text-slate-600">{item.details}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/gallery/videos"
                    className="inline-flex items-center justify-center rounded-full bg-[#0d3b2a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123f2f]"
                  >
                    Back to video gallery
                  </Link>
                  <Link
                    href="/gallery/images"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Browse images
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
