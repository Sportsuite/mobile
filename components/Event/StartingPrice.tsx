import { View, Text } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";
import { formatCurrency } from "@/utils/formatCurrency";

interface StartingPriceProps {
  price: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
}

const StartingPrice: React.FC<StartingPriceProps> = ({
  price,
  className = "py-2 px-3",
  bgColor = "bg-Primary",
  textColor = "text-white",
}) => {
  return (
    <View
      className={`self-end items-center justify-center ${bgColor} rounded-xl ${className}`}
    >
      <Text
        className={`font-montserratRegular ${textColor}`}
        style={{ fontSize: getSize(2.3, "width") }}
      >
        Starting From
      </Text>
      <Text
        className={`font-montserratBold ${textColor}`}
        style={{ fontSize: getSize(4, "width") }}
      >
        {`${formatCurrency(price)}`}
      </Text>
    </View>
  );
};

export default StartingPrice;
