<script setup lang="ts">
import { ref } from "vue";

const searchQuery = ref("");

const emit = defineEmits<{
  search: [query: string];
}>();

const handleSearch = () => {
  emit("search", searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = "";
  emit("search", "");
};
</script>

<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search products..."
      class="input pr-20"
      @keyup.enter="handleSearch"
    />
    <div
      class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1"
    >
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
        title="Clear search"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <button
        @click="handleSearch"
        class="p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
        title="Search"
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
