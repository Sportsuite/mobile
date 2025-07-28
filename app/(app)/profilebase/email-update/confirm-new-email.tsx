import { View, Text, useColorScheme } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import VerifyOTP from "@/components/shared/VerifyOTP";
import ResendOTP from "@/components/shared/ResendOTP";
import Button from "@/components/shared/Button";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import PageTitle from "@/components/shared/PageTitle";
import { formatCountdownTime } from "@/utils/formatCountdownTime";
import { VERIFY_NEW_EMAIL_CHANGE_REQUEST } from "@/graphql/mutations/user.mutate";
import { useMutation } from "@apollo/client";
import { useAuth } from "@/store/context/auth-context";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const ConfirmNewEmail = () => {
  const [otp, setOtp] = useState<string>("");
  const bottomSheetRef = useRef<any>(null);
  const { updateUser } = useAuth();
  const colorScheme = useColorScheme();
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);

  const initialTime = 2 * 60 + 15; // 2:15 in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(true); // Track if the timer is running

  useEffect(() => {
    if (!timerRunning) return; // Don't run the interval if timer is not running

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Stop the interval when time reaches 0
          setTimerRunning(false); // Stop the timer
          return prevTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [timerRunning]);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      router.replace("/profile");
    }
  };

  const [VerifyNewEmailChange, { loading }] = useMutation(
    VERIFY_NEW_EMAIL_CHANGE_REQUEST,
    {
      onError: (error) => {
        ToastMsg(error.message, "Verify New Email Failed");
      },
      onCompleted: (data) => {
        if (data.VerifyNewEmailChangeToken.data) {
          const { email } = data.VerifyNewEmailChangeToken.data;
          updateUser({ email });
          setIsBottomSheetVisible(true);
        }
      },
    }
  );
  const statusBarHeight = useStatusBarHeight();
  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
        paddingHorizontal: 2,
      }}
    >
      {/* Page title */}
      <PageTitle title="Code Verification" />

      {/* Logo */}
      <View className="items-center mt-12">
        <Image
          className="self-center mt-20 mb-4"
          source={require("../../../../assets/icons/email-verify-icon.png")}
          style={{
            width: getSize(30.2, "width"),
            height: getSize(30.2, "width"),
          }}
        />
        <Text className="font-montserratRegular w-64 text-center py-4 text-Gray dark:text-white">
          Enter verification code sent to the new email address
        </Text>
      </View>

      {/* OTP Section */}
      <View className="mx-16 mt-8">
        <Text className="py-2 mb-8 text-lg text-center font-montserratSemiBold dark:text-white">
          {formatCountdownTime(timeLeft)}
        </Text>

        <VerifyOTP
          inputBackgroundColor="bg-LightBlue"
          onComplete={(otp: string) => {
            setOtp(otp);
          }}
        />
        <ResendOTP timeLeft={2} onResendOTP={() => {}} />
      </View>

      {/* Continue Button */}
      <View className="mx-6">
        {loading ? (
          <CustomActivityIndicator size="large" />
        ) : (
          <Button
            // onPress={() => {
            //   setIsBottomSheetVisible(true);
            // }}
            onPress={async () => {
              if (otp.length === 4) {
                await VerifyNewEmailChange({
                  variables: {
                    token: otp,
                  },
                });
              } else {
                ToastMsg("OTP field missing some numbers", "Warning", "info");
              }
            }}
            title="Continue"
            size="medium"
            textSize="text-lg"
            padding="py-6"
            textFont="font-montserratBold"
            color={`${otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"}`}
          />
        )}
      </View>

      {/* BottomSheet placed outside the SafeAreaView */}
      {isBottomSheetVisible && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["40%", "60%"]}
        >
          {/* Dynamic content */}
          <View className="items-center p-4">
            <Image
              style={{
                width: getSize(46, "width"),
                height: getSize(46, "width"),
              }}
              source={require("../../../../assets/icons/chat-check.png")}
            />
            <Text className="px-6 py-4 text-xl text-center font-montserratRegular text-Gray">
              You have successfully changed your email address.
            </Text>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default ConfirmNewEmail;
