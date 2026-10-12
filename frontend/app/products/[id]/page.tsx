"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { deleteProduct, getProductById } from "@/lib/api";
import type { Product } from "@/types/product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

function ProductDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(Number(params.id));
        setProduct(data);
        setQuantity(1);
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

  const handleQuantityChange = (delta: number) => {
    setQuantity((current) => {
      const maxQuantity =
        product?.stock && product.stock > 0 ? product.stock : 1;
      return Math.min(Math.max(current + delta, 1), maxQuantity);
    });
  };

  const handleBuyNow = () => {
    if (!product) {
      return;
    }

    if (product.stock <= 0) {
      setPurchaseMessage("This item is out of stock right now.");
      return;
    }

    setPurchaseMessage(
      `Added ${quantity} ${product.name}${quantity > 1 ? "s" : ""} to your order.`,
    );
  };

  const handleDelete = async () => {
    if (!product) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${product.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProduct(product.id);
      router.push("/");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete the product.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

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

  const maxQuantity = product.stock > 0 ? product.stock : 1;

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

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={product.stock <= 0 || quantity <= 1}
                    className="h-10 w-10 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-12 text-center text-base font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={product.stock <= 0 || quantity >= maxQuantity}
                    className="h-10 w-10 rounded-full text-lg font-semibold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Buy Now
                </button>
              </div>

              {purchaseMessage ? (
                <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {purchaseMessage}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Edit product
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>

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

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  More details
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Free delivery on orders over $100</li>
                  <li>• 30-day return window</li>
                  <li>• Designed for modern, collaborative workspaces</li>
                </ul>
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
