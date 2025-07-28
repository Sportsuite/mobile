// components/ThemeWrapper.tsx
import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useColorScheme } from "nativewind";
import { Appearance } from "react-native";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, updateSystemTheme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  // Sync theme with NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      updateSystemTheme();
    });
    return () => subscription.remove();
  }, []);

  return <>{children}</>;
}
