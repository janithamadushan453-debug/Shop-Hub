import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Product, CartItem } from "../types";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const isOpen = ref(false);

  const loadFromStorage = () => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      items.value = JSON.parse(stored);
    }
  };

  const saveToStorage = () => {
    localStorage.setItem("cart", JSON.stringify(items.value));
  };

  const addToCart = (product: Product) => {
    const existingItem = items.value.find(
      (item) => item.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ product, quantity: 1 });
    }

    saveToStorage();
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.product.id !== productId);
    saveToStorage();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((item) => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        removeFromCart(productId);
      } else {
        saveToStorage();
      }
    }
  };

  const clearCart = () => {
    items.value = [];
    saveToStorage();
  };

  const toggleCart = () => {
    isOpen.value = !isOpen.value;
  };

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => {
      const discountedPrice =
        item.product.price * (1 - item.product.discountPercentage / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
  });

  loadFromStorage();

  return {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    totalItems,
    totalPrice,
  };
});
