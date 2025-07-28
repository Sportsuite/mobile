import { View, Text, Platform, useColorScheme } from "react-native";
import React from "react";
import { useCartStore } from "@/store";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "../shared/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getSize } from "@/utils/useScaleSize";
import { router } from "expo-router";

interface CartInfoProps {
  url?: string;
  text?: string;
}
const CartInfo = ({
  text = "Continue",
  url = "/eventsbase/event-transportation",
}: CartInfoProps) => {
  const total = useCartStore.getState().getTotalPrice();
  const totalTickets = useCartStore((state) => state.getTotalTicketCount());
  const colorScheme = useColorScheme();

  if (!totalTickets) return null;
  return (
    <View
      className={`${Platform.OS === "android" ? "pb-4" : "pb-8"} px-2`}
      style={{
        backgroundColor: "rgba(0,0,0,0)",
        zIndex: 50,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <View
        style={{ height: getSize(10, "height") }}
        className="bg-Primary rounded-full items-center p-3 flex-row gap-4 justify-between dark:bg-white/10"
      >
        <View className="bg-white rounded-full w-16 items-center justify-center h-16 dark:bg-Dark">
          <MaterialCommunityIcons
            name="cart-variant"
            size={28}
            color={colorScheme === "dark" ? "white" : "#0052FF"}
          />
        </View>

        <View className="flex-1 flex-row items-center justify-between mr-3">
          <View>
            <Text className="font-montserratRegular text-white dark:text-Accent">
              {totalTickets} {totalTickets > 0 ? "Tickets" : "Ticket"}
            </Text>
            <Text className="font-montserratBold text-lg text-white">
              {formatCurrency(total, "EUR")}
            </Text>
          </View>

          <Button
            color={`bg-white dark:bg-Dark`}
            size="medium"
            textColor="text-Primary dark:text-white"
            title={text}
            borderRadius="rounded-full"
            onPress={() => router.push(url)}
          />
        </View>
      </View>
    </View>
  );
};

export default CartInfo;
