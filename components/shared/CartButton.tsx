import { Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";

interface CartButtonProps {
  onPress?: () => void;
  textStyle?: string;
  iconColor?: string;
}
const CartButton = ({
  onPress = () => router.push("/cartbase/cart-home"),
  textStyle,
  iconColor = "black",
}: CartButtonProps) => {
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-center"
    >
      <Ionicons
        name="cart-outline"
        size={24}
        color={colorScheme === "dark" ? "white" : iconColor}
      />
      <Text
        className={`ml-2 text-lg font-montserratMedium ${textStyle} dark:text-white`}
      >
        {formatCurrency(getTotalPrice())}
      </Text>
    </TouchableOpacity>
  );
};

export default CartButton;
