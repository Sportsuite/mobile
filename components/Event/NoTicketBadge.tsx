import { View, Text } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";

const NoTicketBadge = () => {
  return (
    <View
      className={`self-end items-center justify-center bg-Accent rounded-xl p-3`}
    >
      <Text
        className={`font-montserratBold`}
        style={{ fontSize: getSize(3, "width") }}
      >
        No Tickets Available
      </Text>
    </View>
  );
};

export default NoTicketBadge;
