import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React, { ReactNode } from "react";

interface Props {
  title: string;
  icon: ReactNode;
  onPress: () => void;
  isSelected: boolean;
}
const Filter = ({ icon, onPress, title, isSelected }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`${
        isSelected
          ? "bg-Primary"
          : colorScheme === "dark"
          ? "bg-Dark"
          : "bg-LightGray"
      } items-center gap-2 rounded-3xl p-4 flex-row`}
    >
      <View
        className={`${isSelected ? "bg-white" : "bg-Primary"} rounded-full p-2`}
      >
        {icon}
      </View>
      <Text
        className={`font-montserratBold ${
          isSelected
            ? "text-white"
            : colorScheme === "dark"
            ? "text-white"
            : "text-black"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Filter;
