import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useColorScheme } from "nativewind";

export function useThemeSync() {
  const { theme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);
}
