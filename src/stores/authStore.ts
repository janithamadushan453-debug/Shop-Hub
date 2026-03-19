import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, LoginCredentials, AuthResponse } from "../types";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadFromStorage = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      user.value = JSON.parse(stored);
    }
  };

  const saveToStorage = () => {
    if (user.value) {
      localStorage.setItem("user", JSON.stringify(user.value));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data: AuthResponse = await response.json();
      user.value = data;
      saveToStorage();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Login failed";
      throw e;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    saveToStorage();
  };

  const isAuthenticated = computed(() => user.value !== null);

  loadFromStorage();

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
  };
});
