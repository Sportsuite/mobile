import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSize } from "@/utils/useScaleSize";

const tabs: {
  name: "home" | "calendar-outline" | "search-outline" | "person-outline";
  label: string;
  color: string;
}[] = [
  { name: "home", label: "Home", color: "#0052FF" },
  { name: "calendar-outline", label: "Events", color: "#616161" },
  { name: "search-outline", label: "Search", color: "#616161" },
  { name: "person-outline", label: "Profile", color: "#616161" },
];

const BottomNav = () => {
  const colorScheme = useColorScheme();
  return (
    <View className="bg-LightBlue flex-row justify-between absolute bottom-0 w-full px-4  rounded-t-3xl py-4 dark:bg-Dark">
      {tabs.map((tab) => (
        <TouchableOpacity
          onPress={() => {
            if (tab.name !== "home") {
              // Navigate to login page
              router.push("login");
            }
          }}
          key={tab.name}
          className="justify-center items-center w-20"
        >
          <Ionicons
            name={tab.name}
            color={
              colorScheme === "dark" && tab.name !== "home"
                ? "white"
                : tab.color
            }
            size={getSize(6, "width")}
          />
          <Text
            style={{ fontSize: getSize(2.5, "width") }}
            className={`font-montserratSemiBold ${
              tab.name === "home" ? "dark:text-Primary" : "dark:text-white"
            } `}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNav;
