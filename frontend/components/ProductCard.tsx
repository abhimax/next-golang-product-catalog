import Link from "next/link";
import type { Product } from "@/types/product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="h-56 overflow-hidden bg-slate-100">
        <img
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
          }
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {product.name}
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            {product.stock} in stock
          </span>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
