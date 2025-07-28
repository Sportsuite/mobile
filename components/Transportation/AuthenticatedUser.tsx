import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

// Define the interface for the user data prop
interface AuthenticatedUserProps {
  avatarUrl?: string; // URL for the avatar image
  name?: string;
  ticketCode?: string;
  checkInTime?: string; // Last active time, e.g., '46 mins ago'
}

const AuthenticatedUser: React.FC<AuthenticatedUserProps> = ({
  avatarUrl,
  name,
  ticketCode,
  checkInTime,
}) => {
  return (
    <View
      style={{ height: getSize(12, "height"), width: getSize(91, "width") }}
      className="flex-row items-center p-6 mb-4 bg-LightGray rounded-xl dark:bg-white/10"
    >
      <View
        style={{
          width: getSize(18, "width"),
          height: getSize(18, "width"),
          overflow: "hidden",
        }}
        className="items-center justify-center mr-4 rounded-full bg-Accent"
      >
        <Image
          style={{
            width: getSize(18, "width"),
            height: getSize(18, "width"),
          }}
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../../assets/icons/default-avatar.png")
          } // Use default avatar if no URL is provided
          contentFit="cover"
        />
      </View>
      <View>
        <Text className="text-2xl font-montserratExtraBold dark:text-white">
          {name ?? "John Doe"}
        </Text>
        <Text className="font-montserratRegular text-Gray dark:text-stone-200">
          {ticketCode ?? "Ticket Code"}
        </Text>
        <Text className="pt-2 text-sm font-montserratSemiBold text-Primary  dark:text-Accent">
          {checkInTime ?? "some mins ago"}
        </Text>
      </View>
    </View>
  );
};

export default AuthenticatedUser;
