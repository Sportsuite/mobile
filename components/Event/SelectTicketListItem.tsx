import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface SelectTicketListItemProps {
  onPress?: () => void;
  ticket?: Ticket;
  isSelected?: boolean;
}
export default function SelectTicketListItem({
  onPress,
  ticket,
  isSelected = false,
}: SelectTicketListItemProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="rounded-lg border flex-row justify-between items-center bg-LightGray border-Primary p-6 mb-4 dark:bg-Dark"
    >
      {/* left */}
      <View className="gap-2">
        <Text className="font-montserratBold text-xl dark:text-white">
          {ticket?.title}
        </Text>
        <Text className="font-montserratMedium text-Primary dark:text-Accent">
          {ticket?.session?.description}
        </Text>
      </View>
      {/* right */}
      <View>
        <MaterialCommunityIcons
          name={isSelected ? "checkbox-outline" : "checkbox-blank-outline"}
          size={24}
          color={colorScheme === "dark" ? "white" : "blue"}
        />
      </View>
    </TouchableOpacity>
  );
}
