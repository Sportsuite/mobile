import { View, Text, useColorScheme, ScrollView as Scroll } from "react-native";
import React, { useRef, useState } from "react";
import BackButton from "@/components/shared/BackButton";
import IconTextOptionButton from "@/components/shared/IconTextOptionButton";
import { router } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import ActiveEventListItem from "@/components/Event/ActiveEventListItem";
import ActiveEvent from "@/components/Event/ActiveEvent";
import { useQuery } from "@apollo/client";
import { GET_ONGOING_EVENTS } from "@/graphql/queries/event.query";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import ToastMsg from "@/components/shared/ToastMsg";

const AdminHomepage = () => {
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();
  const [ongoingEvents, setOngoingEvents] = useState<Partial<EventObj[]>>([]);
  const [selectedEvent, setSelectedEvent] = useState<Partial<EventObj>>();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const bottomSheetRef = useRef<any>(null);
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  };

  const { loading } = useQuery(GET_ONGOING_EVENTS, {
    onCompleted: ({ GetOnGoingEvents: { data } }) => {
      setOngoingEvents(data);
    },
    onError: (error) => {
      ToastMsg(error.message, "Error fetching ongoing events");
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
      }}
    >
      <Scroll>
        <View className="mt-2 mb-8 ml-2">
          <BackButton iconSize={32} iconColor="gray" />
        </View>
        <View className="m-2">
          <Text className="text-5xl font-montserratExtraBold dark:text-white">
            Administrative Tasks
          </Text>
          <Text className="py-4 text-lg font-montserratMedium dark:text-stone-200">
            What do you want to do?
          </Text>
        </View>

        {/* Select Event */}
        <ActiveEvent
          eventName={selectedEvent?.title}
          onPress={() => {
            setShowBottomSheet(true);
          }}
        />

        {/* Main Content */}
        {selectedEvent && (
          <View className="flex-row flex-wrap justify-between mx-4 mt-8">
            <IconTextOptionButton
              imageSource={require("../../../../assets/icons/checkin-icon.png")}
              description="Handle event ticket check-in"
              onPress={() =>
                router.push({
                  pathname:
                    "/profilebase/administration/event-checkin/select-tickets",
                  params: { selectedEvent: JSON.stringify(selectedEvent) },
                })
              }
              title="Event Check-In"
              extraStyle="mr-0.5"
            />
            <IconTextOptionButton
              imageSource={require("../../../../assets/icons/route-icon.png")}
              description="Handle airport pickup transportation option check-in "
              onPress={() => {}}
              title="Airport Pickup"
            />
            <IconTextOptionButton
              imageSource={require("../../../../assets/icons/car-plane-icon.png")}
              description="Handle airport drop-off transportation option check-in "
              onPress={() => {}}
              title="Airport Drop-off"
            />
            <IconTextOptionButton
              imageSource={require("../../../../assets/icons/bus-icon.png")}
              description="Handle event transportation pick-up and drop-off. "
              onPress={() =>
                router.push(
                  "/profilebase/administration/transportation/booking"
                )
              }
              title="Event Transportation"
            />
          </View>
        )}
      </Scroll>

      {showBottomSheet && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "70%"]}
        >
          <View className="px-4 flex-1">
            <View className="mb-4">
              <Text className="font-montserratBold text-xl uppercase dark:text-white">
                Select active event
              </Text>
              <Text className="font-montserratRegular text-sm dark:text-white">
                You need to set an event as active to proceed
              </Text>
            </View>

            {/* List item */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 10,
              }}
            >
              {loading && <CustomActivityIndicator />}
              {!loading && ongoingEvents?.length === 0 && (
                <View className="justify-center items-center h-96">
                  <Text className="font-montserratRegular text-lg  dark:text-white">
                    No ongoing events available
                  </Text>
                </View>
              )}
              {!loading &&
                ongoingEvents?.length > 0 &&
                ongoingEvents?.map((item, index) => (
                  <ActiveEventListItem
                    item={item}
                    onPress={() => {
                      setSelectedEvent(item);
                      setShowBottomSheet(false);
                      bottomSheetRef.current?.close();
                    }}
                    // onPress={() =>
                    //   router.push(
                    //     "/profilebase/administration/event-checkin/select-tickets"
                    //   )
                    // }
                    key={index}
                  />
                ))}
            </ScrollView>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default AdminHomepage;
