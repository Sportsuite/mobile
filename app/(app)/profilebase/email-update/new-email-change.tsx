import { View, ScrollView, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import InputField from "@/components/shared/InputField";
import Button from "@/components/shared/Button";
import PageTitle from "@/components/shared/PageTitle";
import { useMutation } from "@apollo/client";
import { NEW_EMAIL_CHANGE_REQUEST } from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";

const NewEmailChange = () => {
  const [email, setEmail] = useState<string>("");

  const [NewEmailChange, { loading }] = useMutation(NEW_EMAIL_CHANGE_REQUEST, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email change");
    },
    onCompleted: (d) => {
      if (d) {
        const { data } = d.NewEmailChangeRequest;
        if (data) {
          router.push({
            pathname: "/profilebase/email-update/confirm-new-email",
            params: { email: email },
          });
        }
      }
    },
  });

  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <ScrollView>
        {/* Page title */}
        <PageTitle title="New Email Address" />

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
          <Text className="font-montserratRegular w-64 text-center py-4 text-Gray dark:text-white">
            Enter new email address to continue
          </Text>
        </View>
        <View className="mx-4 mt-16">
          <InputField
            type="text"
            placeholder="Enter email"
            onValueChange={(text) => setEmail(text.toLowerCase().trim())}
            value={email}
            title={"Enter your current email to continue"}
          />

          <View className="mt-12">
            {loading ? (
              <CustomActivityIndicator size="large" />
            ) : (
              <Button
                // onPress={() =>
                //   router.push("/profilebase/email-update/confirm-new-email")
                // }
                onPress={() => {
                  if (email) {
                    NewEmailChange({
                      variables: {
                        email: email,
                      },
                    });
                  } else {
                    ToastMsg("Email field is required", "Warning");
                  }
                }}
                title="Continue"
                size="medium"
                padding="py-6"
                textSize="text-lg"
                textFont="font-montserratBold"
                color={`${email ? "bg-Primary" : "bg-LightPrimary"}`}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewEmailChange;
