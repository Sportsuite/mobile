import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
interface Props {
  session: Session;
  selected: Session | undefined;
  onPress: () => void;
}
const Session = ({ session, selected, onPress }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${
        selected?.id === session?.id
          ? "bg-Accent"
          : colorScheme === "dark"
          ? "bg-Dark"
          : "bg-LightGray"
      } items-center justify-center rounded-xl p-4 min-w-32`}
    >
      <Text
        className={`font-montserratMedium text-xs ${
          selected?.id === session?.id
            ? "text-black"
            : colorScheme === "dark" && "text-white"
        }`}
      >
        {session.title}
      </Text>
      <Text
        className={`font-montserratBold text-xl ${
          selected?.id === session?.id
            ? "text-black"
            : colorScheme === "dark" && "text-white"
        }`}
      >
        {session.numberOfDays}
      </Text>
      <Text
        className={`font-montserratRegular text-sm ${
          selected?.id === session?.id
            ? "text-black"
            : colorScheme === "dark" && "text-white"
        }`}
      >{`${session.numberOfDays > 1 ? "days" : "day"}`}</Text>
    </TouchableOpacity>
  );
};

export default Session;
