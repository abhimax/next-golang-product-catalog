"use client";

import { createProduct } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
};

const initialState: FormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image_url: "",
};

export function ProductForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: form.image_url,
      });

      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while creating the product.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Product name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="Mechanical Keyboard"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="Describe the product features and benefits."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-700"
          >
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="129.99"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-slate-700"
          >
            Stock quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="image_url"
          className="block text-sm font-medium text-slate-700"
        >
          Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={form.image_url}
          onChange={handleChange}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          placeholder="https://images.unsplash.com/..."
        />
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Saving product..." : "Add product"}
      </button>
    </form>
  );
}
