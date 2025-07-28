import React from "react";
import { Stack } from "expo-router";

const EventsBaseLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="event-details" />
        <Stack.Screen name="ticket-options" />
        <Stack.Screen name="booked-tickets" />
      </Stack>
    </>
  );
};

export default EventsBaseLayout;
