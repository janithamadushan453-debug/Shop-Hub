import { ref } from "vue";
import type { Product, ProductsResponse } from "../types";

export function useProducts() {
  const products = ref<Product[]>([]);
  const categories = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async (limit: number = 100) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductsResponse = await response.json();
      products.value = data.products;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An error occurred";
      console.error("Error fetching products:", e);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data: string[] = await response.json();
      categories.value = data;
    } catch (e) {
      console.error("Error fetching categories:", e);
    }
  };

  const fetchProductById = async (id: number): Promise<Product | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data: Product = await response.json();
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "An error occurred";
      console.error("Error fetching product:", e);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${query}`,
      );
      if (!response.ok) {
        throw new Error("Failed to search products");
      }

      const data: ProductsResponse = await response.json();
      return data.products;
    } catch (e) {
      console.error("Error searching products:", e);
      return [];
    }
  };

  const fetchProductsByCategory = async (
    category: string,
  ): Promise<Product[]> => {
    try {
      const response = await fetch(
        `https://dummyjson.com/products/category/${category}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products by category");
      }

      const data: ProductsResponse = await response.json();
      return data.products;
    } catch (e) {
      console.error("Error fetching products by category:", e);
      return [];
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchCategories,
    fetchProductById,
    searchProducts,
    fetchProductsByCategory,
  };
}
