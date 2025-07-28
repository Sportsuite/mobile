import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Platform,
  Share,
  useColorScheme,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import IconButton from "@/components/shared/IconButton";
import Feather from "@expo/vector-icons/Feather";
import BottomIndicator from "@/components/OnBoarding/BottomIndicator";
import { getSize } from "@/utils/useScaleSize";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/shared/Button";
import PageTitle from "@/components/shared/PageTitle";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import QRCode from "react-native-qrcode-svg";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import TicketDetail from "@/components/Event/BookedEvent/TicketDetail";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { useLazyQuery } from "@apollo/client";
import { GET_TICKETS_ORDERS } from "@/graphql/queries/event.query";
import { useSearchParams } from "expo-router/build/hooks";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { Image } from "expo-image";
import ToastMsg from "@/components/shared/ToastMsg";

export default function BookedTickets() {
  const params = useSearchParams();
  const orderId: string = params.get("orderId") || "";
  const statusBarHeight = useStatusBarHeight();
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQRCodeModal, setShowQRCodeModal] = useState<boolean>(false);
  const QRCodeBottomSheetRef = useRef<any>(null);
  const ticketRef = useRef<View>(null);
  const QRcodeRef = useRef<View>(null);
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
    }
  };
  const [loaded, setLoaded] = useState(false);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const colorScheme = useColorScheme();

  // Get the currently visible ticket
  const currentTicket = useMemo(() => {
    return tickets[currentIndex];
  }, [currentIndex, tickets]);

  const handleSaveImage = async () => {
    setIsSavingImage(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      // Capture the view
      const uri = await captureRef(ticketRef, {
        format: "png",
        quality: 1,
      });
      // Save to gallery
      await MediaLibrary.saveToLibraryAsync(uri);
      alert("Ticket saved to your photos!");
      setIsSavingImage(false);
    } catch (error) {
      console.error("Error saving image:", error);
      alert("Failed to save ticket");
    }
  };

  const handleShareQRCode = async () => {
    setIsTakingScreenshot(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      // 1. Capture the ticket
      const uri = await captureRef(QRcodeRef, {
        format: "png",
        quality: 1,
      });

      // 2. First save to gallery (with permission check)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(uri);
      }

      // 3. Prepare sharing options
      const shareOptions = {
        title: "My Event Ticket",
        message: "Check out my ticket! 🎟️", // Optional message
        url: uri,
        // iOS specific
        subject: "Event Ticket", // Email subject
        // Android specific
        dialogTitle: "Share Ticket",
      };

      // 4. Platform-specific sharing
      if (Platform.OS === "ios") {
        // iOS - use Share API first
        await Share.share(shareOptions);
      } else {
        // Android - use expo-sharing for more control
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: shareOptions.dialogTitle,
          });
        } else {
          // Fallback to React Native Share
          await Share.share(shareOptions);
        }
      }
      setIsTakingScreenshot(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error sharing ticket");
    }
  };

  const [getTickets, { loading }] = useLazyQuery(GET_TICKETS_ORDERS, {
    onError: (error) => {
      ToastMsg(error.message, "Tickets Failed");
    },
    onCompleted: ({ GetOrder: { data } }) => {
      if (data) {
        const { tickets } = data.event;
        setTickets(tickets);
        setLoaded(true);
      }
    },
  });

  useEffect(() => {
    if (orderId) {
      getTickets({
        variables: {
          getOrderId: orderId,
        },
      });
    }
  }, []);

  return (
    <GestureHandlerRootView
      style={{
        paddingTop: statusBarHeight,
        backgroundColor: colorScheme === "dark" ? "#131214" : "#0052FF",
        flex: 1,
        paddingHorizontal: 5,
      }}
    >
      <View
        className={`bg-Primary ${isSavingImage && "py-8"} dark:bg-Dark`}
        ref={ticketRef}
        collapsable={false}
      >
        {/* Top navigation */}
        {!isSavingImage && (
          <PageTitle
            bgBack={true}
            title="Event Tickets"
            className="text-white"
          />
        )}

        {loading && !loaded && (
          <CustomActivityIndicator
            color="white"
            className="justify-center items-center flex-1"
          />
        )}

        {!loading && loaded && (
          <View>
            {/* buttons and swiper */}
            <View className="items-center justify-center mt-4">
              <View className="flex flex-row justify-between">
                <BottomIndicator
                  scrollX={scrollX}
                  data={tickets}
                  color="bg-white"
                />
              </View>
            </View>

            {/* List */}
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              bounces={false}
              data={tickets}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <TicketDetail item={item} />}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={32}
              onViewableItemsChanged={({ viewableItems }) =>
                setCurrentIndex(viewableItems[0]?.index ?? 0)
              }
              viewabilityConfig={viewConfig}
              ref={slidesRef}
            />

            {/* Button Options */}
            {!isSavingImage && (
              <View className="flex-row items-center mx-2 gap-2 my-8">
                <Button
                  padding="p-4"
                  size="large"
                  title="Save Image"
                  textSize="text-lg"
                  borderRadius="rounded-2xl"
                  color="bg-blue-800"
                  onPress={handleSaveImage}
                />

                <TouchableOpacity
                  onPress={() => {
                    QRCodeBottomSheetRef.current?.open();
                    setShowQRCodeModal(true);
                  }}
                  activeOpacity={0.8}
                  className="bg-white flex-row items-center py-5 rounded-xl flex-1 justify-center gap-3 dark:bg-Accent"
                >
                  <Ionicons
                    name={"qr-code-outline"}
                    color={"black"}
                    size={40}
                  />
                  <Text className="font-montserratBold text-lg">QR Code</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {!loading && loaded && tickets?.length <= 0 && (
        <NotFoundContent title="Ooops!" subtitle={`No Booked Tickets found!`} />
      )}

      {/* QRCode Details BottomSheet */}
      {showQRCodeModal && (
        <ReusableBottomSheet
          ref={QRCodeBottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["50%", "50%"]}
        >
          <View
            ref={QRcodeRef}
            collapsable={false}
            className="p-4  items-center justify-center"
            style={{
              height: getSize(100, "width"),
              backgroundColor: colorScheme === "dark" ? "#131214" : "white",
            }}
          >
            <IconButton
              onPress={handleShareQRCode}
              className={`bg-black/55 rounded-full absolute z-10 top-2 right-5 items-center justify-center ${
                isTakingScreenshot ? "opacity-0" : "opacity-100"
              }`}
              icon={<Feather name="share-2" size={18} color="white" />}
            />
            <View
              style={{
                backgroundColor: colorScheme === "dark" ? "#131214" : "white",
                paddingHorizontal: 35,
                paddingBottom: 15,
                paddingTop: 55,
              }}
              className="border-Primary border-2 items-center rounded-2xl"
            >
              <View className="bg-Primary rounded-full h-16 w-52 p-4 absolute -top-8">
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  source={require("../../../assets/icons/icon.png")}
                  contentFit="contain"
                />
              </View>
              <QRCode
                size={getSize(45, "width")}
                value={`${currentTicket?.code}`}
                backgroundColor="white"
              />
              <Text className="font-montserratSemiBold text-Primary pt-5 text-sm dark:text-white">
                -Event Ticket-
              </Text>
              <Text className="font-montserratRegular pt-2 text-sm dark:text-stone-200">
                Show the QR code at the event venue
              </Text>
            </View>
          </View>
        </ReusableBottomSheet>
      )}
    </GestureHandlerRootView>
  );
}
