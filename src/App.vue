<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import Cart from "./components/Cart.vue";
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Cart />
  </div>

  
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>