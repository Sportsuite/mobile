import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DoubleIconTextButton from "@/components/shared/DoubleIconTextButton";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { useAuth } from "@/store/context/auth-context";
import PageTitle from "@/components/shared/PageTitle";

const About = () => {
  const { logout } = useAuth();
  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Page title */}
        <PageTitle title="About SportSuite" />
        <View className="items-center mt-12">
          <Image
            source={require("../../../assets/icons/logo_primary.png")}
            style={{
              width: getSize(48.13, "width"),
              height: getSize(4.9, "height"),
              alignSelf: "center",
            }}
            contentFit="contain"
          />
          {/* About Sportsuite */}
          <Text className="px-6 mt-16 text-sm text-center text-Gray font-montserratMedium dark:text-stone-300">
            Sportsuite is a mobile app designed for sports enthusiasts to
            effortlessly find and book sports events, tickets, flights, and
            hotels. With options for airport pick-up, drop-off, and venue
            transportation, Sportsuite provides a complete, affordable solution
            for planning and enjoying sports experiences, all in one place.
          </Text>
          {/* Lastest Version */}
          <Text className="my-16 text-gray-400">Version: 0.012</Text>
        </View>

        <View className="gap-3 mx-2 mb-4">
          <DoubleIconTextButton
            width={getSize(95, "width")}
            onPress={() =>
              router.push(
                `/webview?url=${encodeURI(
                  "https://www.privacypolicies.com/live/48377a6c-afd7-4862-84e6-00f7ee2af4ac"
                )}&title=${"Terms and Conditions"}&page=${"/(profile)/about"}`
              )
            }
            text="Terms & Conditions"
            bgColor="bg-LightGray"
            textFont="font-montserratMedium"
          />

          <DoubleIconTextButton
            width={getSize(95, "width")}
            onPress={() =>
              router.push(
                `/webview?url=${encodeURI(
                  "https://www.privacypolicies.com/live/48377a6c-afd7-4862-84e6-00f7ee2af4ac"
                )}&title=${"Refund Policy"}&page=${"/(profile)/about"}`
              )
            }
            text="Refund Policy"
            bgColor="bg-LightGray"
            textFont="font-montserratMedium"
          />

          <DoubleIconTextButton
            width={getSize(95, "width")}
            onPress={() =>
              router.push(
                `/webview?url=${encodeURI(
                  "https://www.privacypolicies.com/live/48377a6c-afd7-4862-84e6-00f7ee2af4ac"
                )}&title=${"Data Protection Policy"}&page=${"/(profile)/about"}`
              )
            }
            text="Data Protection Policy"
            bgColor="bg-LightGray"
            textFont="font-montserratMedium"
          />

          <DoubleIconTextButton
            width={getSize(95, "width")}
            onPress={logout}
            text="Logout"
            bgColor="bg-LightGray"
            textFont="font-montserratMedium"
          />

          <DoubleIconTextButton
            width={getSize(95, "width")}
            onPress={() => router.push("/profilebase/delete-account/delete")}
            text="Delete Account"
            bgColor="bg-LightGray"
            textFont="font-montserratMedium"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
