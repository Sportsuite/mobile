import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PageTitle from "../shared/PageTitle";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "../shared/Button";

import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@apollo/client";
import { DELETE_REVIEW } from "@/graphql/mutations/review.mutate";
import ToastMsg from "../shared/ToastMsg";
import { router } from "expo-router";
import CustomActivityIndicator from "../shared/CustomActivityIndicator";

interface DeleteReviewProps {
  item: Review;
}

export default function DeleteReview({ item }: DeleteReviewProps) {
  const statusBarHeight = useStatusBarHeight();

  const [DeleteReview, { loading }] = useMutation(DELETE_REVIEW, {
    onError: (error) => {
      ToastMsg(error.message, "Delete Review Failed");
    },
    onCompleted: ({ DeleteReviewRating: { data, message } }) => {
      if (data) {
        ToastMsg(message, "Review & Rating", "success");
        router.back();
      }
    },
  });

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
              source={require("../../assets/icons/review.png")}
            />
          </View>
          <Text className="font-montserratBold text-2xl mb-4">
            Review & Rating
          </Text>

          {/* start rating  */}
          <View>
            <Text className="font-montserratSemiBold mt-6">Rating</Text>
            <View className="flex-row space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= item?.rating ? "star" : "star-o"}
                  size={32}
                  color={star <= item?.rating ? "#facc15" : "#9ca3af"} // yellow-400 and gray-400
                />
              ))}
            </View>
          </View>

          <Text className="font-montserratBold mb-4 mt-6">
            How was your booking and service experience?
          </Text>

          <Text className="font-montserratMedium mb-4">
            {item?.comment ?? "No comment provided"}
          </Text>

          <View className="absolute bottom-20 right-0 left-0 mx-2">
            {loading ? (
              <CustomActivityIndicator />
            ) : (
              <Button
                onPress={async () => {
                  await DeleteReview({
                    variables: {
                      deleteReviewRatingId: item?.id,
                    },
                  });
                }}
                title="Delete Review"
                size="medium"
                padding="py-6"
                textSize="text-lg"
                textFont="font-montserratBold"
                color={"bg-white"}
                border="border border-Danger"
                textColor="text-Danger"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
