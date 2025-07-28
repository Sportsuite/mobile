import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import TicketItem from "@/components/Ticket/TicketItem";
import { useSearchParams } from "expo-router/build/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCartStore } from "@/store";
import useEventStore from "@/store/eventStore";
import CartInfo from "@/components/Cart/CartInfo";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import ToastMsg from "@/components/shared/ToastMsg";

const TicketDetails = () => {
  const params = useSearchParams();
  const details: Ticket = JSON.parse(params.get("ticket") || "{}");
  const [ticketCount, setTicketCount] = useState(0);
  const addEventTicket = useCartStore((state) => state.addEventTicket);
  const event = useEventStore((state) => state.eventDetails);

  const handleAddToCart = () => {
    if (ticketCount > 0) {
      const result = addEventTicket(details, event, ticketCount);
      if (!result.success) {
        ToastMsg(result.message ?? "", "Ticket addition failed");
      } else {
        ToastMsg(
          "Ticket added to cart",
          "Ticket addition successful",
          "success"
        );
        setTicketCount(0); // Reset after adding
      }
      // addEventTicket(details, event, ticketCount);
    } else {
      ToastMsg("Ticket quantity must be at least 1", "Warning");
    }
  };

  return (
    <ScrollView
      className="bg-white dark:bg-Dark"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar style="light" />
      <View className="absolute z-40 left-2 top-14">
        <BackButtonBg />
      </View>
      <Image
        source={{
          uri: details?.image,
        }}
        style={{
          width: Dimensions.get("window").width,
          height: getSize(36.58, "height"),
        }}
        contentFit="cover"
      />

      <View className="flex-1">
        <View className="pt-4 pb-2">
          <View className="flex-row justify-between items-center px-4 mb-10">
            <Text className="font-montserratBold text-lg dark:text-white">
              {details.title}
            </Text>
            <View className="flex-row gap-2 items-center mt-2">
              {details.options.disabledAccess && (
                <MaterialCommunityIcons
                  name="wheelchair-accessibility"
                  size={28}
                  color="#F7C404"
                />
              )}

              {details.options.coveredGrandstand && (
                <MaterialIcons name="warehouse" size={28} color="#F7C404" />
              )}

              {details.options.giantScreen && (
                <MaterialCommunityIcons
                  name="projector-screen-outline"
                  size={28}
                  color="#F7C404"
                />
              )}

              {details.options.numberedSeat && (
                <MaterialIcons name="chair-alt" size={28} color="#F7C404" />
              )}
            </View>
          </View>

          <TicketItem
            availableTickets={details.remaining}
            price={formatCurrency(details.price, "EUR")}
            details={`${details.session?.title}`}
            value={ticketCount}
            onIncrease={() => setTicketCount(ticketCount + 1)}
            onDecrease={() => setTicketCount(ticketCount - 1)}
            addToCard={handleAddToCart}
          />
        </View>

        {/* Description */}
        <View className="px-4 mb-10">
          <Text className="font-semibold text-lg dark:text-white">
            Ticket Description
          </Text>
          {details?.description && (
            <RichTextRenderer htmlContent={details?.description} />
          )}
          {/* <Text className="font-montserratRegular text-sm mt-2 mb-4 text-pretty dark:text-white">
            {details.description}
          </Text> */}
        </View>
        <View className="mt-20 mb-5">
          <CartInfo />
        </View>
      </View>
    </ScrollView>
  );
};

export default TicketDetails;
