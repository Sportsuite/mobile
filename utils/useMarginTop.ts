import { Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useStatusBarHeight = () => {
  const insets = useSafeAreaInsets();
  return Platform.select({
    android: (StatusBar.currentHeight || 0) + 6,
    ios: insets.top,
  });
};
