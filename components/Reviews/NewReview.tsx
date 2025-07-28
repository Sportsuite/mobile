import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PageTitle from "../shared/PageTitle";

import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import { useMutation } from "@apollo/client";
import { NEW_REVIEW } from "@/graphql/mutations/review.mutate";
import ToastMsg from "../shared/ToastMsg";
import { router } from "expo-router";
import CustomActivityIndicator from "../shared/CustomActivityIndicator";

interface MakeNewReviewProps {
  orderId: string;
}

export default function MakeNewReview({ orderId }: MakeNewReviewProps) {
  const statusBarHeight = useStatusBarHeight();
  const [reviewInput, setReviewInput] = useState("");
  const [stayAnon, setStayAnon] = useState(false);
  const [rating, setRating] = useState<number>(0);

  const [NewReview, { loading }] = useMutation(NEW_REVIEW, {
    onError: (error) => {
      ToastMsg(error.message, "New Review Failed");
    },
    onCompleted: ({ NewReviewRating: { data, message } }) => {
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
        title="New Review & Rating"
        className="text-white px-2"
        bgBack
      />
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-Primary/10">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* content goes here */}

          <Text className="font-montserratBold text-2xl mt-6 mb-2">
            Rate Your Experience
          </Text>
          <Text className="font-montserratRegular text-sm mb-4">
            Tell us what went well or what could be better. Your feedback helps
            us improve.
          </Text>

          {/* start rating  */}
          <View>
            <Text className="font-montserratSemiBold">Star rating (1–5)</Text>
            <View className="flex-row space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={32}
                    color={star <= rating ? "#facc15" : "#9ca3af"} // yellow-400 and gray-400
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* review input */}
          <View className="mt-8">
            <Text className="font-montserratRegular pt-6 pb-2 text-sm">
              How was your booking and service experience? (Optional)
            </Text>
            <InputField
              containerExtraStyle="bg-LightGray"
              type="text"
              onValueChange={(text) => setReviewInput(text)}
              value={reviewInput}
              multiline
              placeholder="Enter your review about our services here...."
            />
          </View>

          {/* stay anonymous */}
          <View className="bg-LightGray rounded-xl my-8 py-8 px-4">
            <TouchableOpacity
              onPress={() => setStayAnon(!stayAnon)}
              activeOpacity={0.8}
              className="flex-row items-center"
            >
              {stayAnon ? (
                <AntDesign name="checksquareo" size={24} color="black" />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={28}
                  color="black"
                />
              )}
              <Text className="ml-2 font-montserratSemiBold text-sm">
                Review as anonymous
              </Text>
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-20 right-0 left-0 mx-2">
            {loading ? (
              <CustomActivityIndicator />
            ) : (
              <Button
                onPress={async () => {
                  await NewReview({
                    variables: {
                      model: {
                        comment: reviewInput,
                        rating: rating,
                        order: orderId,
                      },
                    },
                  });
                }}
                title="Submit Review"
                size="medium"
                padding="py-6"
                textSize="text-lg"
                textFont="font-montserratBold"
                color={"bg-Primary"}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
