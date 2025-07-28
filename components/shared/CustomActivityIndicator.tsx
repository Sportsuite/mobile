import { View, ActivityIndicator, useColorScheme } from "react-native";
import React from "react";

interface CustomActivityIndicatorProps {
  size?: "small" | "large";
  className?: string;
  color?: string;
}

const CustomActivityIndicator: React.FC<CustomActivityIndicatorProps> = ({
  className,
  size = "small",
  color = "#0052FF",
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className={`${className}`}>
      <ActivityIndicator
        color={colorScheme === "dark" ? "white" : color}
        size={`${size}`}
      />
    </View>
  );
};

export default CustomActivityIndicator;
