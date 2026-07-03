import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newValue = !get().isDark;
        set({isDark: newValue})
        if (newValue) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      setTheme: (dark) => {
        set({ isDark: dark });
        if (dark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      },
    }),
    {
      name: "theme-storage",
    },
  ),
);
