import { TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

interface BackButtonProps {
  className?: string;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
}
const BackButton: React.FC<BackButtonProps> = ({
  className,
  iconColor = "white",
  iconSize = 24,
  onPress = () => router.back(),
}) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      className={`p-3 ${className}`}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name="chevron-back-outline"
        size={iconSize}
        color={colorScheme === "dark" ? "white" : iconColor}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
