import React, { useState, useRef } from "react";
import { View, TextInput, Keyboard, useColorScheme } from "react-native";

interface VerifyOTPProps {
  onComplete?: (otp: string) => void; // Function to emit the full OTP when completed
  inputBackgroundColor?: string;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  onComplete,
  inputBackgroundColor = "bg-LightGray",
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const colorScheme = useColorScheme();

  const emitOtp = (newOtp: string[]) => {
    if (onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return; // Restrict to one character

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Call onComplete after every update
    emitOtp(newOtp);

    // Move to the next field
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // Check if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        // Move to the previous field
        if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
      } else {
        // Clear the current field
        newOtp[index] = "";
        setOtp(newOtp);

        // Call onComplete after the deletion
        emitOtp(newOtp);
      }
    }
  };

  return (
    <View className="flex-row justify-evenly">
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="numeric"
          maxLength={1}
          className={`${inputBackgroundColor} w-20 h-20 mr-2 text-2xl text-center rounded-lg font-montserratBold dark:bg-white/10 dark:text-white`}
          placeholder={"0"}
          placeholderTextColor={colorScheme === "dark" ? "white" : "gray"}
          selectionColor="transparent" // Hides the cursor highlight
          caretHidden={true} // Hides the cursor
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

export default VerifyOTP;
