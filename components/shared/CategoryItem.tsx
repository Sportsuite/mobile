import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface CategoryItemProps {
  item: Category;
  className?: string;
  onPress: () => void;
  textColor?: string;
}
const CategoryItem: React.FC<CategoryItemProps> = ({
  item,
  className,
  onPress,
  textColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`flex-row items-center py-2 px-2 rounded-full justify-center ${className}`}
    >
      {/* icon */}
      <Image
        source={{ uri: item.image }}
        style={{
          width: getSize(6, "width"),
          height: getSize(6, "width"),
          borderRadius: getSize(6, "width"),
        }}
      />
      {/* text */}
      <Text className={`ml-1 font-montserratRegular text-sm ${textColor}`}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
