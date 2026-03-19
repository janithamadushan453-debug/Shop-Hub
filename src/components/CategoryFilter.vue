<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProducts } from "../composables/useProducts";

const { categories, fetchCategories } = useProducts();
const selectedCategory = ref<string>("");

const emit = defineEmits<{
  filter: [category: string];
}>();

onMounted(() => {
  fetchCategories();
});

const handleCategoryChange = () => {
  emit("filter", selectedCategory.value);
};

const clearFilter = () => {
  selectedCategory.value = "";
  emit("filter", "");
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <select
      v-model="selectedCategory"
      @change="handleCategoryChange"
      class="input"
    >
      <option value="">All Categories</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category.charAt(0).toUpperCase() + category.slice(1) }}
      </option>
    </select>
    <button
      v-if="selectedCategory"
      @click="clearFilter"
      class="btn-secondary whitespace-nowrap"
    >
      Clear
    </button>
  </div>
</template>
