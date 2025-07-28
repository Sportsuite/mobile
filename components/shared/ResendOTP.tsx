import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ResendOTPProps {
  onResendOTP: () => void;
  timeLeft: number;
}

const ResendOTP: React.FC<ResendOTPProps> = ({ onResendOTP, timeLeft }) => {
  return (
    <View className="flex-row justify-between mt-4 mb-16">
      <Text className="text-sm text-Gray font-montserratRegular dark:text-white">
        Didn’t receive the code?
      </Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onResendOTP}>
        <Text
          className={`mr-1.5 text-sm ${
            timeLeft <= 1 ? "text-Accent" : "text-gray-200"
          } font-montserratBold`}
        >
          Resend
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResendOTP;
