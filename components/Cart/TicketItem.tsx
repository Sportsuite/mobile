import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/formatCurrency";
import { getFormattedSessionDates } from "@/utils/getFormattedSessionDates";

interface TicketItemProps {
  ticket: Ticket;
  eventObj: EventObj;
  onPress: () => void;
}
const TicketItem = ({ ticket, eventObj, onPress }: TicketItemProps) => {
  return (
    <View className="bg-white rounded-xl pt-4 items-center justify-center mb-4 dark:bg-white/10">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="absolute top-4 bg-red-500 p-2 rounded-full right-4"
      >
        <AntDesign name="delete" size={16} color="white" />
      </TouchableOpacity>
      {/* Ticket title and sessions */}
      <View className="pb-2 mt-8">
        <Text className="font-montserratBold text-2xl uppercase text-center dark:text-white">
          {ticket.title}
        </Text>
        <Text className="font-montserratMedium text-lg uppercase text-center dark:text-white">
          {ticket.session.title}
        </Text>
      </View>

      <View className="border-t border-b border-LightGray w-full py-4">
        <Text className="font-montserratBold text-xl uppercase text-center dark:text-white">
          {eventObj.country?.name}
        </Text>
        <Text className="font-montserratMedium uppercase mt-2 text-center dark:text-white">
          {getFormattedSessionDates(
            ticket.session.days,
            eventObj.startDate.date,
            eventObj.endDate.date
          )}
        </Text>
      </View>

      <View className="bg-Accent w-full py-6 rounded-b-xl dark:bg-white/10">
        <Text className="font-montserratBold text-2xl text-center dark:text-white">
          {formatCurrency(ticket.price)}
        </Text>
      </View>
    </View>
  );
};

export default TicketItem;
