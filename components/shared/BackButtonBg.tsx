import { TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { getSize } from "@/utils/useScaleSize";

interface BackButtonBgProps {
  onPress?: () => void;
  className?: string;
  iconColor?: string;
}
const BackButtonBg: React.FC<BackButtonBgProps> = ({
  onPress = () => router.back(),
  className = "z-10",
  iconColor = "white",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`bg-black/35 rounded-full items-center justify-center ${className}`}
      style={{ height: getSize(12, "width"), width: getSize(12, "width") }}
    >
      <Ionicons
        name="chevron-back-outline"
        style={{ marginRight: 2 }}
        size={26}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export default BackButtonBg;
