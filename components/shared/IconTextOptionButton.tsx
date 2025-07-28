import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface IconTextOptionButtonProps {
  onPress: () => void;
  imageSource: any;
  title: string;
  description: string;
  extraStyle?: string;
}

const IconTextOptionButton: React.FC<IconTextOptionButtonProps> = ({
  onPress,
  imageSource,
  title,
  description,
  extraStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`items-center justify-center mb-4 bg-LightGray rounded-3xl ${extraStyle} dark:bg-white/10`}
      style={{
        width: getSize(41.86, "width"),
        height: getSize(25, "height"),
      }}
    >
      <Image
        style={{ width: getSize(9.7, "width"), height: getSize(9.7, "width") }}
        source={imageSource}
      />
      <Text className="pt-4 pb-2 text-center font-montserratBold dark:text-white">
        {title}
      </Text>

      <Text className="px-4 text-xs text-center text-Gray font-montserratRegular dark:text-stone-200">
        {description}
      </Text>
    </TouchableOpacity>
  );
};

export default IconTextOptionButton;
