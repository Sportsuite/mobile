import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PageTitle from "@/components/shared/PageTitle";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { useSearchParams } from "expo-router/build/hooks";

type FeatureItem = {
  title: string;
  description: string;
};
const FEATURES: FeatureItem[] = [
  {
    title: "Event Booking",
    description: "Was booking easy and smooth in the app?",
  },
  {
    title: "Flight Booking",
    description: "Was the flight on time and service okay?",
  },
  {
    title: "Hotel Reservation",
    description: "Was hotel booking fast and hassle-free?",
  },
  {
    title: "Transportation",
    description: "Was the ride safe and the driver professional?",
  },
];

const Feature = ({ title, description }: FeatureItem) => (
  <Text className="font-montserratExtraBold mb-4">
    {title}: <Text className="font-montserratRegular">{description}</Text>
  </Text>
);

export default function RatingReview() {
  const params = useSearchParams();
  const orderId: string = params.get("orderId") || "";
  const statusBarHeight = useStatusBarHeight();
  return (
    <View
      className="bg-Primary flex-1 dark:bg-black"
      style={{ paddingTop: statusBarHeight }}
    >
      <PageTitle
        containerStyle="px-2 mb-4"
        title="Review & Rating"
        className="text-white px-2"
        bgBack
      />
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-Primary/10">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* content goes here */}
          <View className="justify-center items-center mt-12 mb-10">
            <Image
              style={{
                width: getSize(32, "width"),
                height: getSize(32, "width"),
              }}
              contentFit="contain"
              source={require("../../../assets/icons/review.png")}
            />
          </View>
          <Text className="font-montserratBold text-2xl mb-4">
            Why We Need Your Review and Rating
          </Text>
          <Text className="font-montserratMedium mb-4">
            Your rating helps others choose better and helps us improve.
          </Text>

          {/* List of features  */}
          {FEATURES.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}

          <View className="absolute bottom-20 right-0 left-0 mx-2">
            <Button
              onPress={() =>
                router.navigate({
                  pathname: "/ratingreviewbase/new-review",
                  params: { orderId: orderId },
                })
              }
              title="Rate Now"
              size="medium"
              padding="py-6"
              textSize="text-lg"
              textFont="font-montserratBold"
              color={"bg-Primary"}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
