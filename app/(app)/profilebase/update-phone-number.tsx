import { View, Text, ScrollView, useColorScheme } from "react-native";
import React, { useRef, useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import InputField from "@/components/shared/InputField";
import Button from "@/components/shared/Button";
import { useMutation } from "@apollo/client";
import { UPDATE_PHONE_NUMBER } from "@/graphql/mutations/user.mutate";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useAuth } from "@/store/context/auth-context";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const UpdatePhoneNumber = () => {
  const { updateUser, user } = useAuth();
  const [phone, setPhone] = useState<string>(user!.phone);
  const [showBottomModal, setShowBottomModal] = useState<boolean>(false);
  const statusBarHeight = useStatusBarHeight();

  const colorScheme = useColorScheme();

  const [UpdatePhoneNumber, { loading }] = useMutation(UPDATE_PHONE_NUMBER, {
    onError: (error) => {
      ToastMsg(error.message, "Update Phone Number Failed");
    },
    onCompleted: (d) => {
      if (d) {
        updateUser({ phone });
        setShowBottomModal(true);
      }
    },
  });

  const bottomSheetRef = useRef<any>(null);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setPhone("");
      router.back();
    }
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
      <ScrollView>
        {/* Page title */}
        <PageTitle title="Update Mobile" />
        <View className="items-center mt-12">
          {/* Logo Icon goes here */}
          <Image
            className="self-center mt-20 mb-4"
            source={require("../../../assets/icons/email-change.png")}
            style={{
              width: getSize(30.2, "width"),
              height: getSize(30.2, "width"),
            }}
          />
          <Text className="font-montserratRegular w-64 text-center py-4 text-Gray">
            Change your phone number securely and seamlessly
          </Text>
        </View>
        <View className="mx-4 mt-16">
          <InputField
            type="number"
            placeholder="Mobile number eg. +2347064655443"
            onValueChange={(text) => setPhone(text)}
            value={phone}
            title={"Enter new mobile number"}
          />

          <View className="mt-12">
            {loading ? (
              <CustomActivityIndicator size="large" />
            ) : (
              <Button
                onPress={() => {
                  UpdatePhoneNumber({
                    variables: {
                      mobile: phone,
                    },
                  });
                }}
                title="Continue"
                size="medium"
                padding="py-6"
                textSize="text-lg"
                textFont="font-montserratBold"
                color={`${phone ? "bg-Primary" : "bg-LightPrimary"}`}
              />
            )}
          </View>
        </View>
      </ScrollView>
      {/* BottomSheet placed outside the scrollview */}
      {showBottomModal && (
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
              Phone number updated successfully!
            </Text>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default UpdatePhoneNumber;
