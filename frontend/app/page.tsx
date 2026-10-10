"use client";

import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load products.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>
            <h1 className="text-2xl font-bold">Product Catalog</h1>
          </div>

          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Add product
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Products
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Curated essentials for modern workspaces
            </h2>
          </div>

          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
            {products.length} items available
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 bg-slate-200" />
                <div className="space-y-4 p-5">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="h-3 w-5/6 rounded bg-slate-200" />
                  <div className="h-8 w-1/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
