import { View, Text, Animated } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";

type ListItemProps = {
  scrollX: Animated.Value;
  width: number;
  item: OnboardingDataItem;
  index: number;
};

const ListItem: React.FC<ListItemProps> = ({ item, scrollX, width, index }) => {
  const inputRange = [
    (index - 1) * width, // Before entering
    index * width, // Fully in view
    (index + 0.5) * width, // Slightly past center
    (index + 1) * width, // After exiting
  ];

  const rotate = scrollX.interpolate({
    inputRange,
    outputRange: ["180deg", "0deg", "-180deg", "0deg"], // Smoother rotation between entrance and exit
    extrapolate: "clamp",
  });
  return (
    <View
      style={{ width: width }}
      className="items-center justify-center px-14"
    >
      {/* Image */}
      <Animated.Image
        source={item.img}
        style={{
          width: getSize(85, "width"),
          height: getSize(85, "width"),
          transform: [{ rotate }],
        }}
        resizeMode="contain"
      />

      {/* title & subttitle */}
      <View className="items-center justify-center py-8">
        <Text className="text-3xl text-center font-montserratBold dark:text-stone-200">
          {item.title}
        </Text>
        <Text className="pt-5 text-base text-center font-montserratMedium text-Gray dark:text-stone-300">
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
};

export default ListItem;
