import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import VerifyOTP from "@/components/shared/VerifyOTP";
import ResendOTP from "@/components/shared/ResendOTP";
import Button from "@/components/shared/Button";
import { obfuscateEmail } from "@/utils/obfuscateEmail";
import { formatCountdownTime } from "@/utils/formatCountdownTime";
import { useAuth } from "@/store/context/auth-context";
import { useMutation } from "@apollo/client";
import {
  ACCOUNT_DELETE_REQUEST,
  CONFIRM_ACCOUNT_DELETION,
} from "@/graphql/mutations/user.mutate";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { resetFirstLaunch } from "@/utils/firstLaunch";

const ConfirmAccountDeletion = () => {
  const statusBarHeight = useStatusBarHeight();
  const [otp, setOtp] = useState<string>("");
  const { user, logout } = useAuth();

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

  const [ConfirmAccountDeletion, { loading }] = useMutation(
    CONFIRM_ACCOUNT_DELETION,
    {
      onError: (error) => {
        ToastMsg(error.message, "Account Delete Request");
      },
      onCompleted: (data) => {
        if (data?.ConfirmAccountDeletionDeleteRequest?.data) {
          ToastMsg("Account Deleted", "Account Deleted Successfully!");
        }
      },
    }
  );

  const [ResendCode] = useMutation(ACCOUNT_DELETE_REQUEST, {
    onError: (error) => {
      ToastMsg(error.message, "Account Delete Request");
    },
    onCompleted: (data) => {
      if (data.AccountDeleteRequest) {
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
    <View
      style={{ paddingTop: statusBarHeight }}
      className="bg-Danger flex-1 dark:bg-DangerDark"
    >
      <View className="bg-white flex-1 rounded-t-3xl p-4 dark:bg-black">
        <BackButtonBg
          className="bg-Danger/10 dark:bg-Danger/50"
          iconColor="#E41D12"
        />

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="mt-5 items-center justify-center">
            <Image
              style={{
                width: "100%",
                height: "30%",
              }}
              source={require("@/assets/icons/delete-icon.png")}
              contentFit="contain"
            />
            <Text className="font-montserratExtraBold py-2 text-Danger text-lg">
              Delete Your Account
            </Text>
            <Text className="px-10 py-2 text-base text-center font-montserratRegular dark:text-white">
              {`A verification code has been sent to ${obfuscateEmail(
                user?.email!
              )}`}
            </Text>

            {/* Main content */}
            <View className="mx-16 mt-2">
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
            {loading ? (
              <CustomActivityIndicator size="large" />
            ) : (
              <Button
                onPress={async () => {
                  if (otp.length === 4) {
                    await ConfirmAccountDeletion({
                      variables: {
                        token: otp,
                      },
                    });
                    await resetFirstLaunch();
                    await logout();
                  } else {
                    ToastMsg(
                      "OTP field missing some numbers",
                      "Warning",
                      "info"
                    );
                  }
                }}
                fullWidth
                size="medium"
                title="Proceed"
                textSize="text-lg"
                borderRadius="rounded-2xl"
                color={`${otp.length === 4 ? "bg-Danger" : "bg-Danger/50"}`}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ConfirmAccountDeletion;
