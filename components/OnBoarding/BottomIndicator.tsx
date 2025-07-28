import { Animated } from "react-native";
import React from "react";
import useDimensions from "@/utils/useDimensions";

const { width } = useDimensions();

type BottomIndicatorProps = {
  color: string;
  data: any[];
  scrollX: any;
};

const BottomIndicator: React.FC<BottomIndicatorProps> = ({
  color,
  data,
  scrollX,
}) => {
  return data.map((_, i) => {
    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [10, 20, 10],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp",
    });
    return (
      <Animated.View
        key={i}
        className={`h-2 w-4 mx-1 rounded-full ${color}`}
        style={{ width: dotWidth, opacity }}
      />
    );
  });
};

export default BottomIndicator;
