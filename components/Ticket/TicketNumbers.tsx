import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type TicketNumbersProps = {
  value: number; // Optional prop to set the initial value
  minValue?: number; // Minimum allowable value
  maxValue?: number; // Maximum allowable value
  onIncrease: () => void; // Callback for increasing value
  onDecrease: () => void; // Callback for decreasing value
  iconBg?: string;
};

const TicketNumbers: React.FC<TicketNumbersProps> = ({
  value,
  minValue = 0,
  maxValue = Infinity,
  onDecrease,
  onIncrease,
  iconBg = "bg-LightGray",
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-row items-center ">
      <TouchableOpacity
        className={`rounded-full w-8 h-8 justify-center items-center ${iconBg} dark:bg-Dark`}
        onPress={onDecrease}
        disabled={value <= minValue}
      >
        <Ionicons
          name="remove-outline"
          size={24}
          color={
            value <= minValue
              ? "gray"
              : colorScheme === "dark"
              ? "white"
              : "black"
          }
        />
      </TouchableOpacity>
      <Text className="font-montserratBold text-lg mx-3 dark:text-white">
        {value}
      </Text>
      <TouchableOpacity
        className={`rounded-full w-8 h-8 justify-center items-center ${iconBg} dark:bg-Dark`}
        onPress={onIncrease}
        disabled={value >= maxValue}
      >
        <Ionicons
          name="add-outline"
          size={24}
          color={
            value >= maxValue
              ? "gray"
              : colorScheme === "dark"
              ? "white"
              : "black"
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default TicketNumbers;
