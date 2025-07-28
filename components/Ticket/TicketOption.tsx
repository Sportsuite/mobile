import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Button from "../shared/Button";
import { formatCurrency } from "@/utils/formatCurrency";

interface TicketOptionProps {
  ticket: Ticket;
  onPress: () => void;
}
const TicketOption = ({ onPress, ticket }: TicketOptionProps) => {
  const colorScheme = useColorScheme();

  return (
    <View className="rounded-xl px-4 py-6 border border-LightGray mb-4">
      <Text className="font-montserratBold dark:text-white">
        {ticket.title}
      </Text>
      <View className="flex-row justify-between items-center mt-2">
        <View>
          <Text className="text-Primary font-montserratSemiBold text-xs dark:text-Accent">
            {ticket.session?.title}
          </Text>
          <View className="flex-row gap-2 items-center mt-2">
            {ticket.options.disabledAccess && (
              <MaterialCommunityIcons
                name="wheelchair-accessibility"
                size={24}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            )}
            {ticket.options.giantScreen && (
              <MaterialCommunityIcons
                name="projector-screen-outline"
                size={24}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            )}
            {ticket.options.coveredGrandstand && (
              <MaterialIcons
                name="warehouse"
                size={24}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            )}

            {ticket.options.numberedSeat && (
              <MaterialIcons
                name="chair-alt"
                size={24}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            )}
          </View>
        </View>
        <View>
          <Text className="font-montserratMedium text-sm text-gray-500 dark:text-white">
            From 
            <Text className="text-Primary font-montserratSemiBold dark:text-white">
              {formatCurrency(ticket.price, "EUR")}
            </Text>
          </Text>
          {ticket.isSoldOut ? (
            <Button
              color="bg-red-600"
              padding="p-4"
              size="small"
              title="Sold out"
              borderRadius="rounded-xl"
              textColor="text-white"
              margin="mt-1"
            />
          ) : (
            <Button
              padding="p-4"
              size="small"
              title="Select"
              margin="mt-1"
              borderRadius="rounded-xl"
              onPress={onPress}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default TicketOption;
