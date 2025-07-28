import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TicketItem from "./TicketItem";
import { Capitalize } from "@/utils/capitalize-word";

interface TicketListProps {
  items: CartItem[];
  type: any;
}
const TicketList = ({ items, type }: TicketListProps) => {
  // Calculate the total for a group of items
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <View className="bg-transparent px-2 mb-8">
      {/* Designs */}
      <View className="bg-Primary rounded-full w-6 h-6 z-40 absolute left-0 bottom-20" />
      <View className="bg-Primary rounded-full w-6 h-6 z-40 absolute right-0 bottom-20" />

      {/* Different Ticket List Item */}
      <View className="bg-white rounded-lg px-6 py-8">
        {/* Item Type and Grand total */}
        <View className="flex-row justify-between px-8 items-center">
          <Text className="font-montserratBold">{Capitalize(type)}</Text>
          <View className="items-center">
            <Text className="font-montserratBold">{`$${calculateTotal(
              items
            ).toLocaleString()}`}</Text>
            <Text className="font-montserratMedium text-gray-400 text-sm">
              Total
            </Text>
          </View>
        </View>

        {/* Table */}
        <View className="mt-4">
          {/* Type Qty and Price per item */}
          <View className="flex-row justify-between items-center">
            <Text className="font-montserratMedium text-gray-400 flex-1 text-center">
              Type
            </Text>
            <Text className="font-montserratMedium text-gray-400 flex-1 text-center">
              Quantity
            </Text>
            <Text className="font-montserratMedium text-gray-400 flex-1 text-center">
              Price
            </Text>
          </View>

          {/* Item Info */}
          {items &&
            items.map((item, index) => (
              <TicketItem key={item.id} item={item} />
            ))}

          {/* Bottom Nav */}
          <View className="mt-12">
            <View className="h-0.5 w-full border border-dashed border-gray-400 mb-2" />

            <TouchableOpacity className="mt-6">
              <Text className="font-montserratSemiBold text-lg text-Primary text-center">
                Modify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TicketList;
