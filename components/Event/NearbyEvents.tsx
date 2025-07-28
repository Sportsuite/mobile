import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import useLocationPermission from "@/hooks/useLocationPermission";
import CustomActivityIndicator from "../shared/CustomActivityIndicator";
import Button from "../shared/Button";
import { router, useFocusEffect } from "expo-router";
import CategoryTitleIcon from "./CategoryTitleIcon";
import ZoomInFlatList from "../shared/ZoomInFlatList";
import EventCompMd from "./EventCompMd";
import NotFoundContent from "../shared/NotFoundContent";

interface NearByEventsProps {
  loaded: boolean;
  eloading: boolean;
  setActiveEventDetails: (item: EventObj) => void;
  nearByEvents: EventObj[];
}
export default function NearbyEvents({
  loaded,
  setActiveEventDetails,
  eloading,
  nearByEvents,
}: NearByEventsProps) {
  const { status, initialisePermission } = useLocationPermission();

  useFocusEffect(
    useCallback(() => {
      initialisePermission();
    }, [])
  );

  if (eloading && !loaded) return <CustomActivityIndicator className="py-36" />;
  return (
    <View className="mt-4">
      <View className="flex-row mb-2 items-center justify-between">
        <CategoryTitleIcon title="Events Near You" />
        {nearByEvents?.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/eventsbase/nearby-events")}
            activeOpacity={0.6}
            className="p-2"
          >
            <Text className="font-montserratSemiBold dark:text-white">
              View all
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Events */}
      {nearByEvents.length > 0 && (
        <ZoomInFlatList
          scrollAxis="x"
          horizontal
          data={nearByEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCompMd
              onPress={() => setActiveEventDetails(item)}
              className="mx-2"
              width={75.81}
              height={23}
              eventItem={item}
            />
          )}
        />
      )}

      {status === "granted" && nearByEvents.length === 0 && (
        <NotFoundContent title="No Event near you" />
      )}

      {status !== "granted" && (
        <View className="mt-12 mb-28 items-center justify-center">
          <Text className="font-montserratBold text-xl dark:text-white">
            Amazing Events Near You
          </Text>
          <Text className="font-montserratRegular text-sm text-center w-[80%] my-4 dark:text-white">
            We use your location to show nearby events and activities. It helps
            you discover what's happening around you. Your data stays private
            and secure.
          </Text>
          <Button
            onPress={() => router.push("/profilebase/location-permission")}
            title="Continue"
            size="small"
            borderRadius="rounded-xl"
            padding="px-8 py-4"
            color={"bg-Primary"}
            textColor="text-white"
            textFont="font-montserratBold"
          />
        </View>
      )}
    </View>
  );
}
