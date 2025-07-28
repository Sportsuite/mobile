import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { getSize } from "@/utils/useScaleSize";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import { formatCurrency } from "@/utils/formatCurrency";

interface OrderListItemProps {
  onPress?: () => void;
  item: OrderDetails;
}

const OrderListItem = ({ item, onPress }: OrderListItemProps) => {
  const order = item.order;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row justify-between items-center mt-4 mb-2 bg-LightGray rounded-lg dark:bg-white/10"
      style={{ height: getSize(12, "height") }}
    >
      {/* right */}
      <View className="p-6">
        <Text className="font-montserratMedium dark:text-white">
          {`${formatDateToReadableString(order?.created_at?.date)} ${
            order?.created_at?.time
          }`}
        </Text>
        <Text className="font-montserratBold text-2xl dark:text-white">
          {formatCurrency(order?.total)}
        </Text>
        <Text className="font-montserratMedium text-Accent">
          {`${item?.totalTicket} ${
            parseInt(item?.totalTicket) > 1 ? "Tickets" : "Ticket"
          } Purchased`}
        </Text>
      </View>
      {/* left */}
      <View className="bg-Primary h-full justify-center rounded-r-lg px-4">
        <Feather name="chevron-right" size={24} color={"white"} />
      </View>
    </TouchableOpacity>
  );
};

export default OrderListItem;
