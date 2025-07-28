import { TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getSize } from "@/utils/useScaleSize";

interface IconButtonProps {
  icon?: any;
  className?: string;
  onPress: () => void;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon = <Ionicons name="options-outline" size={36} color="black" />,
  className,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${className}`}
      style={{ height: getSize(10, "width"), width: getSize(10, "width") }}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default IconButton;
