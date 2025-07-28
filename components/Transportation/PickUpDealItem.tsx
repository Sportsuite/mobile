import { View, Text } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";
import ToggleSwitch from "../shared/ToggleSwitch";

interface PickUpDealItemProps {
  className?: string;
  title: string;
  desc: string;
  isToggled: boolean;
  onToggle: () => void;
}
const PickUpDealItem: React.FC<PickUpDealItemProps> = ({
  desc,
  title,
  className = "mb-3",
  isToggled,
  onToggle,
}) => {
  return (
    <View
      className={`flex-row items-center justify-between px-6 py-8 rounded-xl bg-LightGray ${className} dark:bg-white/10`}
    >
      <View style={{ width: getSize(55, "width") }}>
        <Text className="pb-2 text-lg font-montserratBold dark:text-white">
          {title}
        </Text>
        <Text className="text-sm font-montserratRegular text-Gray dark:text-stone-200">
          {desc}
        </Text>
      </View>
      <ToggleSwitch isToggled={isToggled} onToggle={onToggle} />
    </View>
  );
};

export default PickUpDealItem;
