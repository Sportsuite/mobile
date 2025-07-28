import { View, Text, Alert, FlatList, useColorScheme } from "react-native";
import React, { useMemo, useState } from "react";
import BackButtonBg from "@/components/shared/BackButtonBg";
import Button from "@/components/shared/Button";
import { useCartStore } from "@/store/cartStore";
import TicketItem from "@/components/Cart/TicketItem";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { formatCurrency } from "@/utils/formatCurrency";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { useStripe } from "@stripe/stripe-react-native";
import { useMutation } from "@apollo/client";
import {
  CANCEL_ORDER_PAYMENT,
  INITIATE_PAYMENT,
} from "@/graphql/mutations/payment.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { router } from "expo-router";
import { useAuth } from "@/store/context/auth-context";
import ToastMsg from "@/components/shared/ToastMsg";

const CartHome = () => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const eventTickets = useCartStore((state) => state.currentEvent);
  const clearCart = useCartStore((state) => state.clearCart);

  const deleteTicket = useCartStore((state) => state.removeEventTicket);
  const groupedTickets = useMemo(
    () => useCartStore.getState().getGroupedEventTickets(),
    [eventTickets]
  );

  const renderItem = ({ item, index }: { item: Ticket; index: number }) => (
    <View accessible accessibilityLabel={`Event ${item.description}`}>
      <TicketItem
        key={`${item.id}-${index}`}
        ticket={item}
        eventObj={eventTickets!.event}
        onPress={() => deleteTicket(eventTickets!.event.id, index)}
      />
    </View>
  );
  const statusBarHeight = useStatusBarHeight();

  // payment initialization
  const [fetchPaymentSheetParams, { loading: eLoading }] = useMutation(
    INITIATE_PAYMENT,
    {
      onError: (error) => {
        console.log(error.message);
        ToastMsg(error.message, "Payment Initialization Failed");
      },
      onCompleted: async ({
        NewOrder: {
          data,
          clientSecret,
          customer,
          ephemeralKey,
          paymentIntentId,
        },
      }) => {
        if (data) {
          await initializePaymentSheet(
            clientSecret,
            customer,
            ephemeralKey,
            paymentIntentId,
            data.id
          );
        }
      },
    }
  );

  const [cancelOrder] = useMutation(CANCEL_ORDER_PAYMENT, {
    onError: (error) => {
      ToastMsg(error.message, "Cancel Payment Failed");
    },
  });

  const handlePayment = async () => {
    if (loading) return; // Prevent duplicate executions
    try {
      await fetchPaymentSheetParams({
        variables: {
          model: {
            events: groupedTickets,
            currency: "EUR",
            channel: "Stripe",
          },
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to process payment");
    }
    setLoading(false);
  };

  const initializePaymentSheet = async (
    paymentIntent: string,
    customer: string,
    ephemeralKey: string,
    paymentIntentId: string,
    orderId: string
  ) => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "SportSuite, Inc",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.name ?? "",
      },
    });

    if (!error) {
      setLoading(true);
    }

    const { error: eError } = await presentPaymentSheet();

    if (eError) {
      setLoading(false);
      // Cancel Order
      await cancelOrder({
        variables: {
          paymentIntentId,
          orderId,
        },
      });
      Alert.alert("Payment Error", eError.message);
    } else {
      router.push("/cartbase/payment-successful");
      clearCart(); // Clear on success
    }
  };

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: colorScheme === "dark" ? "#131214" : "#0052FF",
      }}
    >
      {/* Top Navigation */}
      <View className="justify-between items-center flex-row pb-4">
        <BackButtonBg />
        <Text className="font-montserratBold text-stone-50">Order Summary</Text>
      </View>

      {/* Disclaimer */}
      <Text className="font-montserratRegular py-6 text-white text-sm">
        Please confirm that this list meets your order expectations before
        proceeding to make payment.
      </Text>

      {eventTickets === null ? (
        <NotFoundContent
          title="Ooops!"
          subtitle="Your cart is looking a little light..."
          subtitleColor="text-white"
          titleColor="text-white"
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={eventTickets.tickets}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderItem}
          ListFooterComponent={
            <View>
              {loading ? (
                <CustomActivityIndicator color="white" size="large" />
              ) : (
                <Button
                  className="m-4"
                  onPress={handlePayment}
                  title={`Pay ${formatCurrency(getTotalPrice())}`}
                  size="medium"
                  textSize="text-lg"
                  padding="py-6"
                  textFont="font-montserratBold"
                  color={"bg-Accent"}
                  textColor="text-black"
                  loading={eLoading}
                />
              )}
              <Button
                className="m-4"
                onPress={clearCart}
                title={`Cancel Order`}
                size="medium"
                textFont="font-montserratMedium"
                color={"bg-transparent"}
                textColor="text-white"
              />
            </View>
          }
        />
      )}
    </View>
  );
};

export default CartHome;
