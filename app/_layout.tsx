import React, { useEffect } from "react";
import { Slot } from "expo-router"; // Import Stack from Expo Router for navigation
import "../global.css";
import {
  Montserrat_400Regular,
  Montserrat_300Light,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/montserrat"; // Import Montserrat fonts and useFonts hook
import * as SplashScreen from "expo-splash-screen";
import AuthContextProvider from "@/store/context/auth-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { StatusBar } from "expo-status-bar";
import CustomStripeProvider from "@/components/Stripe/CustomStripeProvider";
import ThemeWrapper from "@/components/ThemeWrapper";
import { LogBox } from "react-native";
import ApolloProviderWrapper from "@/services/ApolloProviderWrapper";
import Toast from "react-native-toast-message";
import ToastMsg from "@/components/shared/ToastMsg";

// Suppress specific warning
LogBox.ignoreLogs([
  "TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.",
  "TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

SplashScreen.preventAutoHideAsync();

// RootLayout component to define the root layout of the app
const RootLayout = () => {
  // Load Montserrat fonts and track loading status and errors
  const [fontsLoaded, fontsError] = useFonts({
    Montserrat_400Regular,
    Montserrat_300Light,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  // useEffect hook to hide splash screen once fonts are loaded or if there is an error
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
    if (fontsError?.message) {
      ToastMsg(fontsError.message, "Fonts Loading Failed");
    }
  }, [fontsLoaded, fontsError]); // Dependency array for useEffect

  // If fonts are not loaded and there is no error, return null (render nothing)
  // Show custom splash while loading
  if (!fontsLoaded) return null;

  return (
    <ThemeWrapper>
      <AuthContextProvider>
        <CustomStripeProvider>
          <ApolloProviderWrapper>
            <RootSiblingParent>
              <Slot />
              <Toast />
              <StatusBar style="auto" />
            </RootSiblingParent>
          </ApolloProviderWrapper>
        </CustomStripeProvider>
      </AuthContextProvider>
    </ThemeWrapper>
  );
};

export default RootLayout; // Export the RootLayout component as default
