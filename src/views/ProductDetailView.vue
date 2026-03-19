<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProducts } from "../composables/useProducts";
import { useCartStore } from "../stores/cartStore";
import type { Product } from "../types";

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const { fetchProductById, isLoading } = useProducts();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const selectedImage = ref("");

onMounted(async () => {
  const data = await fetchProductById(Number(props.id));
  if (data) {
    product.value = data;
    selectedImage.value = data.thumbnail;
  }
});

const discountedPrice = computed(() => {
  if (!product.value) return 0;
  return product.value.price * (1 - product.value.discountPercentage / 100);
});

const ratingStars = computed(() => {
  if (!product.value) return [];
  const rating = Math.round(product.value.rating);
  return Array.from({ length: 5 }, (_, i) => i < rating);
});

const goBack = () => {
  router.back();
};

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value);
  }
};
</script>

<template>
  <div>
    <button
      @click="goBack"
      class="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>Back to products</span>
    </button>

    <div v-if="isLoading" class="animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          class="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg"
        ></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <div
          class="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <img
            :src="selectedImage"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="image in product.images"
            :key="image"
            @click="selectedImage = image"
            class="aspect-square rounded-lg overflow-hidden border-2 transition-colors"
            :class="
              selectedImage === image
                ? 'border-primary-600'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
            "
          >
            <img
              :src="image"
              :alt="product.title"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <p
            class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
          >
            {{ product.brand }}
          </p>
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            {{ product.title }}
          </h1>

          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center">
              <svg
                v-for="(filled, index) in ratingStars"
                :key="index"
                class="w-5 h-5"
                :class="
                  filled
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                "
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="text-lg font-medium">{{
              product.rating.toFixed(1)
            }}</span>
          </div>

          <div class="flex items-center space-x-4 mb-6">
            <span
              class="text-4xl font-bold text-primary-600 dark:text-primary-400"
            >
              ${{ discountedPrice.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="text-xl text-gray-500 dark:text-gray-400 line-through"
            >
              ${{ product.price.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-bold"
            >
              -{{ Math.round(product.discountPercentage) }}% OFF
            </span>
          </div>

          <div class="flex items-center space-x-2 mb-6">
            <svg
              class="w-5 h-5"
              :class="product.stock > 10 ? 'text-green-500' : 'text-orange-500'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span
              :class="
                product.stock > 10
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
              "
            >
              {{
                product.stock > 10
                  ? "In Stock"
                  : `Only ${product.stock} left in stock`
              }}
            </span>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 class="text-lg font-semibold mb-3">Description</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="space-y-2">
          <div
            class="flex items-center justify-between py-3 border-b dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-400">Category</span>
            <span class="font-medium">{{ product.category }}</span>
          </div>
          <div
            class="flex items-center justify-between py-3 border-b dark:border-gray-700"
          >
            <span class="text-gray-600 dark:text-gray-400">Brand</span>
            <span class="font-medium">{{ product.brand }}</span>
          </div>
          <div class="flex items-center justify-between py-3">
            <span class="text-gray-600 dark:text-gray-400">Stock</span>
            <span class="font-medium">{{ product.stock }} units</span>
          </div>
        </div>

        <button
          @click="addToCart"
          class="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>
