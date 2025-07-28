import { Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSize } from "@/utils/useScaleSize";
import SearchInput from "@/components/shared/SearchInput";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_USER_EVENTS_SEARCH_HISTORY,
  SEARCH_EVENTS,
} from "@/graphql/queries/event.query";
import EventCompBig from "@/components/Event/EventCompBig";
import { router } from "expo-router";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { CLEAR_USER_SEARCH_HISTORY } from "@/graphql/mutations/event.mutate";
import Button from "@/components/shared/Button";
import useEventStore from "@/store/eventStore";
import ZoomInFlatList from "@/components/shared/ZoomInFlatList";
import ToastMsg from "@/components/shared/ToastMsg";

const Search = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<EventObj[]>([]);
  const [prevSearchEvents, setPrevSearchEvents] = useState<EventObj[]>([]);
  const [showNoResults, setShowNoResults] = useState<boolean>(false);

  const setEventDetails = useEventStore((state) => state.setEventDetails);

  const [searchEvents, { loading }] = useLazyQuery(SEARCH_EVENTS, {
    onError: (error) => {
      ToastMsg(error.message, "Search Events Failed");
    },
    onCompleted: (d) => {
      if (d) {
        const { docs } = d.SearchEvents.data;
        if (docs.length <= 0) {
          setShowNoResults(true);
          setEvents([]);
          return;
        } else {
          setShowNoResults(false);
        }
        setEvents(docs);
      }
    },
  });

  const [getEventHistory, { loading: hLoading }] = useLazyQuery(
    GET_USER_EVENTS_SEARCH_HISTORY,
    {
      fetchPolicy: "network-only",
      onError: (error) => {
        ToastMsg(error.message, "Event Search History Failed");
      },
      onCompleted: (d) => {
        if (d) {
          const { data } = d.GetEventSearchHistories;
          setPrevSearchEvents(data);
        }
      },
    }
  );

  const [clearHistory, { loading: cloading }] = useMutation(
    CLEAR_USER_SEARCH_HISTORY,
    {
      onError: (error) => {
        ToastMsg(error.message, "Event Search History Clear Failed");
      },
      onCompleted: (d) => {
        if (d) {
          setPrevSearchEvents([]);
        }
      },
    }
  );

  const [searchTimeout, setSearchTimeout] = useState<any>(null);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearch(text);

      // Clear existing timeout if user types again
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set new timeout for 5 seconds
      const timeout = setTimeout(() => {
        if (!text) {
          setEvents([]);
          return;
        }
        searchEvents({
          variables: {
            search: text,
          },
        });
      }, 2000);

      setSearchTimeout(timeout);
    },
    [searchTimeout]
  );

  const setActiveEventDetails = (details: EventObj) => {
    setEventDetails(details);
    router.push("/eventsbase/event-details");
  };

  const renderItem = ({ item }: { item: EventObj }) => (
    <EventCompBig
      onPress={() => setActiveEventDetails(item)}
      className="mb-4"
      eventItem={item}
    />
  );

  const renderItemPrev = ({ item }: { item: EventObj }) => (
    <EventCompBig
      onPress={() => setActiveEventDetails(item)}
      className="mb-4"
      eventItem={item}
    />
  );

  useEffect(() => {
    if (search.length === 0) {
      getEventHistory();
    }
  }, [search]);

  return (
    <SafeAreaView className="flex-1 px-4 bg-white dark:bg-Dark">
      <Text
        className="font-montserratBold py-4 dark:text-white"
        style={{ fontSize: getSize(7, "width") }}
      >
        Event Search
      </Text>

      {/* Search Input */}
      <SearchInput
        clearSearch={() => setSearch("")}
        className="mb-6"
        onChangeText={handleSearchChange}
        value={search}
      />

      {/* default state  */}
      {!hLoading &&
        !loading &&
        !search &&
        events.length === 0 &&
        prevSearchEvents.length === 0 && (
          <NotFoundContent
            title="Search to find events"
            subtitle="Enter keywords in the search bar to discover exciting events"
          />
        )}

      {/* No Search Results Found */}
      {!loading && showNoResults && search && (
        <NotFoundContent
          title="Oops!"
          subtitle="We couldn't find anything matching your search. Please try different keywords."
        />
      )}

      {/* Search Results */}
      {hLoading || loading ? (
        <CustomActivityIndicator size="large" />
      ) : (
        events.length > 0 &&
        search && (
          <ZoomInFlatList
            scrollAxis="y"
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        )
      )}

      {/* Previously Searched Events */}
      {search.length === 0 &&
        !hLoading &&
        !loading &&
        prevSearchEvents.length > 0 && (
          <>
            <Text
              className="font-montserratSemiBold py-4 dark:text-white"
              style={{ fontSize: getSize(4, "width") }}
            >
              Previously Searched Events
            </Text>
            <ZoomInFlatList
              scrollAxis="y"
              // showsVerticalScrollIndicator={false}
              data={prevSearchEvents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItemPrev}
              ListFooterComponent={
                <View className="mx-2 my-4">
                  {cloading ? (
                    <CustomActivityIndicator />
                  ) : (
                    <Button
                      onPress={async () => {
                        await clearHistory();
                      }}
                      title="Clear Search History"
                      size="medium"
                      textSize="text-lg"
                      textFont="font-montserratBold"
                      borderRadius="rounded-lg"
                      padding="px-4 py-4"
                      color={"bg-transparent"}
                      textColor="text-Primary  dark:text-Accent"
                      border="border border-Primary dark:border-Accent"
                    />
                  )}
                </View>
              }
            />
          </>
        )}
    </SafeAreaView>
  );
};

export default Search;
