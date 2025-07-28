import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  ScrollView,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import Button from "@/components/shared/Button";
import useLocationPermission from "@/hooks/useLocationPermission";
import ToastMsg from "@/components/shared/ToastMsg";
import PageTitle from "@/components/shared/PageTitle";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { useFocusEffect } from "expo-router";

const LocationPermission = () => {
  const statusBarHeight = useStatusBarHeight();
  const {
    requestPermission,
    initialisePermission,
    status,
    locationInfo,
    loading,
  } = useLocationPermission();

  const handleGrantAccess = () => {
    if (status === "granted") {
      ToastMsg("Permission already granted", "Info", "info");
      return;
    }
    requestPermission();
  };

  useFocusEffect(() => {
    initialisePermission();
  });

  return (
    <SafeAreaView className="flex-1 bg-Primary dark:bg-Dark">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StatusBar style="light" />

        <ImageBackground
          source={require("../../../assets/images/background_pattern.png")}
          resizeMode="cover"
          style={{
            flex: 1,
            paddingTop: statusBarHeight,
          }}
        >
          <PageTitle title="Location Details" />

          <View
            style={{ marginTop: statusBarHeight }}
            className={`bg-white rounded-3xl justify-center items-center p-6 h-[85%] dark:bg-Dark`}
          >
            <Image
              className="self-center"
              source={require("../../../assets/icons/location.png")}
              style={{
                width: getSize(42, "width"),
                height: getSize(42, "width"),
                marginVertical: 25,
              }}
            />
            {loading ? (
              <CustomActivityIndicator
                size="large"
                className="flex-1 justify-center"
              />
            ) : status !== "granted" ? (
              <>
                <Text className="font-montserratBold text-lg py-2 dark:text-white">
                  Location Access Needed
                </Text>
                <Text className="text-center font-montserratRegular text-gray-500 mb-6 dark:text-stone-200">
                  We use your location to show nearby events and activities.
                  Your data stays private and secure.
                </Text>
                <Button
                  title="Continue"
                  size="medium"
                  borderRadius="rounded-2xl"
                  padding="py-6"
                  color="bg-Primary dark:bg-Dark dark:border dark:border-white"
                  textColor="text-white dark:text-white"
                  textSize="text-xl"
                  fullWidth
                  onPress={handleGrantAccess}
                />
              </>
            ) : (
              <View className="items-start w-full">
                <Text className="font-montserratBold text-lg py-2 w-full text-center dark:text-white">
                  Current Location Details
                </Text>
                <View className="flex-row w-full justify-between">
                  <View className="bg-LightGray flex-1 p-4 rounded-2xl dark:bg-white/10">
                    <Text className="font-montserratBold text-xl dark:text-stone-200">
                      {locationInfo?.[0]?.country}
                    </Text>
                    <Text className="font-montserratRegular text-sm dark:text-stone-200">
                      Country
                    </Text>
                  </View>
                  <View className="flex-1 ml-2">
                    <View className="bg-LightGray p-4 rounded-2xl mb-2 dark:bg-white/10">
                      <Text className="font-montserratBold text-xl dark:text-stone-200">
                        {locationInfo?.[0]?.city}
                      </Text>
                      <Text className="font-montserratRegular text-sm dark:text-stone-200">
                        City
                      </Text>
                    </View>
                    <View className="bg-LightGray p-4 rounded-2xl dark:bg-white/10">
                      <Text className="font-montserratBold text-xl dark:text-stone-200">
                        {locationInfo?.[0]?.postalCode}
                      </Text>
                      <Text className="font-montserratRegular text-sm dark:text-stone-200">
                        Postal Code
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="bg-LightGray w-full mt-4 p-4 rounded-2xl dark:bg-white/10">
                  <Text className="font-montserratBold text-xl dark:text-stone-200">
                    {locationInfo?.[0]?.formattedAddress}
                  </Text>
                  <Text className="font-montserratRegular text-sm dark:text-stone-200">
                    Address
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationPermission;
