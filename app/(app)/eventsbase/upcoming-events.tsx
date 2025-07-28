import { FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PAGINATED_UPCOMING_EVENTS } from "@/graphql/queries/event.query";
import EventCompBig from "@/components/Event/EventCompBig";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import PageTitle from "@/components/shared/PageTitle";
import useEventStore from "@/store/eventStore";
import ToastMsg from "@/components/shared/ToastMsg";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventObj[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const setEventDetails = useEventStore((state) => state.setEventDetails);

  const setActiveEventDetails = (details: EventObj) => {
    setEventDetails(details);
    router.push("/eventsbase/event-details");
  };

  const limit = 10;

  const { data, loading, fetchMore, refetch } = useQuery(
    GET_PAGINATED_UPCOMING_EVENTS,
    {
      variables: { page, limit },
      onCompleted: ({
        GetUpcomingEventsPaginated: {
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
    if (loading || !data.GetUpcomingEventsPaginated.data.hasNextPage) return;
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
      <PageTitle title="Upcoming Events" />
      {loading && page === 1 ? (
        <CustomActivityIndicator size="large" />
      ) : (
        <FlatList
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
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

export default UpcomingEvents;
