import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/shared/BackButton";
import CartButton from "@/components/shared/CartButton";
import PickUpDealItem from "@/components/Transportation/PickUpDealItem";
import Button from "@/components/shared/Button";
import { StatusBar } from "expo-status-bar";
import { GET_TRANSPORTATION_TYPES } from "@/graphql/queries/transportation.query";
import { useLazyQuery } from "@apollo/client";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { useCartStore } from "@/store";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import ToastMsg from "@/components/shared/ToastMsg";
import { router } from "expo-router";

const BookTransportation = () => {
  const [transports, setTransports] = useState<TransportationConfig[]>([]);
  const [selectedTransports, setSelectedTransports] = useState<{
    [key: string]: boolean;
  }>({});

  // Lazy query to fetch event transport types
  const [getTransports, { loading }] = useLazyQuery(GET_TRANSPORTATION_TYPES, {
    onError: (error) => {
      ToastMsg(error.message, "Fetching Event Transport Types Failed");
    },
    onCompleted: (d) => {
      if (d) {
        const { data } = d.GetTransportationConfigs;
        setTransports(data);

        // Initialize selectedTransports state
        const initialSelectedTransports = data.reduce(
          (
            acc: { [key: string]: boolean },
            transport: TransportationConfig
          ) => {
            acc[transport.id] = false;
            return acc;
          },
          {}
        );
        setSelectedTransports(initialSelectedTransports);
      }
    },
  });

  // Calculate total cost of selected transports
  const totalCost = transports.reduce((total, transport) => {
    if (selectedTransports[transport.id]) {
      return (
        parseFloat(total.toString()) + parseFloat(transport.price.toString())
      );
    }
    return total;
  }, 0);

  // Handle toggling of transport options
  const handleToggle = (transport: TransportationConfig) => {
    setSelectedTransports((prev) => {
      const updatedSelection = { ...prev };

      if (updatedSelection[transport.id]) {
        delete updatedSelection[transport.id]; // Remove from selected
        // removeItem(transport.id); // Remove from cart
      } else {
        updatedSelection[transport.id] = true; // Add to selected
        // addItem({
        //   id: transport.id,
        //   type: "transportation",
        //   title: transport.title,
        //   price: transport.price,
        //   quantity: 1,
        // }); // Add to cart
      }

      return updatedSelection;
    });
  };

  useEffect(() => {
    getTransports();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-2 bg-white dark:bg-black">
      <StatusBar style="auto" />
      <View className="flex-row items-center justify-between mr-2 mt-2">
        <BackButton iconColor="black" iconSize={32} />
        <CartButton />
      </View>
      <View className="mx-4 my-8">
        <Text className="w-4/5 text-4xl font-montserratBold dark:text-stone-50">
          Pick-Up Deals for You
        </Text>
        <Text className="py-2 text-Gray font-montserratRegular dark:text-stone-200">
          Find the most affordable pick-up from your location, customised just
          for you.
        </Text>
      </View>
      {/* Main */}
      <ScrollView className="mx-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <CustomActivityIndicator size="large" className="py-32" />
        ) : transports.length > 0 ? (
          transports.map((transport) => (
            <PickUpDealItem
              key={transport.id}
              desc={transport.desc}
              title={`${transport.title} - $${transport.price}`}
              isToggled={selectedTransports[transport.id]}
              onToggle={() => handleToggle(transport)}
            />
          ))
        ) : (
          !loading && (
            <View className="flex-1 items-center justify-center py-20">
              <Image
                source={require("../../../assets/icons/not_found.png")}
                style={{
                  width: getSize(50, "width"),
                  height: getSize(50, "width"),
                }}
                contentFit="contain"
              />
              <Text className="font-montserratSemiBold text-3xl">Ooops!</Text>
              <Text className="font-montserratRegular py-4 px-16 text-center">
                No Transporation types available for this event yet, Please
                check back later.
              </Text>
            </View>
          )
        )}
      </ScrollView>

      <Button
        icon={
          <MaterialCommunityIcons
            name="cart-variant"
            size={28}
            color={"white"}
          />
        }
        className="m-4"
        onPress={() => router.push("/cartbase/cart-home")}
        // router.push("/profilebase/administration/transportation/check-in")
        title={`Checkout`}
        size="medium"
        textSize="text-lg"
        padding="py-6"
        textFont="font-montserratBold"
        color={"bg-Primary"}
        // color={`${otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"}`}
      />
      {/* {totalCost > 0 ? (
        <Button
          icon={
            <MaterialCommunityIcons
              name="cart-variant"
              size={28}
              color={"white"}
            />
          }
          className="m-4"
          onPress={() => router.push("/cartbase/cart-home")}
          // router.push("/profilebase/administration/transportation/check-in")
          title={`Checkout`}
          size="medium"
          textSize="text-lg"
          padding="py-6"
          textFont="font-montserratBold"
          color={"bg-Primary"}
          // color={`${otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"}`}
        />
      ) : (
        <Button
          className="m-4"
          onPress={() => console.log("Skip")}
          // router.push("/profilebase/administration/transportation/check-in")
          title={`Skip`}
          size="medium"
          textSize="text-lg"
          padding="py-6"
          textFont="font-montserratBold"
          color={"bg-LightGray"}
          textColor="text-Primary"
        />
      )} */}
    </SafeAreaView>
  );
};

export default BookTransportation;
