import {
  View,
  Text,
  Dimensions,
  FlatList,
  Animated,
  ScrollView,
  useColorScheme,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import BottomIndicator from "@/components/OnBoarding/BottomIndicator";
import StartingPrice from "@/components/Event/StartingPrice";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import DateIconSide from "@/components/Event/DateIconSide";
import Button from "@/components/shared/Button";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { UPDATE_USER_EVENT_SEARCH_HISTORY } from "@/graphql/mutations/event.mutate";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_EVENT_CALENDARS } from "@/graphql/queries/event.query";
import Calendar from "@/components/Event/Calendar";
import {
  getDayFromDate,
  getMonthShorthandFromDate,
} from "@/utils/diluteDateObj";
import useEventStore from "@/store/eventStore";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import ToastMsg from "@/components/shared/ToastMsg";
import LocationDetails from "@/components/Event/LocationDetails";

const EventDetails = () => {
  const params = useSearchParams();
  const eventDetails = useEventStore((state) => state.eventDetails);
  const from: string = params.get("from") || "";
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [calendar, setCalendar] = useState<EventCalendar[]>([]);
  const [showTopLocation, setShowTopLocation] = useState(false);

  const [addEventToHistory] = useMutation(UPDATE_USER_EVENT_SEARCH_HISTORY, {
    onError: (error) => {
      ToastMsg(error.message, "Search Events Failed");
    },
  });

  const [GetCalendar, { loading }] = useLazyQuery(GET_EVENT_CALENDARS, {
    onError: (error) => {
      ToastMsg(error.message, "Failed to fetch calendar data");
    },
    onCompleted: (d) => {
      if (d) {
        const { data } = d.GetEventCalendars;
        setCalendar(data);
      }
    },
  });

  useEffect(() => {
    if (from === "/search") {
      addEventToHistory({
        variables: {
          event: eventDetails.id,
        },
      });
    }
    if (eventDetails)
      GetCalendar({
        variables: {
          event: eventDetails.id,
        },
      });
  }, []);

  // Default topRightComponent if not provided
  const defaultTopRightComponent = eventDetails.startingPrice ? (
    <StartingPrice
      bgColor="bg-Accent"
      textColor="text-black"
      price={eventDetails.startingPrice.price}
    />
  ) : (
    <View className="h-12" />
  );
  return (
    <ScrollView className="flex-1 bg-white dark:bg-Dark">
      <StatusBar style="light" />
      {/* Back Button */}
      <View className="absolute z-40 left-2 top-14">
        <BackButtonBg />
      </View>
      {eventDetails?.images?.length > 0 ? (
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          data={eventDetails.images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{
                width: Dimensions.get("window").width,
                height: getSize(36.58, "height"),
              }}
              contentFit="cover"
            />
          )}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={({ viewableItems }) =>
            setCurrentIndex(viewableItems[0]?.index ?? 0)
          }
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      ) : (
        <Image
          source={require("../../../assets/icons/default-avatar.png")}
          style={{
            width: Dimensions.get("window").width,
            height: getSize(36.58, "height"),
          }}
          contentFit="cover"
        />
      )}
      {/* buttons and swiper */}
      <View className="items-center justify-center mt-4">
        <View className="flex flex-row justify-between">
          <BottomIndicator
            scrollX={scrollX}
            data={eventDetails.images}
            color="bg-Accent"
          />
        </View>
      </View>
      {/* Title and Starting Price */}
      <View className="items-center flex-row justify-between w-[96%] ml-2 mt-6">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-montserratBold flex-wrap w-[65%] text-xl dark:text-white"
        >
          {eventDetails.title}
        </Text>
        {defaultTopRightComponent}
      </View>
      {/* City and Countrry */}
      <Text className="font-montserratRegular text-lg mx-2 text-Gray dark:text-white">{`${eventDetails?.city?.name} - ${eventDetails?.country?.name}`}</Text>
      {/* Start and End Dates */}
      <View className="mx-2 mt-6">
        <View className="flex-row items-center justify-between">
          {/* Start Date */}
          <DateIconSide
            date={formatDateToReadableString(eventDetails.startDate.date)}
            title="Start"
          />

          {/* End Date */}
          <DateIconSide
            date={formatDateToReadableString(eventDetails.endDate.date)}
            title="End"
          />
        </View>
      </View>

      {/* About Event */}
      <View className="mx-2 mt-8">
        <Text className="font-montserratBold text-lg dark:text-white">
          About Event
        </Text>

        {eventDetails?.desc && (
          <RichTextRenderer
            onToggle={() => {
              if (showTopLocation) {
                setShowTopLocation(false);
              } else {
                setShowTopLocation(true);
              }
            }}
            htmlContent={eventDetails?.desc}
          />
        )}
      </View>

      {/* Event Calendar */}
      {calendar.length > 0 && (
        <View className="mx-2 mt-8">
          <Text className="font-montserratBold text-lg dark:text-white">
            Calender:
          </Text>
          {calendar?.map((item, index) => (
            <Calendar
              key={index.toString()}
              day={getDayFromDate(item.datetime.date)}
              month={getMonthShorthandFromDate(item.datetime.date)}
              title={item.title}
              subtitle={item.desc}
            />
          ))}
        </View>
      )}

      {/* Location */}
      {!showTopLocation && <LocationDetails />}

      {showTopLocation && <LocationDetails />}

      {/* The idea of repeated location object is so the parent view can recalculate the height of the component on show more rich text renderer */}

      {/* Book Ticket */}
      <View className="mx-2 mt-10 mb-6">
        <Button
          onPress={() => router.push("/eventsbase/ticket-options")}
          title="Get Tickets"
          size="medium"
          borderRadius="rounded-xl"
          padding="py-3"
          color={"bg-Primary"}
          textColor="text-white"
        />
      </View>
    </ScrollView>
  );
};

export default EventDetails;
