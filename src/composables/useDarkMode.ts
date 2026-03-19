import { ref, watch } from "vue";

export function useDarkMode() {
  const isDark = ref(false);

  const loadFromStorage = () => {
    const stored = localStorage.getItem("darkMode");
    if (stored) {
      isDark.value = JSON.parse(stored);
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme();
  };

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    localStorage.setItem("darkMode", JSON.stringify(isDark.value));
    applyTheme();
  };

  watch(isDark, applyTheme);

  loadFromStorage();

  return {
    isDark,
    toggleDarkMode,
  };
}
