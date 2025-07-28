import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import TicketNumbers from "./TicketNumbers";
import Button from "../shared/Button";
import { getSize } from "@/utils/useScaleSize";

interface TicketItemProps {
  price: string;
  details: string;
  availableTickets: number;
  value: number; // Current value passed from parent
  onIncrease: () => void; // Callback for increasing value
  onDecrease: () => void; // Callback for decreasing value
  className?: string;
  addToCard: () => void;
}
const TicketItem: React.FC<TicketItemProps> = ({
  availableTickets,
  price,
  details,
  value,
  onIncrease,
  onDecrease,
  className,
  addToCard,
}) => {
  return (
    <View
      className={`flex-row justify-between items-center px-4 py-6 rounded-xl mx-4 mb-4 bg-stone-50 ${className} dark:bg-white/10`}
    >
      <View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-montserratBold text-xl dark:text-white"
        >
          {price}
        </Text>
        <Text
          ellipsizeMode="tail"
          className="font-montserratSemiBold text-sm w-36 flex-wrap dark:text-Accent"
        >{`${details}`}</Text>
      </View>

      {/* Ticket Item */}
      {availableTickets > 0 || availableTickets !== -1 ? (
        <View className="flex-row items-center justify-between gap-2">
          <TicketNumbers
            value={value}
            maxValue={availableTickets}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
          <TouchableOpacity
            style={{
              width: getSize(25, "width"),
              height: getSize(5, "height"),
            }}
            className={`${value > 0 ? "bg-Primary" : "bg-LightGray"} rounded-2xl
            items-center justify-center 
            `}
            onPress={addToCard}
          >
            <Text
              className={`${
                value > 0 ? "text-white" : "text-Gray"
              } font-montserratBold text-sm`}
            >
              Add To Cart
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Button
          color="bg-red-600"
          size="small"
          title="Sold out"
          textSize="text-lg"
          borderRadius="rounded-2xl"
          textColor="text-white"
          textFont="font-montserratBold"
        />
      )}
    </View>
  );
};

export default TicketItem;
