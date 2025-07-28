import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

interface ActiveEventProps {
  onPress?: () => void;
  eventName?: string;
}

const ActiveEvent = ({ eventName, onPress }: ActiveEventProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between mx-2 px-6 py-4 rounded-xl mt-2 bg-LightGray dark:bg-white/10"
    >
      {/* right */}
      <View>
        <Text className="font-montserratRegular text-sm dark:text-white">
          Select Active Event
        </Text>
        <Text
          className="font-montserratBold text-lg w-80 dark:text-white"
          numberOfLines={1}
        >
          {eventName || "No active event selected"}
        </Text>
      </View>
      {/* left */}
      <View>
        <Feather
          name="chevron-down"
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ActiveEvent;
