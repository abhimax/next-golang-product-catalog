"use client";

import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";
import { getProductById } from "@/lib/api";
import type { Product } from "@/types/product";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function EditProductContent() {
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
            : "Unable to load product for editing.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Catalog management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Edit product
            </h1>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to product
          </Link>
        </div>

        <ProductForm
          mode="edit"
          productId={product.id}
          initialValues={{
            name: product.name,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            image_url: product.image_url,
          }}
        />
      </div>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <EditProductContent />
    </Suspense>
  );
}
