import { View, Text } from "react-native";
import React from "react";

interface CalendarProps {
  day: string; // The day of the month (e.g., "23")
  month: string; // The abbreviated month name (e.g., "Feb")
  title: string; // The main event title
  subtitle: string; // The event subtitle or description
}

const Calendar = ({ day, month, title, subtitle }: CalendarProps) => {
  return (
    <View className="flex-row items-center bg-LightGray p-4 rounded-xl my-2 dark:bg-white/10">
      {/* Date Container */}
      <View className="items-center justify-center bg-gray-300 py-3 px-6 rounded-xl dark:bg-Dark">
        <Text className="font-montserratBold text-2xl dark:text-white">
          {day}
        </Text>
        <Text className="font-montserratMedium dark:text-white">{month}</Text>
      </View>

      {/* Event Details Container */}
      <View className="ml-3">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-montserratSemiBold text-lg max-w-80 dark:text-white"
        >
          {title}
        </Text>
        <Text className="font-montserratMedium text-gray-500 max-w-80 dark:text-white">
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

export default Calendar;
