import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import BackButtonBg from "@/components/shared/BackButtonBg";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import Button from "@/components/shared/Button";
import SelectTicketListItem from "@/components/Event/SelectTicketListItem";
import { useSearchParams } from "expo-router/build/hooks";
import { useLazyQuery } from "@apollo/client";
import { GET_ADMIN_EVENT_TICKETS } from "@/graphql/queries/event.query";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { router } from "expo-router";
import ToastMsg from "@/components/shared/ToastMsg";

const SelectTickets = () => {
  const params = useSearchParams();
  const selectedEvent: EventObj = JSON.parse(
    params.get("selectedEvent") || "{}"
  );
  const [tickets, setTickets] = React.useState<Partial<Ticket[]>>([]);
  const [selectedTicketIDs, setSelectedTicketIDs] = React.useState<string[]>(
    []
  );
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();

  const [getTickets, { loading }] = useLazyQuery(GET_ADMIN_EVENT_TICKETS, {
    onCompleted: ({ GetAdminEventTickets: { data } }) => {
      setTickets(data);
    },
    onError: (error) => {
      ToastMsg(error.message, "Error fetching tickets");
    },
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    getTickets({
      variables: {
        event: selectedEvent?.id,
      },
    });
  }, [selectedEvent?.id]);

  const handleSelectTicket = (ticketId: string) => {
    if (selectedTicketIDs.includes(ticketId)) {
      setSelectedTicketIDs((prev) => prev.filter((id) => id !== ticketId));
    } else {
      setSelectedTicketIDs((prev) => [...prev, ticketId]);
    }
  };

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#131214" : "#0052FF",
      }}
    >
      {/* Top Navigation */}
      <View className="items-center justify-between flex-row px-2 pb-4">
        <BackButtonBg />
        <Text className="font-montserratBold text-stone-50">Select Ticket</Text>
        <Text></Text>
      </View>

      {/* Event Details */}
      <View className="px-4 mb-4">
        <Text className="font-montserratMedium text-stone-100">
          {formatDateToReadableString(selectedEvent?.startDate?.date)} -{" "}
          {formatDateToReadableString(selectedEvent?.endDate.date)}
        </Text>
        <Text className="font-montserratExtraBold text-2xl text-stone-100">
          {selectedEvent?.title}
        </Text>
      </View>

      {/* Other details */}
      <View className="flex-1 bg-white rounded-t-3xl px-4 dark:bg-white/10">
        {/* Top control */}
        <View className="flex-row items-center justify-between py-2 mt-4">
          <Text className="text-center py-4 font-montserratMedium text-sm dark:text-white">
            Select event tickets to proceed
          </Text>

          {tickets?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                if (selectedTicketIDs.length === tickets?.length) {
                  setSelectedTicketIDs([]);
                } else {
                  setSelectedTicketIDs(
                    tickets?.map((ticket) => String(ticket!.id))
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <Text className="font-montserratBold text-lg dark:text-Accent">
                {`${
                  selectedTicketIDs.length === tickets?.length
                    ? "Unselect"
                    : "Select"
                } All`}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List of tickets  */}
        {!loading && tickets?.length > 0 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {tickets.map((ticket, index) => (
              <SelectTicketListItem
                onPress={() => handleSelectTicket(String(ticket?.id))}
                ticket={ticket}
                isSelected={selectedTicketIDs.includes(String(ticket!.id))}
                key={index}
              />
            ))}
            {selectedTicketIDs?.length > 0 && (
              <Button
                title="Proceed"
                onPress={() => {
                  router.push({
                    pathname:
                      "/profilebase/administration/event-checkin/check-in",
                    params: {
                      selectedTickets: JSON.stringify(selectedTicketIDs),
                      eventId: selectedEvent?.id,
                    },
                  });
                }}
                margin="my-4"
                padding="py-6"
              />
            )}
          </ScrollView>
        )}
        {!loading && tickets?.length === 0 && (
          <View className="justify-center items-center h-96">
            <Text className="font-montserratRegular text-lg dark:text-white">
              No tickets available for this event
            </Text>
          </View>
        )}
        {loading && (
          <CustomActivityIndicator className="flex-1 justify-center items-center" />
        )}
      </View>
    </View>
  );
};

export default SelectTickets;
