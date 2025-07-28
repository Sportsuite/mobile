import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/shared/Button";
import CategoryItem from "@/components/shared/CategoryItem";
import { GET_CATEGORIES } from "@/graphql/queries/categories.query";
import { useLazyQuery, useQuery } from "@apollo/client";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import EventCompBig from "@/components/Event/EventCompBig";
import { GET_EVENTS_BY_CATEGORY } from "@/graphql/queries/event.query";
import { router } from "expo-router";
import NotFoundContent from "@/components/shared/NotFoundContent";
import useEventStore from "@/store/eventStore";
import ZoomInItem from "@/components/shared/ZoomInItem";
import ToastMsg from "@/components/shared/ToastMsg";

const Events = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category>();
  const [events, setEvents] = useState<EventObj[]>([]);
  const setEventDetails = useEventStore((state) => state.setEventDetails);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetch(), catRefresh()]);
    } catch (error) {
      ToastMsg("Failed to refresh data", "Fonts Loading Failed");
    } finally {
      setRefreshing(false);
    }
  };

  const setActiveEventDetails = (details: EventObj) => {
    setEventDetails(details);
    router.push("/eventsbase/event-details");
  };

  // Fetch categories on component mount
  const { loading: cLoading, refetch: catRefresh } = useQuery(GET_CATEGORIES, {
    onError: (error) => {
      ToastMsg(error.message, "Categories Loading Failed");
    },
    onCompleted: (d) => {
      if (d) {
        const { data } = d.GetCategories;
        setSelectedCat(data[0]);
        setCategories(data);
      }
    },
  });

  const [getEvents, { refetch, loading: gLoading }] = useLazyQuery(
    GET_EVENTS_BY_CATEGORY,
    {
      onError: (error) => {
        ToastMsg(error.message, "Events Loading Failed");
      },
      onCompleted: (d) => {
        if (d) {
          const { docs } = d.GetEventsByCategory.data;
          setEvents(docs);
          setLoaded(true);
        }
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Fetch events when a category is selected
  const fetchEvents = useCallback(async () => {
    if (selectedCat) {
      setLoaded(false);
      await getEvents({
        variables: {
          category: selectedCat.id,
        },
      });
    }
  }, [selectedCat, getEvents]);

  // Trigger fetchEvents when selectedCat changes
  useEffect(() => {
    if (categories.length > 0) {
      fetchEvents();
    }
  }, [selectedCat]);

  return (
    <SafeAreaView className="bg-white flex-1 dark:bg-Dark">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Top Content */}
        <View className="flex-row items-center w-[96%] mx-2 justify-between mt-2">
          <Text className="font-montserratBold text-3xl dark:text-white">
            Events
          </Text>
          <View className="flex-row items-center">
            {/* Booked Events Button */}
            <Button
              onPress={() => router.push("/eventsbase/booked-events")}
              title="Booked Events"
              color="bg-Primary"
              textFont="font-montserratBold"
              size="small"
              textColor="text-LightBlue"
              textSize="text-xs"
              className="py-4"
            />
            {/* Filter Button */}
            {/* <IconButton onPress={() => {}} className="ml-6" /> */}
          </View>
        </View>

        {/* Categories */}
        {cLoading ? (
          <CustomActivityIndicator className="py-12" />
        ) : categories.length <= 0 ? (
          <View className="mx-2 mt-4">
            <Text className="font-montserratRegular dark:text-white">
              No categories were found
            </Text>
          </View>
        ) : (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              marginTop: 12,
              alignItems: "center",
              marginHorizontal: 2,
            }}
          >
            {categories.map((item) => (
              <CategoryItem
                onPress={() => {
                  setEvents([]);
                  setSelectedCat(item);
                }}
                key={item.id}
                className={`${
                  selectedCat?.id === item.id
                    ? "bg-Accent"
                    : colorScheme === "dark"
                    ? "bg-Dark border border-white"
                    : "bg-LightGray"
                } mr-2`}
                textColor={`${
                  selectedCat?.id === item.id
                    ? "text-black"
                    : colorScheme === "dark" && "text-white"
                }`}
                item={item}
              />
            ))}
          </ScrollView>
        )}

        {/* Event List */}
        {gLoading && !loaded && (
          <View className="mt-6 items-center justify-center">
            <CustomActivityIndicator size="large" className="py-80" />
          </View>
        )}

        {!gLoading && loaded && events?.length > 0 && (
          <View className="mt-6">
            {events.map((item, index) => (
              <ZoomInItem key={item.id} delay={index * 50}>
                <EventCompBig
                  onPress={() => setActiveEventDetails(item)}
                  titleLength={1}
                  key={item.id}
                  className="mb-4"
                  width={93.48}
                  height={27}
                  eventItem={item}
                />
              </ZoomInItem>
            ))}
          </View>
        )}

        {loaded && !gLoading && events?.length < 0 && (
          <NotFoundContent
            title="Ooops!"
            subtitle={`No Event found for ${selectedCat?.name}`}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Events;
