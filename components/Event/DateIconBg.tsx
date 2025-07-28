import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface DateIconBgProps {
  date: string;
  iconUrl: any;
  className?: string;
  iconWidth?: number;
  iconHeight?: number;
}
const DateIconBg: React.FC<DateIconBgProps> = ({
  date,
  iconUrl,
  className,
  iconWidth = 4,
  iconHeight = 4,
}) => {
  return (
    <View
      className={`bg-Accent rounded-full p-2 flex-row items-center ${className}`}
    >
      <Image
        source={iconUrl}
        style={{
          width: getSize(iconWidth, "width"),
          height: getSize(iconHeight, "width"),
        }}
        contentFit="contain"
      />
      <Text
        className={`font-montserratMedium ml-2 mr-1`}
        style={{ fontSize: getSize(3, "width") }}
      >
        {date}
      </Text>
    </View>
  );
};

export default DateIconBg;
