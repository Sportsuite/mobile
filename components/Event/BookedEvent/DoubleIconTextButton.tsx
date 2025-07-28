import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { Ionicons } from "@expo/vector-icons";

interface DoubleIconTextButtonProps {
  icon: any;
  title: string;
  onPress: () => void;
  border?: boolean;
}
const DoubleIconTextButton = ({
  icon,
  title,
  onPress,
  border = false,
}: DoubleIconTextButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className={`flex-row items-center border-LightGray justify-between px-4 py-6 rounded-xl`}
      style={{ borderBottomWidth: border ? 1 : 0 }}
      onPress={onPress}
    >
      {/* Left Section */}
      <View className="flex-row items-center">
        <Image
          source={icon}
          style={{
            width: getSize(7.4, "width"),
            height: getSize(7.4, "width"),
          }}
        />
        <Text className="ml-4 font-montserratMedium dark:text-white">
          {title}
        </Text>
      </View>

      {/* Right Section */}
      <View className="flex-row items-center mr-2">
        <Ionicons name={"chevron-forward-outline"} color={"gray"} size={24} />
      </View>
    </TouchableOpacity>
  );
};

export default DoubleIconTextButton;
