import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "@/components/shared/BackButton";
import CartButton from "@/components/shared/CartButton";
import PickUpDealItem from "@/components/Transportation/PickUpDealItem";
import Button from "@/components/shared/Button";
import { router } from "expo-router";

const BookTransportation = () => {
  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <View className="flex-row items-center justify-between mx-2 mt-2">
        <BackButton iconColor="black" iconSize={32} />
        <CartButton />
      </View>
      <View className="mx-4 my-10">
        <Text className="w-4/5 text-4xl font-montserratBold dark:text-white">
          Pick-Up Deals for You
        </Text>
        <Text className="py-2 text-Gray font-montserratRegular dark:text-stone-200">
          Find the most affordable pick-up from your location, customised just
          for you.
        </Text>
      </View>
      {/* Main */}
      <ScrollView className="mx-4 " showsVerticalScrollIndicator={false}>
        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination,
                  ensuring a comfortable and hassle-free arrival."
          title="Airport Pickup - $50"
        />
        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination, ensuring a comfortable and hassle-free arrival."
          title="Event Pickup - $150"
        />

        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination, ensuring a comfortable and hassle-free arrival."
          title="Airport Drop-off - $50"
        />

        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination,
                  ensuring a comfortable and hassle-free arrival."
          title="Airport Pickup - $50"
        />
        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination, ensuring a comfortable and hassle-free arrival."
          title="Event Pickup - $150"
        />

        <PickUpDealItem
          isToggled={false}
          onToggle={() => {}}
          desc="Seamless transport from airport to destination, ensuring a comfortable and hassle-free arrival."
          title="Airport Drop-off - $50"
        />
      </ScrollView>
      <Button
        className="m-4"
        onPress={() =>
          router.push("/profilebase/administration/transportation/check-in")
        }
        title="Continue"
        size="medium"
        textSize="text-lg"
        padding="py-6"
        textFont="font-montserratBold"
        color={"bg-Primary"}
        // color={`${otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"}`}
      />
    </SafeAreaView>
  );
};

export default BookTransportation;
