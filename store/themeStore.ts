import { Appearance } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeState = {
  theme: "light" | "dark";
  useSystemTheme: boolean;
  toggleTheme: (theme?: "light" | "dark") => void;
  enableSystemTheme: () => void;
  updateSystemTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: Appearance.getColorScheme() || "light",
      useSystemTheme: true,
      toggleTheme: (theme) =>
        set((state) => {
          // If no parameter is passed, toggle between light/dark
          if (theme === undefined) {
            return {
              theme: state.theme === "light" ? "dark" : "light",
              useSystemTheme: false,
            };
          }

          return {
            theme,
            useSystemTheme: false,
          };
        }),
      enableSystemTheme: () => {
        const systemTheme = Appearance.getColorScheme() || "light";
        return {
          useSystemTheme: true,
          theme: systemTheme,
        };
      },
      updateSystemTheme: () => {
        if (get().useSystemTheme) {
          const systemTheme = Appearance.getColorScheme() || "light";
          return { theme: systemTheme };
        }
        return {};
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// System theme change listener
Appearance.addChangeListener(({ colorScheme }) => {
  const { useSystemTheme } = useThemeStore.getState();
  if (useSystemTheme) {
    useThemeStore.setState({ theme: colorScheme || "light" });
  }
});
