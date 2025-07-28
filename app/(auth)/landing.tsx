import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/shared/Button";
import CategoryTitleIcon from "@/components/Event/CategoryTitleIcon";
import EventCompMd from "@/components/Event/EventCompMd";
import BottomNav from "@/components/Auth/BottomNav";
import { router } from "expo-router";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_TRENDING_EVENTS,
  GET_UPCOMING_EVENTS,
} from "@/graphql/queries/event.query";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import NotFoundContent from "@/components/shared/NotFoundContent";
import EventCompBig from "@/components/Event/EventCompBig";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EventDetail from "@/components/Auth/EventDetail";
import { getSize } from "@/utils/useScaleSize";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ZoomInFlatList from "@/components/shared/ZoomInFlatList";
import ZoomInItem from "@/components/shared/ZoomInItem";
import ToastMsg from "@/components/shared/ToastMsg";

const Landing = () => {
  const [trendingEvent, setTrendingEvent] = useState<EventObj | null>(null);
  const [eventDetail, setEventDetail] = useState<EventObj | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventObj[]>([]);
  const [showBottomModal, setShowBottomModal] = useState<boolean>(false);
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      //   router.replace("/(profile)");
    }
  };

  const { loading: tloading, refetch: refetchTrending } = useQuery(
    GET_TRENDING_EVENTS,
    {
      onError: (error) => {
        ToastMsg(error.message, "Error fetching trending events");
      },
      onCompleted: (d) => {
        if (d) {
          const { data } = d.GetTrendingEvent;
          setTrendingEvent(data);
        }
      },
      fetchPolicy: "network-only",
    }
  );

  const [GetUpcomingEvents, { loading: uloading, refetch: refetchUpcoming }] =
    useLazyQuery(GET_UPCOMING_EVENTS, {
      onError: (error) => {
        ToastMsg(error.message, "Error fetching upcoming events");
      },
      onCompleted: (d) => {
        if (d) {
          const { data } = d.GetUpcomingEvents;
          setUpcomingEvents(data);
        }
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    GetUpcomingEvents({
      variables: {
        limit: 10,
      },
    });
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetchTrending(), refetchUpcoming()]);
    } catch (error) {
      ToastMsg("Failed to refresh data", "Error refreshing data");
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
        backgroundColor: colorScheme === "light" ? "white" : "#131214",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Content */}
        <View className="flex-row items-center justify-between m-2">
          <Text
            className="font-montserratExtraBold dark:text-white"
            style={{ fontSize: getSize(6, "width") }}
          >
            SportSuite
          </Text>
          <Button
            onPress={() => router.push("login")}
            title="Sign In"
            size="small"
            borderRadius="rounded-xl"
            padding="px-8 py-4"
            color={"bg-Primary"}
            textColor="text-white"
            textFont="font-montserratBold"
          />
        </View>

        {/* Trending Event */}
        {tloading ? (
          <CustomActivityIndicator className="py-36" />
        ) : (
          trendingEvent && (
            <View>
              <CategoryTitleIcon
                className="mb-2 px-2"
                // iconUrl={require("../../assets/icons/trending.png")}
                title="Trending Event"
              />
              <ZoomInItem key={1} delay={100}>
                <EventCompBig
                  onPress={() => {
                    setEventDetail(trendingEvent);
                    setShowBottomModal(true);
                    bottomSheetRef.current?.open();
                  }}
                  eventItem={trendingEvent}
                />
              </ZoomInItem>
            </View>
          )
        )}

        {/* List of Upcoming Events */}
        {uloading || tloading ? (
          <CustomActivityIndicator className="py-36" />
        ) : (
          <View className="mt-4">
            <View className="flex-row items-center mb-2 justify-between">
              <CategoryTitleIcon
                // iconUrl={require("../../assets/icons/upcoming.png")}
                title="Upcoming Events"
              />
              {upcomingEvents?.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => router.push("login")}
                  className="p-2"
                >
                  <Text className="font-montserratSemiBold dark:text-white">
                    View all
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Events */}

            {!uloading && trendingEvent && upcomingEvents.length > 0 && (
              <ZoomInFlatList
                scrollAxis="x"
                data={upcomingEvents}
                renderItem={({ item }) => (
                  <EventCompMd
                    onPress={() => {
                      setEventDetail(item);
                      setShowBottomModal(true);
                      bottomSheetRef.current?.open();
                    }}
                    className="mx-2"
                    width={75.81}
                    height={23}
                    eventItem={item}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
              />
            )}

            {!uloading &&
              trendingEvent === null &&
              upcomingEvents.length > 0 &&
              upcomingEvents.map((e, index) => (
                <ZoomInItem key={e.id} delay={index * 100}>
                  <EventCompBig
                    onPress={() => {
                      setEventDetail(e);
                      setShowBottomModal(true);
                      bottomSheetRef.current?.open();
                    }}
                    key={e.id}
                    className="mb-4"
                    eventItem={e}
                  />
                </ZoomInItem>
              ))}

            {!uloading && upcomingEvents.length < 1 && (
              <NotFoundContent title="No upcoming events available" />
            )}
          </View>
        )}

        {/* Amazing Events Near Users by Location */}
        <View className="mt-12 mb-28 items-center justify-center">
          <Text className="font-montserratBold text-xl dark:text-white">
            Amazing Events Near You
          </Text>
          <Text className="font-montserratRegular text-sm text-center my-4 dark:text-white">
            Sign up to see amazing events near you.
          </Text>
          <Button
            onPress={() => router.push("sign-up")}
            title="Sign Up"
            size="small"
            borderRadius="rounded-xl"
            padding="px-8 py-4"
            color={"bg-Primary"}
            textColor="text-white"
            textFont="font-montserratBold"
          />
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <BottomNav />

      {/* BottomSheet placed outside the SafeAreaView */}
      {showBottomModal && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "68%"]}
        >
          {/* Dynamic content */}
          <EventDetail
            bottomSheetRef={bottomSheetRef}
            details={eventDetail ? eventDetail : null}
          />
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default Landing;
