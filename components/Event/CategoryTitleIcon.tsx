import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface CategoryTitleIconProps {
  iconUrl?: any;
  title: string;
  className?: string;
}
const CategoryTitleIcon: React.FC<CategoryTitleIconProps> = ({
  iconUrl,
  title,
  className = "m-2",
}) => {
  return (
    <View className={`flex-row items-center ${className}`}>
      {iconUrl && (
        <Image
          source={iconUrl}
          style={{
            width: getSize(4, "width"),
            height: getSize(4, "width"),
          }}
          contentFit="contain"
        />
      )}
      <Text
        className="ml-2 font-montserratSemiBold dark:text-white"
        style={{ fontSize: getSize(4.5, "width") }}
      >
        {title}
      </Text>
    </View>
  );
};

export default CategoryTitleIcon;
