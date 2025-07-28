import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/shared/BackButton";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import VerifyOTP from "@/components/shared/VerifyOTP";
import { getSize } from "@/utils/useScaleSize";
import ResendOTP from "@/components/shared/ResendOTP";
import { useSearchParams } from "expo-router/build/hooks";
import { obfuscateEmail } from "@/utils/obfuscateEmail";
import { formatCountdownTime } from "@/utils/formatCountdownTime";
import { useMutation } from "@apollo/client";
import {
  RESEND_LOGIN_CODE,
  VERIFY_LOGIN,
} from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useAuth } from "@/store/context/auth-context";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const EmailVerify = () => {
  const { authenticate } = useAuth();
  const params = useSearchParams();
  const email = params.get("email");

  const initialTime = 2 * 60 + 15; // 2:15 in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(true); // Track if the timer is running

  const [otp, setOtp] = useState<string>("");

  const [ResendLoginCode] = useMutation(RESEND_LOGIN_CODE, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email");
    },
    onCompleted: (d) => {
      if (d) {
        const data = d.ResendLoginCode;
        if (data) {
          //  make toast
          ToastMsg("OTP Resent", "OTP Resent", "success");
        } else {
          ToastMsg("Something went wrong, please try again!", "OTP Resent");
        }
      }
    },
  });

  const [VerifyLogin, { loading }] = useMutation(VERIFY_LOGIN, {
    onError: (error) => {
      ToastMsg(error.message, "Error verifying email");
    },
    onCompleted: async (d) => {
      if (d) {
        const { data, token } = d.VerifyLogin;
        if (data) {
          await authenticate(token, data);
          router.replace("/(app)/");
        }
      }
    },
  });

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

  // Reset the timer to 2:15 and start it again
  const handleResend = async () => {
    setTimeLeft(initialTime); // Reset to 2:15
    setTimerRunning(true); // Start the timer
    // login request
    await ResendLoginCode({
      variables: {
        username: email,
      },
    });
  };
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
              Email Verification
            </Text>
          </View>

          {/* Main content */}
          <View
            className="items-center flex-1 p-5 bg-white dark:bg-Dark"
            style={{ borderRadius: 40 }}
          >
            <View className="justify-center h-1/2">
              <Image
                className="self-center mb-4"
                source={require("../../assets/icons/email-verify-icon.png")}
                style={{
                  width: getSize(22.32, "width"),
                  height: getSize(22.32, "width"),
                }}
              />
              <Text className="text-2xl text-center font-montserratBold dark:text-white">
                Email Verification
              </Text>
              <Text className="px-10 py-2 text-base text-center font-montserratRegular dark:text-white">
                {`A verification code has been sent to ${obfuscateEmail(
                  email!
                )}`}
              </Text>

              <Text className="py-2 text-lg text-center font-montserratSemiBold dark:text-white">
                {formatCountdownTime(timeLeft)}
              </Text>
            </View>
            <View className="flex h-1/2">
              <VerifyOTP onComplete={(otp: string) => setOtp(otp)} />

              {/* Resend  */}
              <ResendOTP
                timeLeft={timeLeft}
                onResendOTP={() => {
                  if (timeLeft === 0) {
                    handleResend();
                  }
                }}
              />

              {loading ? (
                <CustomActivityIndicator />
              ) : (
                <Button
                  onPress={async () => {
                    if (otp.length === 4) {
                      await VerifyLogin({
                        variables: {
                          username: email,
                          token: otp,
                        },
                      });
                    } else {
                      alert("Please enter a valid OTP code");
                    }
                  }}
                  title="Continue"
                  size="medium"
                  textSize="text-lg"
                  padding="py-6"
                  borderRadius="rounded-3xl"
                  textFont="font-montserratBold"
                  color={`${
                    otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"
                  }`}
                />
              )}
            </View>
          </View>

          {/* Footer */}

          <View className="flex-row items-center justify-between py-6"></View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EmailVerify;
