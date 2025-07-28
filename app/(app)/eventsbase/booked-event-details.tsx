import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { useSearchParams } from "expo-router/build/hooks";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import DoubleIconTextButton from "@/components/Event/BookedEvent/DoubleIconTextButton";
import { router } from "expo-router";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { Ionicons } from "@expo/vector-icons";
import useEventStore from "@/store/eventStore";
import { useLazyQuery } from "@apollo/client";
import { GET_EVENT_BY_ID } from "@/graphql/queries/event.query";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import ToastMsg from "@/components/shared/ToastMsg";

const BookedEventDetails = () => {
  const params = useSearchParams();
  const details: BookedEvent = JSON.parse(params.get("details") || "{}");
  const orderId: string = params.get("orderId") || "";
  const statusBarHeight = useStatusBarHeight();
  const setEventDetails = useEventStore((state) => state.setEventDetails);
  const [GetEventByID] = useLazyQuery(GET_EVENT_BY_ID, {
    onError: (error) => {
      ToastMsg(error.message, "Event Details Failed");
    },
    onCompleted: ({ GetEvent: { data } }) => {
      if (data) {
        setEventDetails(data);
      }
    },
    nextFetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (details.event) {
      GetEventByID({
        variables: {
          getEventId: details?.event?.id,
        },
      });
    }
  }, []);

  return (
    <ScrollView
      className="bg-Primary dark:bg-Dark"
      style={{ paddingTop: statusBarHeight, flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="light" />

      {/* Top Nav */}
      <View className="mx-4 flex-row items-center">
        <BackButtonBg onPress={() => router.back()} />
        <Text className="font-montserratSemiBold text-white absolute right-0 left-0 text-center">
          Booked Event Detail
        </Text>
      </View>

      {/* dates */}
      <View className="flex-row items-center justify-between mx-4 mt-8 mb-4">
        {/* start */}
        <View>
          <Text className="font-montserratBold text-white">
            {formatDateToReadableString(details?.event?.startDate?.date)}
          </Text>
          <Text className="font-montserratMedium text-xs text-white">
            Start Date
          </Text>
        </View>
        {/* end */}
        <View className="items-end">
          <Text className="font-montserratBold text-white">
            {formatDateToReadableString(details?.event?.endDate?.date)}
          </Text>
          <Text className="font-montserratMedium text-xs text-white">
            End Date
          </Text>
        </View>
      </View>
      {/* image and event name */}
      <View className="bg-white items-center mx-4 rounded-3xl flex-1 overflow-hidden dark:bg-white/10">
        <Image
          source={
            details?.event?.coverImage
              ? { uri: details?.event?.coverImage }
              : require("../../../assets/icons/default-avatar.png")
          }
          style={{
            width: "100%",
            height: getSize(30, "height"),
          }}
          contentFit="cover"
        />
        <View className="py-4">
          <Text className="font-montserratBold flex-wrap text-center text-xl dark:text-white">
            {details?.event?.title}
          </Text>
          <Text className="font-montserratRegular flex-wrap text-center text-gray-400 dark:text-stone-200">
            {details?.event?.category?.name}
          </Text>
        </View>
      </View>

      {/* Menu Options */}
      <View className="mt-10 bg-white rounded-2xl px-4 dark:bg-white/10">
        <DoubleIconTextButton
          onPress={() =>
            router.push({
              pathname: "/eventsbase/booked-tickets",
              params: {
                orderId: orderId,
              },
            })
          }
          icon={require("../../../assets/icons/ticket.png")}
          title="Event Tickets"
          border={true}
        />
        <DoubleIconTextButton
          onPress={() => {}}
          icon={require("../../../assets/icons/airplane.png")}
          title="Flight Booking"
          border={true}
        />

        <DoubleIconTextButton
          onPress={() => {}}
          icon={require("../../../assets/icons/vacation.png")}
          title="Hotel Reservation"
          border={true}
        />
        <DoubleIconTextButton
          onPress={() => {}}
          icon={require("../../../assets/icons/transportation.png")}
          title="Transportation"
          border={true}
        />

        <DoubleIconTextButton
          onPress={() =>
            router.push({
              pathname: "/ratingreviewbase/ratingreview",
              params: {
                orderId: orderId,
              },
            })
          }
          icon={require("../../../assets/icons/rating.png")}
          title="Review & Rating"
          border={true}
        />
      </View>

      <View className="mt-8 mb-10">
        {/* View Event Details */}
        <TouchableOpacity
          onPress={() => router.push("/eventsbase/event-details")}
          activeOpacity={0.8}
          className="flex-row items-center justify-center"
        >
          <Text className="font-montserratMedium text-white text-lg">
            View Event Details
          </Text>
          <Ionicons
            name={"chevron-forward-outline"}
            color={"white"}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookedEventDetails;
