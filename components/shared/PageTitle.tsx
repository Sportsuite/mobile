import { View, Text, useColorScheme } from "react-native";
import React from "react";
import BackButton from "./BackButton";
import { getSize } from "@/utils/useScaleSize";
import BackButtonBg from "./BackButtonBg";

interface PageTitleProps {
  title: string;
  className?: string;
  bgBack?: boolean;
  containerStyle?: string;
}
const PageTitle: React.FC<PageTitleProps> = ({
  title,
  bgBack = false,
  className,
  containerStyle,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className={`${containerStyle} flex-row items-center py-2`}>
      {bgBack ? (
        <BackButtonBg />
      ) : (
        <BackButton
          className="z-10"
          iconColor={colorScheme === "dark" ? "white" : "black"}
          iconSize={28}
        />
      )}
      <Text
        className={`font-montserratBold absolute right-0 left-0 text-center ${className} dark:text-white`}
        style={{ fontSize: getSize(4, "width") }}
      >
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;
