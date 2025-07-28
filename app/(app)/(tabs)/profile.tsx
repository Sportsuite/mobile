import Button from "@/components/shared/Button";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import {
  Ionicons,
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import DoubleIconTextButton from "@/components/shared/DoubleIconTextButton";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import UserBio from "@/components/Profile/UserBio";
import { useAuth } from "@/store/context/auth-context";
import QRCode from "react-native-qrcode-svg";
import { getSize } from "@/utils/useScaleSize";
import { useStatusBarHeight } from "@/utils/useMarginTop";

const Profile = () => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const profileBottomSheetRef = useRef<any>(null);
  const colorScheme = useColorScheme();

  const [showQRCodeModal, setShowQRCodeModal] = useState<boolean>(false);
  const QRCodeBottomSheetRef = useRef<any>(null);
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
    }
  };
  const statusBarHeight = useStatusBarHeight();

  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        flex: 1,
        paddingHorizontal: 2,
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {/* Title and Change Image Button */}
          <View className="flex-row items-center justify-between m-2">
            <View>
              <Text className="text-2xl font-montserratBold dark:text-white">
                Your Profile
              </Text>
              <Text className="text-sm font-montserratRegular text-Gray dark:text-Accent">
                Manage your account seaamlessly
              </Text>
            </View>
            {user?.admin && (
              <Button
                onPress={() =>
                  router.push("/profilebase/administration/landing")
                }
                title="Administrator"
                size="small"
                textFont="text-xs"
                borderRadius="rounded-lg"
                padding="px-4 py-4"
                color={"bg-Primary"}
                textColor="text-white"
                icon={
                  <Ionicons name={"shield-outline"} color={"white"} size={14} />
                }
              />
            )}
          </View>

          {/* User Bio */}
          <UserBio
            onProfilePress={() => {
              profileBottomSheetRef.current?.open();
              setShowProfileModal(true);
            }}
            onQRCodePress={() => {
              QRCodeBottomSheetRef.current?.open();
              setShowQRCodeModal(true);
            }}
          />

          {/* List of Button Navigation Options */}
          <Text className="mt-8 mb-4 mx-3 font-montserratSemiBold text-Primary dark:text-Accent">
            App Setting
          </Text>
          <View className="gap-3 mx-2  mb-4">
            <DoubleIconTextButton
              subText="Manage booked event"
              onPress={() => router.push("/eventsbase/booked-events")}
              text="Booked Events"
              leftIcon={
                <Ionicons name={"bookmark-outline"} color={"white"} size={24} />
              }
            />

            <DoubleIconTextButton
              subText="Change your current email address"
              onPress={() =>
                router.push("/profilebase/email-update/old-email-change")
              }
              text="Change Email"
              leftIcon={
                <Ionicons name={"at-outline"} color={"white"} size={24} />
              }
            />

            <DoubleIconTextButton
              subText="Update your current mobile number"
              onPress={() => router.push("/profilebase/update-phone-number")}
              text="Update Mobile Number"
              leftIcon={
                <Ionicons name={"call-outline"} color={"white"} size={24} />
              }
            />

            <DoubleIconTextButton
              subText="The system uses your location to recommend events and other activities for you"
              // onPress={() => router.push("/profilebase/update-location")}
              onPress={() => router.push("/profilebase/location-permission")}
              text="Location"
              leftIcon={
                <Ionicons name={"location-outline"} color={"white"} size={24} />
              }
            />

            <DoubleIconTextButton
              subText="Choose light, dark or use system default theme"
              onPress={() =>
                router.push("/profilebase/theme-preferences/theme-settings")
              }
              text="Theme Preferences"
              leftIcon={
                <Ionicons
                  name={"color-palette-outline"}
                  color={"white"}
                  size={24}
                />
              }
            />

            <Text className="mt-8 mb-4 mx-3 font-montserratSemiBold text-Primary dark:text-Accent">
              Security Setting
            </Text>
            <DoubleIconTextButton
              subText="Trusted contacts we can reach in case of an emergency during your trip."
              onPress={() =>
                router.push("/profilebase/emergency-contacts/contacts")
              }
              text="Emergency Contacts"
              leftIcon={
                <MaterialIcons
                  name="contact-emergency"
                  color={"white"}
                  size={24}
                />
              }
            />
            <DoubleIconTextButton
              subText="Change your password to strengthen your account security"
              onPress={() => router.push("/profilebase/update-password")}
              text="Change Password"
              leftIcon={
                <Ionicons name={"key-outline"} color={"white"} size={24} />
              }
            />

            <Text className="my-4 mx-3 font-montserratSemiBold text-Primary dark:text-Accent">
              About Application
            </Text>
            <DoubleIconTextButton
              onPress={() => router.push("/profilebase/about")}
              text="About App"
              leftIcon={
                <Ionicons
                  name={"alert-circle-outline"}
                  color={"white"}
                  size={24}
                />
              }
              rightText="Version: 0.012"
            />
          </View>
        </View>
      </ScrollView>

      {/* Profile Details BottomSheet */}
      {showProfileModal && (
        <ReusableBottomSheet
          ref={profileBottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "70%"]}
        >
          <ScrollView className="p-4">
            {/* Basic User Info */}
            <View>
              {/* Header */}
              <View className="flex-row justify-between items-center">
                <Text className="font-montserratBold text-Primary dark:text-Accent">
                  Basic
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-row items-center"
                >
                  <Text className="font-montserratBold text-Primary dark:text-Accent">
                    Update Basic Information
                  </Text>
                  <View className="rounded-full bg-Primary ml-2 dark:bg-Accent">
                    <Entypo
                      name="chevron-small-right"
                      size={24}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {/* Body */}
              <View className="gap-5 my-4">
                <DoubleIconTextButton
                  subText={user?.name}
                  subTextStyle="font-montserratBold text-black text-lg"
                  text="Name"
                  textFont="font-montserratRegular"
                  titleStyle="text-sm"
                  containerPadding="py-4"
                  showRightIcon={false}
                  leftIcon={
                    <FontAwesome6 name="circle-user" size={20} color="white" />
                  }
                />

                <DoubleIconTextButton
                  subText={user?.gender ?? ""}
                  subTextStyle="font-montserratBold text-black text-lg"
                  text="Gender"
                  textFont="font-montserratRegular"
                  titleStyle="text-sm"
                  containerPadding="py-4"
                  showRightIcon={false}
                  leftIcon={
                    <MaterialCommunityIcons
                      name="gender-male-female"
                      size={20}
                      color="white"
                    />
                  }
                />
              </View>
            </View>

            {/* User Account Info */}
            <View className="mt-4">
              {/* Header */}
              <Text className="font-montserratBold text-Primary dark:text-Accent">
                Account
              </Text>
              {/* Body */}
              <View className="gap-5 my-4">
                <DoubleIconTextButton
                  onPress={() => {
                    router.push("/profilebase/email-update/old-email-change");
                    setShowProfileModal(false);
                  }}
                  subText={user?.email ?? ""}
                  subTextStyle="font-montserratBold text-black text-lg"
                  text="Email Address"
                  textFont="font-montserratRegular"
                  titleStyle="text-sm"
                  containerPadding="py-4"
                  leftIcon={<Entypo name="email" size={24} color="white" />}
                  rightIconBg="bg-Primary rounded-full p-1"
                />

                <DoubleIconTextButton
                  onPress={() => {
                    router.push("/profilebase/update-phone-number");
                    setShowProfileModal(false);
                  }}
                  subText={user?.phone ?? ""}
                  subTextStyle="font-montserratBold text-black text-lg"
                  text={"Mobile Number"}
                  textFont="font-montserratRegular"
                  titleStyle="text-sm"
                  containerPadding="py-4"
                  leftIcon={<Feather name="phone" size={24} color="white" />}
                  rightIconBg="bg-Primary rounded-full p-1"
                />
              </View>
            </View>

            {/* User Location Info */}
            <View className="mt-4">
              {/* Header */}
              <View className="flex-row justify-between items-center">
                <Text className="font-montserratBold text-Primary dark:text-Accent">
                  Current Location
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/profilebase/update-location");
                    setShowProfileModal(false);
                  }}
                  activeOpacity={0.8}
                  className="flex-row items-center"
                >
                  <Text className="font-montserratBold text-Primary dark:text-Accent">
                    Update Location
                  </Text>
                  <View className="rounded-full bg-Primary ml-2 dark:bg-Accent">
                    <Entypo
                      name="chevron-small-right"
                      size={24}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              {/* Body */}
              <View className="gap-5 my-4">
                <DoubleIconTextButton
                  subText={user?.currentLocation?.country ?? "Not Set"}
                  subTextStyle="font-montserratBold text-black text-lg"
                  text="Country"
                  textFont="font-montserratRegular"
                  titleStyle="ml-4 text-sm"
                  containerPadding="py-4"
                  showRightIcon={false}
                />

                <View className="flex-row w-full justify-between items-center">
                  <View className="border border-gray-200 rounded-lg py-4 px-8 flex-1 mr-2">
                    <Text className="text-sm dark:text-white">State</Text>
                    <Text className="font-montserratBold text-black text-lg dark:text-white">
                      {user?.currentLocation?.state ?? "Not Set"}
                    </Text>
                  </View>

                  <View className="border border-gray-200 rounded-lg py-4 px-8 flex-1 ml-2">
                    <Text className="text-sm dark:text-white">City</Text>
                    <Text className="font-montserratBold text-black text-lg dark:text-white">
                      {user?.currentLocation?.city ?? "Not Set"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ReusableBottomSheet>
      )}

      {/* QRCode Details BottomSheet */}
      {showQRCodeModal && (
        <ReusableBottomSheet
          ref={QRCodeBottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "50%"]}
        >
          <View
            className="p-4  items-center justify-center"
            style={{ height: getSize(100, "width") }}
          >
            <QRCode
              size={getSize(70, "width")}
              value="http://awesome.link.qr"
            />
            <Text className="font-montserratRegular pt-10 text-sm dark:text-white">
              Show the QR code at the event venue
            </Text>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default Profile;
