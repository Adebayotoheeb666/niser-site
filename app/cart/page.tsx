"use client";

import { FormEvent, useState } from "react";
import Header from "@/components/layout/Header";
import { useCart } from "@/components/cart/CartProvider";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitted(true);
    clearCart();
  };

  return (
    <>
      <Header />
      <main id="main-content" className="px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-surface-gray bg-surface p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-nigeria-green-deep sm:text-4xl">Your cart</h1>
            <p className="mt-3 max-w-2xl text-body-md text-slate-700">
              Review the items you want to purchase. Complete the order form below to place a purchase request for NISER publications.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-nigeria-green-pale bg-nigeria-green-pale/10 p-8 text-center text-nigeria-green-deep shadow-sm">
              <h2 className="text-2xl font-semibold">Order submitted</h2>
              <p className="mt-3 text-body-md text-slate-700">
                Thank you! Your purchase request has been recorded. We will contact you soon to confirm payment and delivery details.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
              <section className="rounded-3xl border border-surface-gray bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Cart items</h2>
                {items.length === 0 ? (
                  <div className="mt-6 rounded-3xl bg-surface p-8 text-center text-slate-600">
                    <p className="text-body-md">Your cart is empty.</p>
                    <p className="mt-4">
                      <a href="/shop" className="text-nigeria-green-deep font-semibold hover:underline">
                        Browse NISER publications to purchase
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-surface-gray bg-surface p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{item.name}</p>
                            <p className="mt-2 text-sm text-slate-600">{nairaFormatter.format(item.price)} each</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-slate-600">
                              Qty
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="ml-2 w-20 rounded-lg border border-surface-gray bg-white px-3 py-2 text-sm"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-surface-gray bg-white p-5">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <strong>{nairaFormatter.format(total)}</strong>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-surface-gray bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Purchase details</h2>
                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Full name</span>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                        required
                        className="mt-2 w-full rounded-xl border border-surface-gray bg-surface px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-nigeria-green-deep"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Email address</span>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                        required
                        className="mt-2 w-full rounded-xl border border-surface-gray bg-surface px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-nigeria-green-deep"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Phone number</span>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(event) => setFormState({ ...formState, phone: event.target.value })}
                        required
                        className="mt-2 w-full rounded-xl border border-surface-gray bg-surface px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-nigeria-green-deep"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-slate-700">Organisation</span>
                      <input
                        type="text"
                        value={formState.organisation}
                        onChange={(event) => setFormState({ ...formState, organisation: event.target.value })}
                        className="mt-2 w-full rounded-xl border border-surface-gray bg-surface px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-nigeria-green-deep"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Order instructions</span>
                    <textarea
                      value={formState.message}
                      onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                      rows={4}
                      className="mt-2 w-full rounded-xl border border-surface-gray bg-surface px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-nigeria-green-deep"
                      placeholder="Enter any delivery or invoice instructions"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={items.length === 0}
                    className="inline-flex w-full items-center justify-center rounded-full bg-nigeria-green-deep px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#055c32] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Place purchase request
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
