import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface DateIconSideProps {
  date: string;
  title: string;
  className?: string;
}
const DateIconSide: React.FC<DateIconSideProps> = ({
  date,
  title,
  className,
}) => {
  return (
    <View className={`flex-row items-center ${className}`}>
      <Image
        source={require("../../assets/icons/calendar.png")}
        style={{
          width: getSize(7.4, "width"),
          height: getSize(7.4, "width"),
        }}
      />
      <View className="ml-2 ">
        <Text className="font-montserratRegular text-lg text-black dark:text-white">
          {date}
        </Text>
        <Text className="font-montserratRegular  text-gray-400">{`${title} Date`}</Text>
      </View>
    </View>
  );
};

export default DateIconSide;
