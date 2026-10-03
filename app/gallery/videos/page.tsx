import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getVideoGalleryItems } from "@/lib/gallery";

function getVideoThumbnailUrl(videoUrl: string | undefined, fallbackImageUrl: string): string {
  if (!videoUrl) return fallbackImageUrl;

  try {
    const parsedUrl = new URL(videoUrl);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : fallbackImageUrl;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : fallbackImageUrl;
    }

    if (host === "youtube-nocookie.com") {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : fallbackImageUrl;
    }
  } catch {
    return fallbackImageUrl;
  }

  return fallbackImageUrl;
}

export const metadata: Metadata = {
  title: "Gallery - Videos | NISER",
  description: "NISER video content and multimedia resources.",
};

export default async function VideosPage() {
  const videoItems = await getVideoGalleryItems();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Video archive
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Watch NISER seminars, talks, and research stories.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Access institutional videos, public lectures, and research highlights that bring NISER’s work to life.
              </p>
              <a
                href="/api/podcast/feed.xml"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                🎙️ Subscribe to the seminar podcast (RSS)
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{videoItems.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Video entries</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Seminars</p>
                <p className="mt-1 text-sm text-emerald-100">Talks & discussions</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Research</p>
                <p className="mt-1 text-sm text-emerald-100">Stories in motion</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Video gallery
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Explore the latest multimedia content
              </h2>
            </div>

            {videoItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No video entries are available right now.</p>
                <p className="mt-2 text-slate-600">Check back soon for new research talks and institutional media.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {videoItems.map((item) => (
                  <article
                    key={item.slug}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                  >
                    <Link href={`/gallery/videos/${item.slug}`} className="block h-full">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={getVideoThumbnailUrl(item.videoUrl, item.imageUrl)}
                          alt={item.title}
                          className="object-cover transition duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/25">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/20 backdrop-blur-sm">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
                              <path d="M8 5v14l11-7L8 5z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                        <span className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">
                          View video details →
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
