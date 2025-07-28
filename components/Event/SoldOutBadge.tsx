import { View, Text } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";

const SoldOutBadge = () => {
  return (
    <View
      className={`self-end items-center justify-center bg-red-600 rounded-xl p-3`}
    >
      <Text
        className={`font-montserratBold text-white`}
        style={{ fontSize: getSize(4, "width") }}
      >
        Sold Out
      </Text>
    </View>
  );
};

export default SoldOutBadge;
