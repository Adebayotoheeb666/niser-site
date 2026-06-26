"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const products = [
  {
    id: "annual-report-2025",
    name: "NISER Annual Report 2025",
    description: "Full research findings and policy recommendations from the latest institutional report.",
    price: 12000,
  },
  {
    id: "policy-brief-collection",
    name: "Policy Brief Collection",
    description: "A curated set of NISER policy briefs on economic and social development.",
    price: 8500,
  },
  {
    id: "research-compendium",
    name: "Research Compendium",
    description: "A downloadable compendium of NISER research outputs and key datasets.",
    price: 15000,
  },
];

export const metadata = {
  title: "Shop | NISER",
  description: "Purchase NISER publications, reports, and research materials online.",
};

export default function ShopPage() {
  const { addItem, count } = useCart();

  return (
    <>
      <Header />
      <main id="main-content" className="px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-surface-gray bg-surface p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-nigeria-green-deep">
                  Online purchases
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-nigeria-green-deep sm:text-4xl">
                  Buy NISER’s work online
                </h1>
                <p className="mt-4 max-w-2xl text-body-md text-slate-700">
                  Browse current research outputs, reports, and policy briefs. Add items to your cart and complete your purchase with a simple online order form.
                </p>
              </div>
              <div className="rounded-3xl bg-white border border-surface-gray p-4 text-center shadow-sm">
                <p className="text-sm text-slate-500">Items in cart</p>
                <p className="mt-2 text-3xl font-semibold text-nigeria-green-deep">{count}</p>
                <Link href="/cart" className="mt-4 inline-flex items-center justify-center rounded-full border border-nigeria-green-deep bg-nigeria-green-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#055c32]">
                  View cart & checkout
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-3xl border border-surface-gray bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-nigeria-green-pale px-3 py-1 text-sm font-semibold text-nigeria-green-deep">
                    {formatter.format(product.price)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-3 text-body-md text-slate-600">{product.description}</p>
                <button
                  type="button"
                  onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-nigeria-green-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#055c32]"
                >
                  Add to cart
                </button>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
