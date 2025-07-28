import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BackButton from "@/components/shared/BackButton";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "@/components/shared/Button";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import InputField from "@/components/shared/InputField";
import { useMutation } from "@apollo/client";
import { NEW_PASSWORD_CHANGE } from "@/graphql/mutations/user.mutate";
import { router } from "expo-router";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setconfirmNewPassword] = useState<string>("");
  const bottomSheetRef = useRef<any>(null);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();
  const [ChangePassword, { loading }] = useMutation(NEW_PASSWORD_CHANGE, {
    onError: (error) => {
      ToastMsg(error.message, "Error changing password");
    },
    onCompleted: (d) => {
      if (d) {
        const { token } = d.NewPasswordChange;
        setShowBottomSheet(true);
      }
    },
  });

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      router.back();
    }
  };

  const UpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      ToastMsg("All input fields are required", "Warning", "info");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      ToastMsg(
        "New and confirm password does not match, please check and try again",
        "Warning",
        "info"
      );

      return;
    }

    await ChangePassword({
      variables: { currentPassword: currentPassword, password: newPassword },
    });
  };

  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
      }}
    >
      {/* Header */}
      <View className="mt-2 mb-8 ml-2">
        <BackButton iconSize={32} iconColor="gray" />
      </View>

      <ScrollView>
        {/* Title and Description */}
        <View className="m-2">
          <Text className="text-3xl font-montserratBold dark:text-white">
            Change Password
          </Text>
          <Text className="text-sm font-montserratRegular text-Gray dark:text-stone-200">
            Change password securely and seamlessly
          </Text>
        </View>

        {/* Logo */}
        <View className="items-center mt-12">
          <Image
            className="self-center mt-20 mb-4"
            source={require("../../../assets/icons/reset-password.png")}
            style={{
              width: getSize(30.2, "width"),
              height: getSize(30.2, "width"),
            }}
          />
        </View>

        {/* Input Fields Section */}
        <View className="mx-4 my-8">
          <InputField
            type="password"
            placeholder="Enter old password"
            onValueChange={(text) => setCurrentPassword(text)}
            value={currentPassword}
            title={"Enter old password"}
            containerExtraStyle="mb-8"
          />

          <InputField
            type="password"
            placeholder="Enter new password"
            onValueChange={(text) => setNewPassword(text)}
            value={newPassword}
            title={"New password"}
            containerExtraStyle="mb-8"
          />

          <InputField
            type="password"
            placeholder="Enter new password"
            onValueChange={(text) => setconfirmNewPassword(text)}
            value={confirmNewPassword}
            title={"Confirm password"}
            containerExtraStyle="mb-8"
          />

          {loading ? (
            <CustomActivityIndicator size="large" />
          ) : (
            <Button
              onPress={() => UpdatePassword()}
              title="Continue"
              size="medium"
              textSize="text-lg"
              padding="py-6"
              textFont="font-montserratBold"
              color={`${
                currentPassword && newPassword && confirmNewPassword
                  ? "bg-Primary"
                  : "bg-LightPrimary"
              }`}
            />
          )}
        </View>
      </ScrollView>

      {/* BottomSheet placed outside the SafeAreaView */}
      {showBottomSheet && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "50%"]}
        >
          {/* Dynamic content */}
          <View className="items-center p-4">
            <Image
              style={{
                width: getSize(46, "width"),
                height: getSize(46, "width"),
              }}
              source={require("../../../assets/icons/chat-check.png")}
            />
            <Text className="px-6 py-4 text-xl text-center font-montserratRegular text-Gray">
              Password updated successfully!
            </Text>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default UpdatePassword;
