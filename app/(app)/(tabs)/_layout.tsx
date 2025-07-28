import React from "react";
import { Tabs, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSize } from "@/utils/useScaleSize";
import {
  BackHandler,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";

const TabLayout = () => {
  const colorScheme = useColorScheme();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Returning true disables the back button
      };

      // Add event listener and get the subscription
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // Cleanup function
      return () => {
        backHandler.remove(); // Proper cleanup using the subscription
      };
    }, [])
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0052FF", // Active font and icon colour
        tabBarInactiveTintColor: colorScheme === "dark" ? "white" : "#616161", // Inactive font and icon colour
        tabBarLabelStyle: {
          fontSize: getSize(2.5, "width"), // Font size for the labels
          fontFamily: "Montserrat_500Medium",
        },
        tabBarIconStyle: {
          width: 36, // Icon container width
          height: 36, // Icon container height
        },
        headerShown: false, // Disable the default header
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#131214" : "#EDF1F7", // Background colour of the tab bar
          height:
            Platform.OS === "ios"
              ? getSize(10, "height")
              : getSize(8, "height"), // Height of the tab bar
          justifyContent: "center", // Centre tabs vertically
          alignItems: "center", // Centre tabs horizontally
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarButton: (props: any) => (
          <TouchableWithoutFeedback>
            <Pressable
              ref={props.accessibilityElementsHidden ? undefined : props.ref}
              {...props}
              android_ripple={{
                color: "transparent",
                borderless: true,
              }}
            />
          </TouchableWithoutFeedback>
        ),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={getSize(6, "width")}
            />
          ),
        }}
      />
      {/* Events Tab */}
      <Tabs.Screen
        name="events"
        options={{
          tabBarLabel: "Events",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
              size={getSize(6, "width")}
            /> // Icon size
          ),
        }}
      />

      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={getSize(6, "width")}
            /> // Icon size
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={getSize(6, "width")}
            /> // Icon size
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
