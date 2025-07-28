import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import BackButton from "@/components/shared/BackButton";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import InputField from "@/components/shared/InputField";
import { useMutation } from "@apollo/client";
import { CREATE_ACCOUNT } from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { StatusBar } from "expo-status-bar";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import PopUpModalSelector from "@/components/shared/PopUpModalSelector";
import ToastMsg from "@/components/shared/ToastMsg";

const SignUp = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [gender, setGender] = useState<string | null>(null);
  const genders = [
    { id: "Rather not say", name: "Rather not say" },
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
    { id: "Others", name: "Others" },
  ];

  const handleSelectGender = (gender: Gender) => {
    setGender(gender.name);
  };

  const [SignUp, { loading }] = useMutation(CREATE_ACCOUNT, {
    onError: (error) => {
      ToastMsg(error.message, "Error signing up");
    },
    onCompleted: (d) => {
      if (d) {
        const data = d.NewAccount;
        if (data) {
          router.push({
            pathname: "email-verify",
            params: {
              email: email,
              referrer: "signup",
            },
          });
        } else {
          alert("Something went wrong, please try again!");
        }
      }
    },
  });
  const statusBarHeight = useStatusBarHeight();

  return (
    <SafeAreaView className="flex-1 bg-Primary dark:bg-Dark">
      <ImageBackground
        source={require("../../assets/images/background_pattern.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? statusBarHeight : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View
              className="flex-row items-center justify-center py-6"
              style={{ marginTop: statusBarHeight }}
            >
              <StatusBar style="light" />
              <BackButton className="absolute left-5" />
              <Text className="text-center text-white font-montserratMedium">
                Create Account
              </Text>
            </View>

            {/* Main Content */}
            <View
              className="flex-1 p-5 bg-white dark:bg-Dark"
              style={{ borderRadius: 40 }}
            >
              <Text className="mt-6 text-2xl font-montserratBold dark:text-white">
                Account Sign up
              </Text>
              <Text className="py-2 text-small font-montserratRegular dark:text-white">
                Create an account with us to explore amazing events
              </Text>

              <View className="mt-6">
                <InputField
                  type="text"
                  placeholder="Enter name"
                  onValueChange={(text) => setName(text)}
                  value={name}
                  title={"Name"}
                />

                <View className="mt-6">
                  <Text className="pb-1 font-montserratRegular text-Gray dark:text-white">
                    Gender
                  </Text>
                  <PopUpModalSelector<Gender>
                    placeholder="Select Gender"
                    items={genders}
                    itemLabelKey="name" // Use 'name' as the key for labels
                    onSelect={(gender) => handleSelectGender(gender)}
                  />
                </View>

                <View className="mt-6">
                  <InputField
                    type="text"
                    placeholder="Enter email"
                    onValueChange={(text) =>
                      setEmail(text.toLowerCase().trim())
                    }
                    value={email}
                    title={"Email Address"}
                  />
                </View>

                <View className="mt-6">
                  <InputField
                    type="number"
                    placeholder="Enter mobile number"
                    onValueChange={(text) => setPhone(text.trim())}
                    value={phone}
                    title={"Mobile Number"}
                  />
                </View>

                <View className="mt-6">
                  <InputField
                    type="password"
                    placeholder="Enter password"
                    onValueChange={(text) => setPassword(text.trim())}
                    value={password}
                    title={"Password"}
                  />
                </View>

                <Text className="my-6 text-sm font-montserratRegular text-Gray dark:text-white">
                  By creating account, you have agreed with our{" "}
                  <Text className="text-Primary font-montserratSemiBold">
                    term and conditions
                  </Text>
                </Text>

                {loading ? (
                  <CustomActivityIndicator className="py-4" />
                ) : (
                  <Button
                    onPress={async () => {
                      if (!email || !password || !name || !phone || !gender) {
                        alert("All fields are required");
                      } else {
                        const input = {
                          admin: false,
                          email: email,
                          gender: gender,
                          name: name,
                          password: password,
                          phone: phone,
                        };

                        await SignUp({
                          variables: {
                            model: input,
                          },
                        });
                      }
                    }}
                    title="Continue"
                    size="medium"
                    padding="py-6"
                    textSize="text-lg"
                    borderRadius="rounded-xl"
                    textFont="font-montserratBold"
                    color={`${
                      name && email && phone && password && gender
                        ? "bg-Primary"
                        : "bg-LightPrimary"
                    }`}
                  />
                )}
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between pt-6 pb-4 px-5">
              <Button
                title="Already have an account?"
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
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;
