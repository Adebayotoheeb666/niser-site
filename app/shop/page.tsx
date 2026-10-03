import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShopPageClient } from "@/components/cart/ShopPageClient";

export const metadata = {
  title: "Shop | NISER",
  description: "Purchase NISER publications, reports, and research materials online.",
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Online shop
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Buy NISER’s work online</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">Browse publications, reports, and research materials from NISER, and order the resources you need for learning and policy engagement.</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Reports</p>
                <p className="mt-1 text-sm text-emerald-100">Institutional outputs</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Briefs</p>
                <p className="mt-1 text-sm text-emerald-100">Policy-focused reads</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Orders</p>
                <p className="mt-1 text-sm text-emerald-100">Simple checkout</p>
              </div>
            </div>
          </div>
        </section>

        <ShopPageClient />
      </main>
      <Footer />
    </>
  );
}
