import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/shared/BackButton";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import InputField from "@/components/shared/InputField";
import { PASSWORD_RESET_REQUEST } from "@/graphql/mutations/user.mutate";
import { useMutation } from "@apollo/client";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const AccountReset = () => {
  const [email, setEmail] = useState<string>("");
  const [ResetPasswordRequest, { loading }] = useMutation(
    PASSWORD_RESET_REQUEST,
    {
      onError: (error) => {
        ToastMsg(error.message, "Error verifying password");
      },
      onCompleted: (d) => {
        if (d) {
          const data = d.PasswordResetRequest;
          if (data) {
            router.push({
              pathname: "/reset-verify-email",
              params: {
                email: email,
              },
            });
          }
        }
      },
    }
  );
  const statusBarHeight = useStatusBarHeight();
  return (
    <SafeAreaView className="flex-1 bg-Primary dark:bg-Dark">
      <ImageBackground
        source={require("../../assets/images/background_pattern.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-center py-8"
            style={{
              marginTop: statusBarHeight,
            }}
          >
            {/* Back Button */}
            <BackButton className="absolute left-5" />
            {/* Centered text */}
            <Text className="text-center text-white font-montserratMedium">
              Account Reset
            </Text>
          </View>

          {/* Main content */}
          <View
            className="flex-1 p-5 bg-white dark:bg-Dark"
            style={{ borderRadius: 40 }}
          >
            <Image
              className="self-center mt-20 mb-4"
              source={require("../../assets/icons/account-reset-icon.png")}
              style={{ width: 98, height: 98 }}
            />
            <Text className="text-2xl text-center font-montserratBold dark:text-white">
              Account Reset
            </Text>
            <Text className="px-10 py-2 text-base text-center font-montserratRegular dark:text-white">
              The system will send a verification code to your email address, be
              sure to check both inbox and spam folders.
            </Text>

            <View className="mt-12">
              <InputField
                type="text"
                placeholder="Enter email"
                onValueChange={(text) => setEmail(text.toLowerCase().trim())}
                value={email}
                title={"Enter your email to continue"}
              />

              <View className="mt-12">
                {loading ? (
                  <CustomActivityIndicator />
                ) : (
                  <Button
                    onPress={async () => {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!email) {
                        alert("Email field is required");
                        return;
                      }
                      if (!emailRegex.test(email)) {
                        alert("Please enter a valid email address");
                        return;
                      }

                      //  initiate reset request
                      await ResetPasswordRequest({
                        variables: {
                          username: email,
                        },
                      });
                    }}
                    title="Continue"
                    size="medium"
                    padding="py-6"
                    textSize="text-lg"
                    borderRadius="rounded-3xl"
                    textFont="font-montserratBold"
                    color={`${email ? "bg-Primary" : "bg-LightPrimary"}`}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between py-6">
            <Button
              title="Remember  your password? "
              color="transparent"
              textFont="font-montserratRegular"
              size="small"
              textColor="text-LightBlue"
            />

            <Button
              onPress={() => router.replace("login")}
              title="Login"
              color="transparent"
              textFont="font-montserratBold"
              size="small"
              textColor="text-LightBlue"
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AccountReset;
