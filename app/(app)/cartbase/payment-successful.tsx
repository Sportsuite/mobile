import { View, Text, BackHandler, Animated, Easing } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "@/components/shared/Button";
import { router, useFocusEffect } from "expo-router";

export default function PaymentSuccessful() {
  const statusBarHeight = useStatusBarHeight();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Returning true disables the back button
      };

      // Add event listener and get the subscription
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Cleanup function
      return () => {
        backHandler.remove(); // Proper cleanup using the subscription
      };
    }, [])
  );

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1, // Final scale: 1 (original size)
      duration: 800,
      easing: Easing.out(Easing.cubic), // Smooth easing
      useNativeDriver: true, // Better performance
    }).start();
  }, []);

  return (
    <View
      className="flex-1 bg-Primary dark:bg-Dark"
      style={{ paddingTop: statusBarHeight, paddingBottom: 20 }}
    >
      <SafeAreaView
        className="flex-1 bg-white justify-center items-center dark:bg-white/10"
        style={{ borderRadius: 35 }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: getSize(43, "width"),
            height: getSize(43, "width"),
          }}
        >
          <Image
            source={require("../../../assets/images/verified.png")}
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>

        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
          className="mx-8 gap-3 my-8"
        >
          <Text className="font-montserratBold text-3xl text-center text-wrap dark:text-white">
            Order Completed Successfully!
          </Text>
          <Text className="text-center font-montserratRegular text-gray-400 dark:text-stone-200">
            Your payment was processed and your tickets are confirmed. Check
            your email for details.
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Button
            padding="p-6 my-8"
            size="large"
            title="View Bookings"
            textSize="text-lg"
            borderRadius="rounded-2xl"
            color="bg-white dark:bg-white/10"
            textColor="text-Primary dark:text-Accent"
            border="border-2 border-Primary dark:border-Accent"
            textFont="font-montserratBold"
            onPress={() =>
              router.navigate({
                pathname: "/eventsbase/booked-events",
                params: { reset: "true" },
              })
            }
          />

          <Button
            padding="p-4"
            size="medium"
            title="Goto Home"
            textSize="text-2xl"
            borderRadius="rounded-xl"
            color="bg-white dark:bg-transparent"
            textColor="text-Primary dark:text-Accent"
            textFont="font-montserratBold"
            onPress={() =>
              router.navigate({
                pathname: "/home",
                params: { reset: "true" },
              })
            }
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
