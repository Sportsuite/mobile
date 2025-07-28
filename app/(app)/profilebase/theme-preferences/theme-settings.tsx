import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PageTitle from "@/components/shared/PageTitle";
import {
  Foundation,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeSetting() {
  const theme = useThemeStore((state) => state.theme);
  const useSystemTheme = useThemeStore((state) => state.useSystemTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const enableSystemTheme = useThemeStore((state) => state.enableSystemTheme);
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <PageTitle title="Theme Settings" />

      <Text className="font-montserratBold text-lg px-4 mt-4 text-Gray dark:text-stone-200">
        Theme Settings
      </Text>
      {/* Light */}
      <TouchableOpacity
        onPress={() => toggleTheme("light")}
        activeOpacity={0.8}
        className="flex-row items-center justify-between px-4 py-6 mx-2 my-4 rounded-xl bg-LightBlue dark:bg-white/10"
      >
        <View className="flex-row items-center gap-3">
          <Foundation
            name="lightbulb"
            size={24}
            color={isDarkMode ? "white" : "#0052FF"}
          />
          <Text className="font-montserratSemiBold text-Primary dark:text-white">
            Light
          </Text>
        </View>
        <View className="flex-row items-center">
          {!useSystemTheme && theme === "light" ? (
            <AntDesign
              name="checkcircle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          ) : (
            <Feather
              name="circle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          )}
        </View>
      </TouchableOpacity>
      {/* Dark */}
      <TouchableOpacity
        onPress={() => toggleTheme("dark")}
        activeOpacity={0.8}
        className="flex-row items-center justify-between px-4 py-6 mx-2 my-4 rounded-xl bg-LightBlue dark:bg-white/10"
      >
        <View className="flex-row items-center gap-3">
          <MaterialIcons
            name="dark-mode"
            size={24}
            color={isDarkMode ? "white" : "#0052FF"}
          />
          <Text className="font-montserratSemiBold text-Primary dark:text-white">
            Dark
          </Text>
        </View>
        <View className="flex-row items-center">
          {!useSystemTheme && theme === "dark" ? (
            <AntDesign
              name="checkcircle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          ) : (
            <Feather
              name="circle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* useSystem */}
      {/* <TouchableOpacity
        onPress={enableSystemTheme}
        className="flex-row items-center justify-between px-4 py-6 mx-2 my-4 rounded-xl bg-LightBlue dark:bg-white/10"
      >
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="theme-light-dark"
            size={24}
            color={isDarkMode ? "white" : "#0052FF"}
          />
          <Text className="font-montserratSemiBold text-Primary dark:text-white">
            System
          </Text>
        </View>
        <View className="flex-row items-center">
          {useSystemTheme ? (
            <AntDesign
              name="checkcircle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          ) : (
            <Feather
              name="circle"
              size={24}
              color={isDarkMode ? "white" : "#0052FF"}
            />
          )}
        </View>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
