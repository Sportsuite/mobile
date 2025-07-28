import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_PAGINATED_NEARBY_EVENTS } from "@/graphql/queries/event.query";
import EventCompBig from "@/components/Event/EventCompBig";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import PageTitle from "@/components/shared/PageTitle";
import useEventStore from "@/store/eventStore";
import ToastMsg from "@/components/shared/ToastMsg";
import useLocationPermission from "@/hooks/useLocationPermission";
import NotFoundContent from "@/components/shared/NotFoundContent";

const NearByEvents = () => {
  const [events, setEvents] = useState<EventObj[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { latitude, longitude } = useLocationPermission();

  const setEventDetails = useEventStore((state) => state.setEventDetails);

  const setActiveEventDetails = (details: EventObj) => {
    setEventDetails(details);
    router.push("/eventsbase/event-details");
  };

  const limit = 10;

  const [getNearByEvents, { data, loading, fetchMore, refetch }] = useLazyQuery(
    GET_PAGINATED_NEARBY_EVENTS,
    {
      variables: { page, limit },
      onCompleted: ({
        GetPaginatedEventsNearYou: {
          data: { docs },
        },
      }) => {
        setEvents((prev) => [...prev, ...docs]);
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
      onError: ({ message }) => {
        ToastMsg(message, "Error fetching events");
      },
    }
  );

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
      await Promise.all([refetch()]);
    } catch (error) {
      // ToastMsg("Failed to refresh data", "Refreshing Failed");
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (loading || !data.GetPaginatedEventsNearYou.data.hasNextPage) return;
    setPage((prev) => prev + 1);

    await fetchMore({
      variables: { page, limit },
    });
  };

  const renderItem = ({ item }: { item: EventObj }) => (
    <EventCompBig
      onPress={() => setActiveEventDetails(item)}
      className="mb-4"
      eventItem={item}
    />
  );

  return (
    <SafeAreaView className="dark:bg-Dark flex-1">
      {/* Page Title */}
      <PageTitle title="NearBy Events" />
      {loading && page === 1 ? (
        <CustomActivityIndicator size="large" />
      ) : (
        <FlatList
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          ListEmptyComponent={
            <NotFoundContent
              className="my-16"
              title="Ooops!"
              titleColor="text-stone-500"
              subtitle="No nearby events found, check back later."
              subtitleColor="text-stone-600"
            />
          }
          showsVerticalScrollIndicator={false}
          data={events}
          keyExtractor={(item, index) => item.id.toString() + index}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <CustomActivityIndicator /> : null}
        />
      )}
    </SafeAreaView>
  );
};

export default NearByEvents;
