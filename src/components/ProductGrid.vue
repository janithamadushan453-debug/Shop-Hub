<script setup lang="ts">
import ProductCard from "./ProductCard.vue";
import type { Product } from "../types";

defineProps<{
  products: Product[];
  isLoading: boolean;
}>();
</script>

<template>
  <div
    v-if="isLoading"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <div v-for="i in 8" :key="i" class="card animate-pulse">
      <div class="aspect-square bg-gray-300 dark:bg-gray-700"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>

  <div v-else-if="products.length === 0" class="text-center py-12">
    <svg
      class="w-24 h-24 mx-auto text-gray-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 class="text-xl font-semibold mb-2">No products found</h3>
    <p class="text-gray-600 dark:text-gray-400">
      Try adjusting your search or filters
    </p>
  </div>

  <div
    v-else
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
