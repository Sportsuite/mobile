import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="email-verify" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="account-reset" />
      <Stack.Screen name="reset-verify-email" />
    </Stack>
  );
};

export default AuthLayout;
