import { Text, TouchableOpacity } from "react-native";
import React from "react";

interface ToggleButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}
const ToggleButton = ({ label, isActive, onPress }: ToggleButtonProps) => {
  return (
    <TouchableOpacity
      className={`py-6 flex-1 items-center rounded-3xl ${
        isActive ? "bg-Primary" : "bg-transparent"
      }`}
      onPress={onPress}
    >
      <Text
        className={`font-montserratSemiBold ${
          isActive ? "text-white" : "text-black"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleButton;
