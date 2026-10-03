import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getImageGalleryItems } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery - Images | NISER",
  description: "NISER photo gallery and institutional imagery.",
};

export default async function ImagesPage() {
  const imageItems = await getImageGalleryItems();

  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Photo archive
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Images from NISER’s research and community life.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                Explore institutional photography, research moments, campus life, and public engagement captured across programmes and events.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{imageItems.length}</p>
                <p className="mt-1 text-sm text-emerald-100">Image entries</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Research</p>
                <p className="mt-1 text-sm text-emerald-100">Campus & projects</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Stories</p>
                <p className="mt-1 text-sm text-emerald-100">Moments in context</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Image gallery
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Browse the visual record of NISER
              </h2>
            </div>

            {imageItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No image entries are available right now.</p>
                <p className="mt-2 text-slate-600">Please check back soon for fresh gallery updates.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {imageItems.map((item) => (
                  <article
                    key={item.slug}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,118,110,0.12)]"
                  >
                    <Link href={`/gallery/images/${item.slug}`} className="block h-full">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-cover transition duration-300 group-hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                        <span className="mt-5 inline-flex items-center text-sm font-semibold text-emerald-700">
                          View image details →
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
