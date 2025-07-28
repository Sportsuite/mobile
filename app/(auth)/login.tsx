import {
  Text,
  SafeAreaView,
  ImageBackground,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import InputField from "@/components/shared/InputField";
import Button from "@/components/shared/Button";
import BackButton from "@/components/shared/BackButton";
import { router } from "expo-router";
import { getSize } from "@/utils/useScaleSize";
import { Image } from "expo-image";
import { useMutation } from "@apollo/client";
import { LOGIN_REQUEST } from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { StatusBar } from "expo-status-bar";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [Login, { loading }] = useMutation(LOGIN_REQUEST, {
    onError: (error) => {
      ToastMsg(error.message, "Login Failed");
    },
    onCompleted: (d) => {
      if (d) {
        const data = d.LoginRequest;
        if (data) {
          router.push({
            pathname: "email-verify",
            params: {
              email: email,
              referrer: "login",
            },
          });
        } else {
          alert("Something went wrong, please try again!");
        }
      }
    },
  });

  const handlePress = () => {
    if (!router.canGoBack()) {
      router.replace("landing");
    } else {
      router.back();
    }
  };
  const statusBarHeight = useStatusBarHeight();
  return (
    <SafeAreaView className="flex-1 bg-Primary dark:bg-Dark">
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../assets/images/background_pattern.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View
          className="flex-row items-center justify-between py-4"
          style={{
            marginTop: statusBarHeight,
          }}
        >
          {/* Back Button */}
          <BackButton onPress={handlePress} />
          {/* Centered text */}
          <Text className="text-center text-white font-montserratMedium">
            Account Login
          </Text>

          <Button
            onPress={() => router.replace("sign-up")}
            title="Sign Up"
            color="transparent"
            textFont="font-montserratBold"
            size="small"
            textColor="text-LightBlue"
          />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? statusBarHeight : 0}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header */}

            {/* Main content */}
            <View
              className="flex-1 p-5 bg-white dark:bg-Dark"
              style={{ borderRadius: 40 }}
            >
              <View className="justify-center h-1/3">
                <Image
                  source={require("../../assets/icons/logo_primary.png")}
                  style={{
                    width: getSize(48.13, "width"),
                    height: getSize(4.9, "height"),
                    alignSelf: "center",
                  }}
                  contentFit="contain"
                />
                <Text className="text-2xl text-center mt-16 font-montserratBold dark:text-white">
                  Login to continue
                </Text>
                <Text className="py-2 text-xs text-center font-montserratRegular dark:text-white">
                  Login to explore amazing events
                </Text>
              </View>
              <View className=" h-2/3">
                <View className="mt-12">
                  <InputField
                    type="text"
                    placeholder="Enter email"
                    onValueChange={(text) =>
                      setEmail(text.toLowerCase().trim())
                    }
                    value={email}
                    title={"Email Address"}
                  />

                  <View className="my-8">
                    <InputField
                      type="password"
                      placeholder="Enter password"
                      onValueChange={(text) => setPassword(text)}
                      value={password}
                      title={"Password"}
                    />
                  </View>

                  {loading ? (
                    <CustomActivityIndicator size="large" />
                  ) : (
                    <Button
                      onPress={async () => {
                        if (!email || !password) {
                          alert("Email and Password fields are reuiqred");
                        } else {
                          await Login({
                            variables: {
                              username: email,
                              password: password,
                            },
                          });
                        }
                      }}
                      title="Login"
                      size="medium"
                      textSize="text-lg"
                      borderRadius="rounded-xl"
                      textFont="font-montserratBold"
                      padding="py-6"
                      color={`${
                        email && password ? "bg-Primary" : "bg-LightPrimary"
                      }`}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between py-6">
              <Button
                title="Forget your password?"
                color="transparent"
                textFont="font-montserratRegular"
                size="small"
                textColor="text-LightBlue"
              />

              <Button
                onPress={() => router.push("account-reset")}
                title="Reset It"
                color="transparent"
                textFont="font-montserratBold"
                size="small"
                textColor="text-LightBlue"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;
