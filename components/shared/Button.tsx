import { Text, TouchableOpacity, View } from "react-native";
import { FC } from "react";
import CustomActivityIndicator from "./CustomActivityIndicator";

type ButtonProps = {
  onPress?: () => void;
  title: string;
  size?: "small" | "medium" | "large"; // Default: medium
  color?: string; //  for background colour
  border?: string;
  textColor?: string; //  for text colour
  textFont?: string; //  for text font
  padding?: string; //  for padding
  margin?: string; //  for margin
  textSize?: string; //  for font size
  borderRadius?: string; //  for border radius
  fullWidth?: boolean; // Default: false
  icon?: React.ReactNode;
  className?: string; // Additional custom
  loading?: boolean; //  for loading state
};

const Button: FC<ButtonProps> = ({
  onPress,
  title,
  size = "medium",
  color = "bg-Primary",
  textColor = "text-white",
  textFont,
  padding,
  margin,
  textSize,
  borderRadius = "rounded-xl",
  fullWidth = false,
  className = "",
  icon,
  border,
  loading,
}) => {
  // Define default sizes
  const sizeClasses = {
    small: "py-2 px-4",
    medium: "py-5 px-10",
    large: "py-8 px-16",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`${sizeClasses[size]} ${border} ${color} ${padding ?? ""} ${
        margin ?? ""
      } ${borderRadius} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <View
        className={`${
          icon || loading
            ? "flex-row items-center justify-center gap-3"
            : "items-center"
        }`}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text
          className={`${textSize ?? "text-base"} ${
            textFont ?? "font-montserratSemiBold"
          } ${textColor} text-center`}
        >
          {title}
        </Text>
        {loading && <CustomActivityIndicator />}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
