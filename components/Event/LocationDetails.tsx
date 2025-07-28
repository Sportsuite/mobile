import { View, Text, useColorScheme } from "react-native";
import React from "react";
import useEventStore from "@/store/eventStore";
import { getSize } from "@/utils/useScaleSize";
import Ionicons from "@expo/vector-icons/Ionicons";
import ViewMap from "@/components/Event/ViewMap";

export default function LocationDetails() {
  const eventDetails = useEventStore((state) => state.eventDetails);
  const colorScheme = useColorScheme();

  return (
    <View className="mt-8" style={{ width: getSize(100, "width") }}>
      <Text className="font-montserratBold text-lg ml-3 dark:text-white">
        Location
      </Text>
      <View className="flex-row flex-1 items-center mx-2">
        <View className="flex-row flex-1 justify-between items-center">
          <View className="flex-row w-[65%] mr-4 justify-between items-center">
            <Ionicons
              name="location-outline"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <View className="flex-1">
              <Text className="font-montserratBold dark:text-white">
                {eventDetails?.state?.name}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-montserratRegular flex-wrap text-sm dark:text-white"
              >
                {`${eventDetails?.country?.name} ${eventDetails?.city?.name} ${eventDetails?.stadium}`}
              </Text>
            </View>
          </View>
          <ViewMap
            lat={eventDetails.destinationLocation?.geoCode?.latitude}
            lon={eventDetails.destinationLocation?.geoCode?.longitude}
          />
        </View>
      </View>
    </View>
  );
}
