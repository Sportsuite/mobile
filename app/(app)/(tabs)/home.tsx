import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/store/context/auth-context";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import {
  GET_TRENDING_EVENTS,
  GET_UPCOMING_EVENTS,
  NEAR_BY_EVENTS,
} from "@/graphql/queries/event.query";
import { useLazyQuery, useQuery } from "@apollo/client";
import CategoryTitleIcon from "@/components/Event/CategoryTitleIcon";
import EventCompBig from "@/components/Event/EventCompBig";
import EventCompMd from "@/components/Event/EventCompMd";
import NotFoundContent from "@/components/shared/NotFoundContent";
import Feather from "@expo/vector-icons/Feather";
import { getSize } from "@/utils/useScaleSize";
import { Image } from "expo-image";
import useEventStore from "@/store/eventStore";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import useLocationPermission from "@/hooks/useLocationPermission";
import ZoomInItem from "@/components/shared/ZoomInItem";
import ZoomInFlatList from "@/components/shared/ZoomInFlatList";
import ToastMsg from "@/components/shared/ToastMsg";
import NearbyEvents from "@/components/Event/NearbyEvents";

const Home = () => {
  const { user } = useAuth();
  const setEventDetails = useEventStore((state) => state.setEventDetails);
  const [trendingEvent, setTrendingEvent] = useState<EventObj | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<EventObj[]>([]);
  const [nearByEvents, setNearByEvents] = useState<EventObj[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const colorScheme = useColorScheme();
  const statusBarHeight = useStatusBarHeight();

  const { loading: tloading, refetch: refetchTrending } = useQuery(
    GET_TRENDING_EVENTS,
    {
      onError: (error) => {
        ToastMsg(error.message, "Trending Events Loading Failed");
      },
      onCompleted: (d) => {
        if (d) {
          const { data } = d.GetTrendingEvent;
          setTrendingEvent(data);
        }
      },
      nextFetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );
  const { latitude, longitude } = useLocationPermission();

  const [GetUpcomingEvents, { loading: uloading, refetch: refetchUpcoming }] =
    useLazyQuery(GET_UPCOMING_EVENTS, {
      onError: (error) => {
        ToastMsg(error.message, "Upcoming Events Loading Failed");
      },
      onCompleted: (d) => {
        if (d) {
          const { data } = d.GetUpcomingEvents;
          setUpcomingEvents(data);
          setLoaded(true);
        }
      },
      notifyOnNetworkStatusChange: true,
    });

  const [getNearByEvents, { loading: eloading, refetch: refetchNearBy }] =
    useLazyQuery(NEAR_BY_EVENTS, {
      onError: (error) => {
        ToastMsg(error.message, "Near By Events Loading Failed");
      },
      onCompleted: ({ GetEventsNearYou: { data } }) => {
        if (data) {
          setNearByEvents(data);
          setLoaded(true);
        }
      },
      notifyOnNetworkStatusChange: true,
    });

  const setActiveEventDetails = (details: EventObj) => {
    setEventDetails(details);
    router.push("/eventsbase/event-details");
  };

  useEffect(() => {
    if (longitude && latitude) {
      getNearByEvents({
        variables: { lng: longitude, lat: latitude },
      });
    }
  }, [longitude, latitude]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      const refetchPromises = [refetchTrending(), refetchUpcoming()];

      // Only add nearBy refetch if coordinates exist
      if (longitude && latitude) {
        refetchPromises.push(refetchNearBy({ lng: longitude, lat: latitude }));
      }

      await Promise.all(refetchPromises);
    } catch (error) {
      ToastMsg("Failed to refresh some data", "Warning", "info");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    GetUpcomingEvents({
      variables: {
        limit: 10,
      },
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        paddingTop: statusBarHeight,
      }}
      className="flex-1 bg-white dark:bg-Dark"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Content */}
        <View className="flex-row items-center justify-between my-2 mx-2.5">
          <View>
            <Text
              className="font-montserratRegular text-Gray dark:text-white"
              style={{ fontSize: getSize(3, "width") }}
            >{`Welcome ${user?.name.split(" ")[0] ?? ""}`}</Text>
            <Text
              className="font-montserratExtraBold dark:text-white"
              style={{ fontSize: getSize(5, "width") }}
            >
              SportSuite
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            {/* Notification Icon */}
            <TouchableOpacity
              // onPress={() => router.push("/notificationbase")}
              activeOpacity={0.8}
              className="rounded-full p-2"
            >
              <Feather
                name="bell"
                size={24}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
            {/* User Avatar */}
            <TouchableOpacity
              onPress={() => router.push("profile")}
              className="bg-Accent ml-2"
              style={{
                width: getSize(11, "width"),
                height: getSize(11, "width"),
                borderRadius: getSize(11, "width"),
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  user?.image
                    ? { uri: user?.image }
                    : require("../../../assets/icons/default-avatar.png")
                }
                style={{
                  width: getSize(11, "width"),
                  height: getSize(11, "width"),
                }}
                contentFit="cover"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Event */}
        {tloading && !loaded ? (
          <CustomActivityIndicator className="py-36" />
        ) : (
          trendingEvent && (
            <View className="mx-2">
              <CategoryTitleIcon
                // iconUrl={require("../../../assets/icons/trending.png")}
                title="Trending Event"
                className="mb-2"
              />
              <ZoomInItem key={1} delay={50}>
                <EventCompBig
                  onPress={() => setActiveEventDetails(trendingEvent)}
                  eventItem={trendingEvent}
                />
              </ZoomInItem>
            </View>
          )
        )}

        {/* List of Upcoming Events */}
        {(uloading || tloading) && !loaded ? (
          <CustomActivityIndicator className="py-36" />
        ) : (
          <View className="mt-4">
            <View className="flex-row mb-2 items-center justify-between">
              <CategoryTitleIcon
                // iconUrl={require("../../../assets/icons/upcoming.png")}
                title="Upcoming Events"
              />
              {upcomingEvents?.length > 0 && (
                <TouchableOpacity
                  onPress={() => router.push("/eventsbase/upcoming-events")}
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
            {loaded &&
              !uloading &&
              trendingEvent &&
              upcomingEvents.length > 0 && (
                <ZoomInFlatList
                  scrollAxis="x"
                  horizontal
                  data={upcomingEvents}
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

            {loaded &&
              !uloading &&
              trendingEvent === null &&
              upcomingEvents.length > 0 &&
              upcomingEvents.map((e, index) => (
                <ZoomInItem key={e.id} delay={index * 100}>
                  <EventCompBig
                    onPress={() => setActiveEventDetails(e)}
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

        {/* Nearby Events */}
        <NearbyEvents
          loaded={loaded}
          setActiveEventDetails={setActiveEventDetails}
          nearByEvents={nearByEvents}
          eloading={eloading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
