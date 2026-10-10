import type { Product } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function createProduct(product: Omit<Product, "id">) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create product");
  }

  return response.json();
}
