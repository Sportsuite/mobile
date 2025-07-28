import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { getSize } from "@/utils/useScaleSize";
import { formatDateToReadableString } from "@/utils/formatDateTime";

interface ActiveEventListItemProps {
  onPress?: () => void;
  item?: EventObj;
}

const ActiveEventListItem = ({ item, onPress }: ActiveEventListItemProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row justify-between items-center mt-4 mb-2 bg-LightGray rounded-lg dark:bg-white/10"
      style={{ height: getSize(12, "height") }}
    >
      {/* right */}
      <View className="p-6">
        <Text className="font-montserratMedium text-sm dark:text-white">
          {`${formatDateToReadableString(
            item?.startDate?.date
          )} - ${formatDateToReadableString(item?.endDate?.date)}`}
        </Text>
        <Text
          numberOfLines={1}
          className="font-montserratBold text-lg w-80 dark:text-white"
        >
          {item?.title}
        </Text>
        <Text className="font-montserratMedium text-Accent">
          {`${item?.totalBooked ?? 0} ${
            (item?.totalBooked ?? 0) > 1 ? "Tickets" : "Ticket"
          } Booked`}
        </Text>
      </View>
      {/* left */}
      <View className="bg-Primary h-full justify-center rounded-r-lg px-4">
        <Feather
          name="chevron-right"
          size={24}
          color={colorScheme === "dark" ? "black" : "white"}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ActiveEventListItem;
