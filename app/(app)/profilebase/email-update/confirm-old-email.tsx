import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import VerifyOTP from "@/components/shared/VerifyOTP";
import ResendOTP from "@/components/shared/ResendOTP";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import PageTitle from "@/components/shared/PageTitle";
import { obfuscateEmail } from "@/utils/obfuscateEmail";
import { formatCountdownTime } from "@/utils/formatCountdownTime";
import { useAuth } from "@/store/context/auth-context";
import { useMutation } from "@apollo/client";
import {
  RESEND_CHANGE_EMAIL_CODE,
  VERIFY_EMAIL_CHANGE,
} from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";

const ConfirmOldEmail = () => {
  const [otp, setOtp] = useState<string>("");
  const { user } = useAuth();

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

  const [VerifyEmailChange, { loading }] = useMutation(VERIFY_EMAIL_CHANGE, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email change");
    },
    onCompleted: (data) => {
      if (data.VerifyEmailChangeToken.data) {
        router.push("/profilebase/email-update/new-email-change");
      }
    },
  });

  const [ResendCode] = useMutation(RESEND_CHANGE_EMAIL_CODE, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email change");
    },
    onCompleted: (data) => {
      if (data.ResendEmailChangeCode) {
        //  make toast
        ToastMsg("OTP Resent", "Resend OTP", "success");
      } else {
        ToastMsg("Something went wrong, please try again!", "Error");
      }
    },
  });

  // Reset the timer to 2:15 and start it again
  const handleResend = async () => {
    setTimeLeft(initialTime); // Reset to 2:15
    setTimerRunning(true); // Start the timer
    // request
    await ResendCode({
      variables: {
        username: user?.email,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 px-2 pt-6 bg-white dark:bg-Dark">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Page title */}
        <PageTitle title="Email Verification" />

        <View className="items-center mt-12">
          {/* Logo Icon goes here */}
          <Image
            className="self-center mt-20 mb-4"
            source={require("../../../../assets/icons/email-verify-icon.png")}
            style={{
              width: getSize(30.2, "width"),
              height: getSize(30.2, "width"),
            }}
          />
          <Text className="px-10 py-2 text-base text-center font-montserratRegular dark:text-white">
            {`A verification code has been sent to ${obfuscateEmail(
              user?.email!
            )}`}
          </Text>
        </View>

        {/* Main content */}
        <View className="mx-16 mt-8">
          <Text className="py-2 mb-8 text-lg text-center font-montserratSemiBold dark:text-white">
            {formatCountdownTime(timeLeft)}
          </Text>

          <VerifyOTP
            onComplete={(otp: string) => {
              setOtp(otp);
            }}
          />
          {/* Resend  */}
          <ResendOTP
            timeLeft={timeLeft}
            onResendOTP={() => {
              if (timeLeft === 0) {
                handleResend();
              }
            }}
          />
        </View>
        <View className="mx-6">
          {loading ? (
            <CustomActivityIndicator size="large" />
          ) : (
            <Button
              // onPress={() =>
              //   router.push("/profilebase/email-update/new-email-change")
              // }
              onPress={async () => {
                if (otp.length === 4) {
                  await VerifyEmailChange({
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmOldEmail;
