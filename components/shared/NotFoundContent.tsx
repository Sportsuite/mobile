import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface NotFoundContentProps {
  className?: string;
  imgWidth?: number;
  imgHeight?: number;
  title: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
}
const NotFoundContent: React.FC<NotFoundContentProps> = ({
  className,
  imgHeight = 30,
  imgWidth = 50,
  subtitle = "Please check back later.",
  title,
  titleColor = "black",
  subtitleColor = "text-gray-400",
}) => {
  return (
    <View className={`py-8 items-center justify-center ${className}`}>
      <Image
        source={require("../../assets/icons/not_found.png")}
        style={{
          width: getSize(imgWidth, "width"),
          height: getSize(imgHeight, "width"),
        }}
        contentFit="contain"
      />
      <Text
        className={`font-montserratSemiBold text-3xl py-2 ${titleColor} dark:text-white`}
      >
        {title}
      </Text>
      <Text
        className={`font-montserratRegular text-center text-sm px-12 ${subtitleColor} dark:text-white`}
      >
        {subtitle}
      </Text>
    </View>
  );
};

export default NotFoundContent;
