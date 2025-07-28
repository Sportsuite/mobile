import React, { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useColorScheme } from "nativewind";
import { Appearance, View } from "react-native";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((state) =>
    state.useSystemTheme ? Appearance.getColorScheme() || "light" : state.theme
  );
  const { setColorScheme } = useColorScheme();

  // Sync with NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <View className={`flex-1 ${theme === "light" ? "bg-white" : "bg-Dark"}`}>
      {children}
    </View>
  );
};

export default ThemeProvider;
