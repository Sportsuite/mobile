import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";

interface PassedProps {
  className?: string;
}
const Passed = ({ className = "bg-LightPrimary" }: PassedProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={`bg-red-700 self-end  p-4 rounded-xl ${className}`}
    >
      <Text
        className={`font-montserratBold text-white`}
        style={{ fontSize: getSize(3, "width") }}
      >
        Passed Event
      </Text>
    </TouchableOpacity>
  );
};

export default Passed;
