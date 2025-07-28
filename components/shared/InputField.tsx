import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

interface InputFieldProps {
  type?: "text" | "password" | "number" | "phone-pad";
  placeholder?: string;
  onValueChange?: (value: string) => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  value?: string;
  containerExtraStyle?: string;
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "Enter value",
  onValueChange,
  icon,
  value = "",
  title,
  containerExtraStyle = "bg-white",
  multiline,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const colorScheme = useColorScheme();

  const handleChange = (text: string) => {
    if (onValueChange) {
      onValueChange(text); // Exposes the value change
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const getInputType = () => {
    if (type === "password") {
      return isPasswordVisible ? "text" : "password";
    }
    return type;
  };

  return (
    <>
      {title && (
        <Text className="pb-1 font-montserratRegular text-Gray dark:text-white">
          {title}
        </Text>
      )}
      <View
        className={`flex-row items-center px-3 py-2 border border-gray-300 rounded-xl ${containerExtraStyle} dark:bg-Dark`}
      >
        <TextInput
          className={`flex-1 ${
            multiline ? "min-h-64 text-start" : "h-14"
          } font-montserratSemiBold dark:text-white`}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "light" ? "gray" : "white"}
          secureTextEntry={getInputType() === "password"}
          keyboardType={type === "number" ? "numeric" : "default"}
          onChangeText={handleChange}
          value={value}
          cursorColor={colorScheme === "light" ? "gray" : "white"}
          multiline={multiline}
          style={multiline ? { textAlignVertical: "top" } : {}}
        />
        {type === "password" && (
          <TouchableOpacity className="ml-2" onPress={togglePasswordVisibility}>
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={colorScheme === "light" ? "gray" : "white"}
            />
          </TouchableOpacity>
        )}
        {icon && <TouchableOpacity className="ml-2">{icon}</TouchableOpacity>}
      </View>
    </>
  );
};

export default InputField;
