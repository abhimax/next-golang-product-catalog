"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getProductById } from "@/lib/api";
import type { Product } from "@/types/product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

function ProductDetailContent() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(Number(params.id));
        setProduct(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load product details.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl animate-pulse rounded-3xl border border-slate-200 bg-white p-8">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="h-[420px] rounded-2xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-6 w-24 rounded bg-slate-200" />
              <div className="h-10 w-2/3 rounded bg-slate-200" />
              <div className="h-8 w-1/3 rounded bg-slate-200" />
              <div className="h-24 w-full rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
          {error || "Product not found."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          ← Back to catalog
        </Link>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="h-[420px] bg-slate-100">
              <img
                src={
                  product.image_url ||
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                }
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  ID #{product.id}
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-6 text-3xl font-bold text-slate-900">
                {formatPrice(product.price)}
              </div>

              <p className="mt-6 text-base leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Availability
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {product.stock} units
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Workspace
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <ProductDetailContent />
    </Suspense>
  );
}
