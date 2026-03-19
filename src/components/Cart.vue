<script setup lang="ts">
import { useCartStore } from "../stores/cartStore";

const cartStore = useCartStore();

const formatPrice = (price: number, discount: number) => {
  return (price * (1 - discount / 100)).toFixed(2);
};
</script>

<template>
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
    @click="cartStore.toggleCart"
  >
    <div
      class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl transform transition-transform"
      @click.stop
    >
      <div class="flex flex-col h-full">
        <div
          class="flex items-center justify-between p-4 border-b dark:border-gray-700"
        >
          <h2 class="text-xl font-bold">Shopping Cart</h2>
          <button
            @click="cartStore.toggleCart"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cartStore.items.length === 0" class="text-center py-12">
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p class="text-gray-600 dark:text-gray-400">Your cart is empty</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <img
                :src="item.product.thumbnail"
                :alt="item.product.title"
                class="w-20 h-20 object-cover rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-sm mb-1 line-clamp-2">
                  {{ item.product.title }}
                </h3>
                <p
                  class="text-primary-600 dark:text-primary-400 font-bold mb-2"
                >
                  ${{
                    formatPrice(
                      item.product.price,
                      item.product.discountPercentage,
                    )
                  }}
                </p>
                <div class="flex items-center space-x-2">
                  <button
                    @click="
                      cartStore.updateQuantity(
                        item.product.id,
                        item.quantity - 1,
                      )
                    "
                    class="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span class="w-8 text-center font-semibold">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="
                      cartStore.updateQuantity(
                        item.product.id,
                        item.quantity + 1,
                      )
                    "
                    class="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button
                    @click="cartStore.removeFromCart(item.product.id)"
                    class="ml-auto p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove from cart"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="border-t dark:border-gray-700 p-4 space-y-4"
        >
          <div class="flex items-center justify-between text-lg font-bold">
            <span>Total:</span>
            <span class="text-primary-600 dark:text-primary-400">
              ${{ cartStore.totalPrice.toFixed(2) }}
            </span>
          </div>
          <button class="btn-primary w-full">Proceed to Checkout</button>
          <button @click="cartStore.clearCart" class="btn-secondary w-full">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
