import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSize } from "@/utils/useScaleSize";

interface DoubleIconTextButtonProps {
  onPress?: () => void;
  text: string;
  titleStyle?: string;
  subText?: string;
  subTextStyle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showRightIcon?: boolean;
  bgColor?: string;
  subTextWidth?: string;
  borderColor?: string;
  textFont?: string;
  rightText?: string; // Optional right text
  rightTextColor?: string; // Customisable colour for right text
  rightTextFont?: string; // Customisable font for right text
  containerPadding?: string;
  rightIconBg?: string;
  width?: number;
}

const DoubleIconTextButton: React.FC<DoubleIconTextButtonProps> = ({
  onPress,
  text,
  titleStyle = "text-black",
  leftIcon,
  subText,
  subTextStyle = "text-sm font-montserratRegular w-72",
  rightIconBg,
  rightIcon = (
    <View className={`${rightIconBg}`}>
      <Ionicons
        name={"chevron-forward-outline"}
        color={rightIconBg ? "white" : "#0052FF"}
        size={rightIconBg ? 20 : 24}
      />
    </View>
  ),
  showRightIcon = true,
  bgColor,
  borderColor = "border border-LightGray",
  textFont = "font-montserratBold",
  rightText, // Add optional right text
  rightTextColor = "text-gray-400", // Default colour for right text
  rightTextFont = "font-montserratRegular", // Default font for right text
  containerPadding = "py-6",
  width = getSize(98, "width"),
}) => {
  return (
    <TouchableOpacity
      style={{ width: width }}
      className={`flex-row flex-wrap px-2 items-center self-center justify-between ${containerPadding} rounded-xl ${bgColor} ${borderColor} dark:bg-white/10 dark:border-Gray`}
      onPress={onPress}
    >
      {/* Left Section */}
      <View className="flex-row flex-1 items-center">
        {leftIcon && (
          <View className="bg-Primary w-14 items-center justify-center h-14 rounded-full">
            {leftIcon}
          </View>
        )}
        <View className="flex-1">
          <Text
            className={`${
              leftIcon && "ml-4"
            } ${textFont} ${titleStyle} dark:text-white`}
          >
            {text}
          </Text>
          {subText && (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: getSize(3, "width"),
                width: getSize(68, "width"),
              }}
              className={`ml-4 text-wrap ${subTextStyle} text-Gray dark:text-stone-200`}
            >
              {subText}
            </Text>
          )}
        </View>
      </View>

      {/* Right Section */}
      <View className="flex-row items-center">
        {rightText && (
          <Text className={`mr-2 ${rightTextFont} ${rightTextColor}`}>
            {rightText}
          </Text>
        )}
        {showRightIcon && rightIcon}
      </View>
    </TouchableOpacity>
  );
};

export default DoubleIconTextButton;
