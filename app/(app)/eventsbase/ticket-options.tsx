import { View, Text, ScrollView, FlatList, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import BackButtonBg from "@/components/shared/BackButtonBg";
import CartButton from "@/components/shared/CartButton";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import useEventStore from "@/store/eventStore";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import Filter from "@/components/Ticket/Filter";
import { useLazyQuery } from "@apollo/client";
import { GET_EVENT_TICKETS, GET_SESSIONS } from "@/graphql/queries/event.query";
import Session from "@/components/Ticket/Session";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import TicketOption from "@/components/Ticket/TicketOption";
import { router } from "expo-router";
import NotFoundContent from "@/components/shared/NotFoundContent";
import CartInfo from "@/components/Cart/CartInfo";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import ToastMsg from "@/components/shared/ToastMsg";
import { useCartStore } from "@/store";

const TicketOptions = () => {
  const eventDetails = useEventStore((state) => state.eventDetails);
  const { id, stadium, startDate, endDate, city, country } = eventDetails;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined
  );
  const [isGiantScreen, setIsGiantScreen] = useState(false);
  const [isDisabledAccess, setIsDisabledAccess] = useState(false);
  const [isNumberedSeat, setIsNumberedSeat] = useState(false);
  const [isCoveredGrandstand, setIsCoveredGrandstand] = useState(false);
  const colorScheme = useColorScheme();
  const totalTickets = useCartStore((state) => state.getTotalTicketCount());

  const [getSessions, { loading }] = useLazyQuery(GET_SESSIONS, {
    onCompleted: ({ GetSessions: { data } }) => {
      if (data) {
        const sortedSessions = [...data].sort(
          (a, b) => b.totalTicket - a.totalTicket
        );
        setSessions(sortedSessions);
      }
    },
    onError: (error) => {
      ToastMsg(error.message, "Error fetching sessions");
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const [getTickets, { loading: eloading }] = useLazyQuery(GET_EVENT_TICKETS, {
    onCompleted: ({ GetEventTickets: { data } }) => {
      if (data) {
        setTickets(data);
      }
    },
    onError: (error) => {
      ToastMsg(error.message, "Error fetching tickets");
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getSessions({
      variables: {
        event: id,
      },
    });
  }, [id, getSessions]);

  useEffect(() => {
    if (sessions.length > 0 && eventDetails?.id) {
      setSelectedSession(sessions[0]);
      if (selectedSession) {
        getTickets({ variables: { event: id, session: selectedSession.id } });
      }
    }
  }, [sessions, eventDetails]);

  useEffect(() => {
    if (sessions.length > 0 && eventDetails?.id) {
      if (selectedSession) {
        getTickets({
          variables: {
            event: id,
            session: selectedSession.id,
          },
        });
      }
    }
  }, [selectedSession]);

  const statusBarHeight = useStatusBarHeight();

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#131214" : "#0052FF",
      }}
    >
      {/* Top Navigation */}
      <View className="justify-between items-center flex-row px-4 pb-4">
        <BackButtonBg />
        <Text className="font-montserratBold text-stone-50">
          Ticket Categories
        </Text>
        <CartButton iconColor="white" textStyle="text-white" />
      </View>

      {/* Event Details */}
      <View className="px-4 mb-4">
        <Text className="font-montserratMedium text-stone-100">
          {formatDateToReadableString(startDate.date)} -{" "}
          {formatDateToReadableString(endDate.date)}
        </Text>
        <Text className="font-montserratExtraBold text-2xl text-stone-100">
          {`${city?.name} - ${country?.name}`}
        </Text>
      </View>

      {/* Other details */}
      <View className="flex-1">
        <View className="flex-1 bg-white rounded-t-3xl dark:bg-white/10">
          {/* Arena Name */}
          <Text className="text-center py-4 font-montserratSemiBold text-xl dark:text-white">
            {stadium}
          </Text>
          {/* Session and filter sections */}
          <View>
            {/* session select */}
            <View className="flex-row items-center px-6">
              <Text className="font-montserratRegular text-gray-500 text-sm dark:text-white">
                Select Session
              </Text>
              <Ionicons
                name="chevron-forward"
                className="mt-1"
                size={20}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            </View>

            {/* session Options */}
            {loading && sessions.length < 1 ? (
              <CustomActivityIndicator className="py-4 items-start px-6" />
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="my-4 flex-row px-6 gap-3">
                  {sessions.length > 0 ? (
                    sessions.map((session, index) => {
                      return (
                        <Session
                          key={index.toString()}
                          session={session}
                          onPress={() => setSelectedSession(session)}
                          selected={selectedSession}
                        />
                      );
                    })
                  ) : (
                    <Text className="font-montserratRegular text-gray-500 text-sm dark:text-white">
                      No sessions available
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Filter By options */}
            <View className="flex-row items-center px-6">
              <Text className="font-montserratRegular text-gray-500 text-sm dark:text-white">
                Filter By options
              </Text>
              <Ionicons
                name="chevron-forward"
                className="mt-1"
                size={20}
                color={colorScheme === "dark" ? "white" : "grey"}
              />
            </View>

            {/* filter Options */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="my-4 flex-row px-6 gap-3">
                <Filter
                  icon={
                    <MaterialCommunityIcons
                      name="projector-screen-outline"
                      size={22}
                      color={isGiantScreen ? "#0052FF" : "white"}
                    />
                  }
                  title="Giant Screen"
                  isSelected={isGiantScreen}
                  onPress={() => setIsGiantScreen(!isGiantScreen)}
                />

                <Filter
                  icon={
                    <MaterialCommunityIcons
                      name="wheelchair-accessibility"
                      size={22}
                      color={isDisabledAccess ? "#0052FF" : "white"}
                    />
                  }
                  isSelected={isDisabledAccess}
                  title="Disabled Access"
                  onPress={() => setIsDisabledAccess(!isDisabledAccess)}
                />

                <Filter
                  icon={
                    <MaterialIcons
                      name="chair-alt"
                      size={22}
                      color={isNumberedSeat ? "#0052FF" : "white"}
                    />
                  }
                  isSelected={isNumberedSeat}
                  title="Numbered Seat"
                  onPress={() => setIsNumberedSeat(!isNumberedSeat)}
                />

                <Filter
                  icon={
                    <MaterialIcons
                      name="warehouse"
                      size={24}
                      color={isCoveredGrandstand ? "#0052FF" : "white"}
                    />
                  }
                  isSelected={isCoveredGrandstand}
                  title="Covered Grandstand"
                  onPress={() => setIsCoveredGrandstand(!isCoveredGrandstand)}
                />
              </View>
            </ScrollView>
          </View>

          {/* Options Available */}
          <View className="px-6 flex-1">
            <Text className="font-montserratRegular text-sm mb-4 dark:text-white">
              {tickets.length} {`${tickets.length > 1 ? "Options" : "Option"}`}{" "}
              Available
            </Text>
            {eloading && tickets.length < 1 ? (
              <CustomActivityIndicator className="py-36" size="large" />
            ) : (
              <FlatList
                data={tickets.filter((ticket) => {
                  if (isCoveredGrandstand && !ticket.options.coveredGrandstand)
                    return false;
                  if (isDisabledAccess && !ticket.options.disabledAccess)
                    return false;
                  if (isGiantScreen && !ticket.options.giantScreen)
                    return false;
                  if (isNumberedSeat && !ticket.options.numberedSeat)
                    return false;
                  return true;
                })}
                renderItem={({ item }) => (
                  <TicketOption
                    ticket={item}
                    onPress={() =>
                      router.push({
                        pathname: "/eventsbase/ticket-details",
                        params: {
                          ticket: JSON.stringify(item),
                        },
                      })
                    }
                  />
                )}
                contentContainerStyle={{
                  paddingBottom: totalTickets ? 100 : 20,
                }} // Add space for CartInfo
                style={{ flex: 1 }}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <NotFoundContent
                    className="my-16"
                    title="Ooops!"
                    titleColor="text-stone-500"
                    subtitle="No tickets found for this session. Try selecting another session, adjusting the filters, or check back later."
                    subtitleColor="text-stone-600"
                  />
                }
              />
            )}
          </View>
          <CartInfo />
        </View>
      </View>
    </View>
  );
};

export default TicketOptions;
