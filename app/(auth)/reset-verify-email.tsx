import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Image,
  Alert,
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
  NEW_PASSWORD_RESET,
  RESEND_LOGIN_CODE,
} from "@/graphql/mutations/user.mutate";
import Toast from "react-native-root-toast";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useAuth } from "@/store/context/auth-context";
import InputField from "@/components/shared/InputField";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";

const ResetVerifyEmail = () => {
  const { authenticate } = useAuth();
  const params = useSearchParams();
  const email = params.get("email");

  const initialTime = 2 * 60 + 15; // 2:15 in seconds
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerRunning, setTimerRunning] = useState(true); // Track if the timer is running

  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [ResendLoginCode] = useMutation(RESEND_LOGIN_CODE, {
    onError: (error) => {
      ToastMsg(error.message, "Error sending OTP");
    },
    onCompleted: (d) => {
      if (d) {
        const data = d.ResendLoginCode;
        if (data) {
          //  make toast
          Toast.show("OTP Resent", {
            duration: Toast.durations.LONG,
          });
        } else {
          alert("Something went wrong, please try again!");
        }
      }
    },
  });

  const [NewPasswordReset, { loading }] = useMutation(NEW_PASSWORD_RESET, {
    onError: (error) => {
      ToastMsg(error.message, "Error resetting password");
    },
    onCompleted: (d) => {
      if (d) {
        const { data, token } = d.NewPasswordReset;
        if (data) {
          authenticate(token, data);
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
    // resend code request
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

          {/* OTP content */}
          {!showPassword ? (
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
                  {`A verification code has be sent ${obfuscateEmail(email!)}`}
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

                <Button
                  onPress={() => {
                    if (otp.length === 4) {
                      setShowPassword(true);
                    } else {
                      alert("Please enter a valid OTP code");
                    }
                  }}
                  title="Next"
                  size="medium"
                  textSize="text-lg"
                  padding="py-6"
                  borderRadius="rounded-3xl"
                  textFont="font-montserratBold"
                  color={`${
                    otp.length === 4 ? "bg-Primary" : "bg-LightPrimary"
                  }`}
                />
              </View>
            </View>
          ) : (
            <View className="py-16 p-5 bg-white" style={{ borderRadius: 40 }}>
              <View className="justify-center h-1/2">
                <Image
                  className="self-center mb-4"
                  source={require("../../assets/icons/email-verify-icon.png")}
                  style={{
                    width: getSize(22.32, "width"),
                    height: getSize(22.32, "width"),
                  }}
                />
                <Text className="text-2xl text-center font-montserratBold">
                  Password Reset
                </Text>
              </View>
              <InputField
                type="password"
                placeholder="Enter new password"
                onValueChange={(text) => setPassword(text)}
                value={password}
                title={"New password"}
                containerExtraStyle="mb-8"
              />

              {loading ? (
                <CustomActivityIndicator />
              ) : (
                <Button
                  onPress={async () => {
                    await NewPasswordReset({
                      variables: {
                        username: email,
                        token: otp,
                        password: password,
                      },
                    });
                  }}
                  title="Proceed"
                  size="medium"
                  textSize="text-lg"
                  padding="py-6 px-32"
                  borderRadius="rounded-3xl"
                  textFont="font-montserratBold"
                  color={"bg-Primary"}
                />
              )}
            </View>
          )}

          {/* Footer */}

          <View className="flex-row items-center justify-between py-6">
            {/* {referrer !== "login" && (
              <>
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
              </>
            )} */}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ResetVerifyEmail;
