import { View, ScrollView, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "@/components/shared/Button";
import PageTitle from "@/components/shared/PageTitle";
import { REQUEST_EMAIL_CHANGE } from "@/graphql/mutations/user.mutate";
import { useMutation } from "@apollo/client";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";

const OldEmailChange = () => {
  const [RequestEmailChange, { loading }] = useMutation(REQUEST_EMAIL_CHANGE, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email change");
    },
    onCompleted: (data) => {
      if (data.RequestEmailChange.data) {
        router.push({
          pathname: "/profilebase/email-update/confirm-old-email",
        });
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <ScrollView>
        {/* Page title */}
        <PageTitle title="Change Email" />
        <View className="items-center mt-12">
          {/* Logo Icon goes here */}
          <Image
            className="self-center mt-20 mb-4"
            source={require("../../../../assets/icons/email-change.png")}
            style={{
              width: getSize(30.2, "width"),
              height: getSize(30.2, "width"),
            }}
          />
          <Text className="font-montserratRegular w-64 text-center py-4 text-Gray dark:text-stone-200">
            Change your current email address securely
          </Text>

          <View className="pt-8 items-center justify-center">
            <Text className="font-montserratBold text-center dark:text-stone-200">
              Request for email change?
            </Text>
            <Text className="font-montserratRegular text-center pt-6 px-14 dark:text-stone-200">
              A verification code will be sent to your current email address
            </Text>
          </View>
        </View>
        <View className="mx-4 mt-4">
          <View className="mt-12">
            {loading ? (
              <CustomActivityIndicator size="large" />
            ) : (
              <Button
                onPress={RequestEmailChange}
                // onPress={() =>
                //   router.push({
                //     pathname: "/profilebase/email-update/confirm-old-email",
                //   })
                // }
                title="Continue"
                size="medium"
                padding="py-6"
                textSize="text-lg"
                textFont="font-montserratBold"
                color={"bg-Primary"}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OldEmailChange;
