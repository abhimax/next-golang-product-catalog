import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Catalog management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Add a new product
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back to catalog
          </Link>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
