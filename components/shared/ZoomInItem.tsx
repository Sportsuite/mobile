import { Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

interface ZoomInItemProps {
  children: React.ReactNode;
  delay?: number; // Delay before animation starts in milliseconds
}

const ZoomInItem = ({ children, delay = 0 }: ZoomInItemProps) => {
  const zoomAnim = useRef(new Animated.Value(0.7)).current; // Start at 70% scale

  useEffect(() => {
    Animated.timing(zoomAnim, {
      toValue: 1, // Animate to full size
      duration: 300, // Animation duration
      delay, // Staggered delay
      easing: Easing.out(Easing.quad), // Smooth easing
      useNativeDriver: true, // Better performance
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: zoomAnim }],
        opacity: zoomAnim, // Optional fade-in
      }}
    >
      {children}
    </Animated.View>
  );
};
export default ZoomInItem;
