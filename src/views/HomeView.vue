<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useProducts } from "../composables/useProducts";
import SearchBar from "../components/SearchBar.vue";
import CategoryFilter from "../components/CategoryFilter.vue";
import ProductGrid from "../components/ProductGrid.vue";
import LoginModal from "../components/LoginModal.vue";
import type { Product } from "../types";

const authStore = useAuthStore();
const {
  products,
  isLoading,
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
} = useProducts();

const filteredProducts = ref<Product[]>([]);
const currentSearchQuery = ref("");
const currentCategory = ref("");
const showLoginModal = ref(false);

onMounted(async () => {
  await fetchProducts();
  filteredProducts.value = products.value;
});

const handleSearch = async (query: string) => {
  currentSearchQuery.value = query;
  currentCategory.value = "";

  if (!query) {
    filteredProducts.value = products.value;
    return;
  }

  const results = await searchProducts(query);
  filteredProducts.value = results;
};

const handleFilter = async (category: string) => {
  currentCategory.value = category;
  currentSearchQuery.value = "";

  if (!category) {
    filteredProducts.value = products.value;
    return;
  }

  const results = await fetchProductsByCategory(category);
  filteredProducts.value = results;
};

const activeFilterText = computed(() => {
  if (currentSearchQuery.value) {
    return `Search: "${currentSearchQuery.value}"`;
  }
  if (currentCategory.value) {
    return `Category: ${currentCategory.value.charAt(0).toUpperCase() + currentCategory.value.slice(1)}`;
  }
  return null;
});
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold mb-2">Discover Products</h1>
          <p class="text-gray-600 dark:text-gray-400">
            Browse our collection of amazing products
          </p>
        </div>
        <button
          v-if="!authStore.isAuthenticated"
          @click="showLoginModal = true"
          class="btn-primary flex items-center space-x-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span>Login</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <SearchBar @search="handleSearch" />
        </div>
        <CategoryFilter @filter="handleFilter" />
      </div>

      <div v-if="activeFilterText" class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400"
          >Active filter:</span
        >
        <span
          class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
        >
          {{ activeFilterText }}
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          ({{ filteredProducts.length }}
          {{ filteredProducts.length === 1 ? "result" : "results" }})
        </span>
      </div>
    </div>

    <ProductGrid :products="filteredProducts" :is-loading="isLoading" />

    <LoginModal v-if="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>
