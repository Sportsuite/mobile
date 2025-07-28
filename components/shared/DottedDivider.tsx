import { View } from "react-native";
import React from "react";
import Svg, { Line } from "react-native-svg";

export const DottedDivider = ({
  color = "black",
  thickness = 1,
  spacing = 3,
  className = "w-full",
}) => {
  return (
    <View
      className={`${className} overflow-hidden`}
      style={{ height: thickness * 2 }}
    >
      <Svg height={thickness} width="100%">
        <Line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${thickness},${spacing}`}
        />
      </Svg>
    </View>
  );
};
