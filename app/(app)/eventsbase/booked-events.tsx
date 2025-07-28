import { RefreshControl, Text, useColorScheme, View } from "react-native";
import React, { useRef, useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import { router } from "expo-router";
import ViewMap from "@/components/Event/ViewMap";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { useQuery } from "@apollo/client";
import { GET_BOOKED_EVENTS } from "@/graphql/queries/event.query";
import EventCard from "@/components/Event/BookedEvent/EventCard";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import OrderListItem from "@/components/Event/OrderListItem";
import Passed from "@/components/Event/Passed";
import ZoomInFlatList from "@/components/shared/ZoomInFlatList";
import ToastMsg from "@/components/shared/ToastMsg";

const BookedEvents = () => {
  // const [activeTab, setActiveTab] = useState("upcoming");
  const [booked, setBooked] = useState<BookedEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<BookedEvent | null>(null);
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<any>(null);
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  };

  const renderItemPrev = ({ item }: { item: BookedEvent }) => (
    <EventCard
      onPress={() => {
        setSelectedEvent(item);
        setShowBottomSheet(true);
      }}
      className="mb-4"
      item={item}
      topRightComponent={
        item.event.isPassed ? (
          <Passed />
        ) : (
          <ViewMap
            lat={item?.event?.destinationLocation?.geoCode?.latitude}
            lon={item?.event?.destinationLocation?.geoCode?.longitude}
          />
        )
      }
    />
  );

  const { loading, refetch } = useQuery(GET_BOOKED_EVENTS, {
    onError: (error) => {
      ToastMsg(error.message, "Booked Events Failed");
    },
    onCompleted: ({ GetBookedEvents: { data } }) => {
      if (data) {
        setBooked(data);
        setLoaded(true);
      }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetch()]);
    } catch (error) {
      // ToastMsg("Failed to refresh data", "Refreshing Failed");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
      }}
    >
      <PageTitle title="Bookings" />

      <Text className="mt-4 mb-6 font-montserratRegular mx-6 dark:text-white">
        {`List of booked events`}
      </Text>
      {loading && !loaded && (
        <CustomActivityIndicator className="items-center justify-center flex-1 px-6" />
      )}
      {loaded && !loading && booked?.length <= 0 && (
        <NotFoundContent title="Ooops!" subtitle={`No booked event found!`} />
      )}
      <ZoomInFlatList
        scrollAxis="y"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={booked}
        keyExtractor={(item, index) => item.event.id + index}
        renderItem={renderItemPrev}
      />

      {showBottomSheet && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["30%", "50%"]}
        >
          <View className="px-4 flex-1">
            {/* Selected Event Details */}
            <View className=" items-center mb-4">
              <Text className="font-montserratBold text-xl py-2 dark:text-white">
                {selectedEvent?.event?.title}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-montserratBold text-xl uppercase dark:text-white">
                Select order
              </Text>
              <Text className="font-montserratRegular text-sm dark:text-white">
                You need to select an order to proceed
              </Text>
            </View>

            {/* List item */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 10,
              }}
            >
              {selectedEvent?.orders?.map((item, index) => (
                <OrderListItem
                  onPress={() => {
                    setShowBottomSheet(false);
                    router.push({
                      pathname: "/eventsbase/booked-event-details",
                      params: {
                        details: JSON.stringify(selectedEvent),
                        orderId: item.order.id,
                      },
                    });
                  }}
                  item={item}
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

export default BookedEvents;
