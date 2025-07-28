import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/store/context/auth-context";

const AppLayout = () => {
  const { token } = useAuth();

  if (!token) return <Redirect href={"/login"} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default AppLayout;
