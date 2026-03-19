<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cartStore";
import type { Product } from "../types";

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();
const cartStore = useCartStore();

const discountedPrice = computed(() => {
  return props.product.price * (1 - props.product.discountPercentage / 100);
});

const openDetail = () => {
  router.push(`/product/${props.product.id}`);
};

const addToCart = (event: Event) => {
  event.stopPropagation();
  cartStore.addToCart(props.product);
};

const ratingStars = computed(() => {
  const rating = Math.round(props.product.rating);
  return Array.from({ length: 5 }, (_, i) => i < rating);
});
</script>

<template>
  <div class="card cursor-pointer overflow-hidden group" @click="openDetail">
    <div class="relative overflow-hidden aspect-square">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div
        v-if="product.discountPercentage > 0"
        class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>
      <div
        v-if="product.stock < 10"
        class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium"
      >
        Only {{ product.stock }} left
      </div>
    </div>

    <div class="p-4">
      <p
        class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1"
      >
        {{ product.brand }}
      </p>
      <h3 class="font-semibold text-lg mb-2 line-clamp-2">
        {{ product.title }}
      </h3>

      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <svg
            v-for="(filled, index) in ratingStars"
            :key="index"
            class="w-4 h-4"
            :class="
              filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            "
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <div class="flex items-center justify-between mb-3">
        <div>
          <span
            class="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            ${{ discountedPrice.toFixed(2) }}
          </span>
          <span
            v-if="product.discountPercentage > 0"
            class="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through"
          >
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
      </div>

      <button
        @click="addToCart"
        class="btn-primary w-full flex items-center justify-center space-x-2"
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Add to Cart</span>
      </button>
    </div>
  </div>
</template>
