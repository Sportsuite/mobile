import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  BackHandler,
} from "react-native";
import * as Device from "expo-device";
import React, { useRef, useState, memo, useEffect, useCallback } from "react";
import BackButton from "@/components/shared/BackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import AuthenticatedUser from "@/components/Transportation/AuthenticatedUser";
import { getSize } from "@/utils/useScaleSize";
import SearchBar from "@/components/shared/SearchBar";
import { useStatusBarHeight } from "@/utils/useMarginTop";
import { useSearchParams } from "expo-router/build/hooks";
import { GET_EVENT_TICKET_USERS } from "@/graphql/queries/event.query";
import { useLazyQuery, useMutation } from "@apollo/client";
import { router, useFocusEffect } from "expo-router";
import CustomActivityIndicator from "@/components/shared/CustomActivityIndicator";
import { getCurrentAppDate, getRelativeTime } from "@/utils/relativeTime";
import BarCodeScanner from "@/components/shared/BarCodeScanner";
import useScannedTicketsStore from "@/store/scannedTicketsStore";
import { NEW_EVENT_TICKET_CHECKIN } from "@/graphql/mutations/event.mutate";
import ToastMsg from "@/components/shared/ToastMsg";

const CheckIn = () => {
  const params = useSearchParams();
  const selectedTickets = JSON.parse(
    params.get("selectedTickets") || "[]"
  ) as string[];
  const eventId = params.get("eventId") || "";
  const [ticketUsersMap, setTicketUsersMap] = useState<
    Map<string, EventTicketUser>
  >(new Map());
  const bottomSheetRef = useRef<{
    open: () => void;
    collapse: () => void;
    close: () => void;
    snapToIndex: (index: number) => void;
  }>(null);
  const [scanned, setScanned] = useState(false);

  const [isBottomSheetVisible, setBottomSheetVisible] =
    useState<boolean>(false);

  // Auth User BottomSheet
  const authUserBottomSheetRef = useRef<{
    open: () => void;
    collapse: () => void;
    close: () => void;
    snapToIndex: (index: number) => void;
  }>(null);
  const authUserHandleSheetChanges = (index: number) => {
    if (index === -1) {
      setAuthUserBottomSheetVisible(!isAuthUserBottomSheetVisible);
    }
  };
  const [isAuthUserBottomSheetVisible, setAuthUserBottomSheetVisible] =
    useState<boolean>(false);
  const [authUser, setAuthUser] = useState<Partial<EventTicketUser>>({});

  const handleSheetChanges = (index: number) => {
    if (index === -1 && isBottomSheetVisible !== false) {
      setBottomSheetVisible(!isBottomSheetVisible);
    }

    if (index === 3) {
      setBottomSheetVisible(true);
    }
    if (index === 1) {
      setBottomSheetVisible(false);
    }
  };

  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();
  const [ratio, setRatio] = useState<string>("0");
  const [getUsers, { loading }] = useLazyQuery(GET_EVENT_TICKET_USERS, {
    onCompleted: ({ GetEventTicketUsers: { data } }) => {
      // Convert array to Map (using `code` as the key)
      const usersMap = new Map<string, EventTicketUser>();
      data.forEach((user: EventTicketUser) => {
        usersMap.set(user.code, user);
      });

      setTicketUsersMap(usersMap);
    },
    onError: (error) => {
      router.back();
      ToastMsg(error.message, "Error fetching users");
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [turnOnTorch, setTurnOnTorch] = useState<boolean>(false);
  const ScannedTickets = useScannedTicketsStore((state) => state.items);
  const AddScannedTicket = useScannedTicketsStore((state) => state.addItem);
  const GetNextTicket = useScannedTicketsStore((state) => state.getNextItem);
  const [queuedTicket, setQueuedTicket] =
    useState<(typeof ScannedTickets)[0]>();

  const deviceInfo = {
    deviceName: Device.deviceName,
  };

  // Helper function to calculate the ratio
  function calculateUsedRatio(
    ticketUsersMap: Map<string, EventTicketUser>
  ): string {
    const usedCount = [...ticketUsersMap.values()].filter(
      (ticket) => ticket.used.status
    ).length;
    return `${usedCount}`;
  }

  const startScannedTicketsUpload = () => {
    const ticket = GetNextTicket();
    if (ticket) {
      setQueuedTicket(ticket);
      ticketCheckin({
        variables: {
          ...ticket,
        },
      });
    }
  };

  const [ticketCheckin, { loading: tLoading }] = useMutation(
    NEW_EVENT_TICKET_CHECKIN,
    {
      onCompleted: ({ NewEventTicketCheckIn }) => {
        // Handle successful check-in
        if (NewEventTicketCheckIn) {
          startScannedTicketsUpload(); // Start uploading the next ticket
        } else {
          ToastMsg("User has already checked-in", "Warning", "info");
        }
      },
      onError: (error) => {
        if (error && queuedTicket) AddScannedTicket(queuedTicket); // Add scanned ticket back to store
        // Handle error
        ToastMsg(error.message, "Error checking-in");
      },
    }
  );

  useEffect(() => {
    if (eventId && selectedTickets.length > 0) {
      getUsers({
        variables: {
          event: eventId,
          tickets: selectedTickets,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (ScannedTickets.length > 0) {
      startScannedTicketsUpload(); // Start uploading the first ticket
    }
  }, [ScannedTickets, GetNextTicket]);

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

  const handleBarCodeScanned = useCallback(
    async (data: string) => {
      // scan the QR code
      if (scanned) return; // Prevent multiple scans

      const ticket = ticketUsersMap.get(data);
      setScanned(true);

      // check validation of the scanned code
      if (!ticket) {
        ToastMsg("Invalid QR code", "Error");
      }

      // check if the scanned code is already used
      else if (ticket) {
        if (ticket.used.status) {
          ToastMsg(`Ticket ${data} already used`, "Warning", "info");
        } else {
          const scannedTicket = {
            code: ticket.code,
            ticket: ticket.ticket.id,
            deviceName: deviceInfo?.deviceName ?? "Device Name",
          };
          AddScannedTicket(scannedTicket); // Add scanned ticket to store
          setAuthUser(ticket);
          setTicketUsersMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.set(data, {
              ...ticket,
              used: {
                status: true,
                datetime: getCurrentAppDate(),
                device: deviceInfo?.deviceName ?? "Device Name",
              },
            });
            return newMap;
          });

          setAuthUserBottomSheetVisible(true);
          authUserBottomSheetRef.current?.open();
        }
      }

      // set timeout to turn scanned to false
      setTimeout(() => {
        setScanned(false);
      }, 6000);
    },
    [ticketUsersMap, scanned, setScanned]
  );

  useEffect(() => {
    setRatio(calculateUsedRatio(ticketUsersMap));
  }, [ticketUsersMap]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-Primary dark:bg-Dark">
        <CustomActivityIndicator />
      </View>
    );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.header, { marginTop: statusBarHeight }]}>
        <BackButton
          iconColor={isCameraActive ? "white" : "black"}
          className={`p-4 rounded-full ${isCameraActive ? "bg-black/40" : ""}`}
        />
        <Text className="text-white font-montserratBold">Event Check-In</Text>
        <TouchableOpacity
          onPress={() => {
            if (isCameraActive) setTurnOnTorch(!turnOnTorch);
          }}
          className={`p-4 rounded-full ${
            isCameraActive ? "bg-Primary" : "bg-Gray"
          }`}
        >
          <Ionicons name="flashlight-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Camera Comp */}
      <BarCodeScanner
        isTorchOn={turnOnTorch}
        onCameraActive={setIsCameraActive}
        isActive={scanned}
        onScanned={handleBarCodeScanned}
      />

      {/* BottomSheet */}
      {isBottomSheetVisible && (
        <ReusableBottomSheet
          ref={bottomSheetRef}
          onSheetChange={handleSheetChanges}
          snapPoints={["15%", "50%", "50%"]}
        >
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <Text className="text-lg font-montserratSemiBold dark:text-white">
                Checked Users
              </Text>
              <Text className="font-montserratRegular text-Gray dark:text-white">
                Total:{" "}
                <Text className="font-montserratSemiBold text-Primary dark:text-Accent">
                  {ratio}
                </Text>{" "}
                /{ticketUsersMap.size}
              </Text>
            </View>

            {/* Search Input */}
            <SearchBar
              onChangeText={() => {}}
              value=""
              placeholder="Search... eg username or identity"
              className="mb-4"
            />

            <FlatList<EventTicketUser>
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 200,
              }}
              data={Array.from(ticketUsersMap.values()).filter(
                (item) => item.used.status === true
              )} // Convert Map to array for FlatList
              keyExtractor={(item, index) => item.id}
              renderItem={({ item: ticket }) => (
                <AuthenticatedUser
                  name={ticket?.user?.name}
                  avatarUrl={ticket?.user?.image ?? ""}
                  checkInTime={getRelativeTime(ticket.used.datetime.timestamp)}
                  ticketCode={ticket?.code}
                />
              )}
              getItemLayout={(data, index) => ({
                length: getSize(12, "height"),
                offset: getSize(12, "height") * index,
                index,
              })} // Optimize scrolling if fixed height
              initialNumToRender={10} // Only render 10 items initially
              maxToRenderPerBatch={10} // Add 10 items per render batch
              windowSize={5} // Render items within 5 screens
              removeClippedSubviews // Unmount offscreen items
              ListEmptyComponent={() => (
                <View className="justify-center items-center h-96">
                  <Text className="font-montserratRegular text-lg  dark:text-white">
                    No checked-in users yet!
                  </Text>
                </View>
              )}
              onScrollBeginDrag={() => {
                // Lock bottomsheet when scrolling starts
                bottomSheetRef.current?.snapToIndex(1); // Snap to max height
              }}
            />
          </View>
        </ReusableBottomSheet>
      )}

      {/* Auth User BottomSheet */}
      {isAuthUserBottomSheetVisible && (
        <ReusableBottomSheet
          ref={authUserBottomSheetRef}
          onSheetChange={authUserHandleSheetChanges}
          snapPoints={["25%", "30%"]}
        >
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <Text className="text-lg font-montserratSemiBold dark:text-white">
                Last authenticated account
              </Text>
            </View>

            <AuthenticatedUser
              name={authUser?.user?.name}
              avatarUrl={authUser?.user?.image ?? ""}
              checkInTime={getRelativeTime(
                authUser?.used?.datetime?.timestamp ?? Date.now()
              )}
              ticketCode={authUser?.code}
            />
          </View>
        </ReusableBottomSheet>
      )}

      {/* Bottom Function */}
      <View className="bg-white dark:bg-Dark" style={styles.bottomAction}>
        <TouchableOpacity
          onPress={() => {
            isBottomSheetVisible
              ? bottomSheetRef.current?.collapse()
              : bottomSheetRef.current?.open();
            setBottomSheetVisible(!isBottomSheetVisible);
            setAuthUserBottomSheetVisible(false);
          }}
          className="items-center justify-center p-4 "
        >
          <Ionicons
            name={isBottomSheetVisible ? "chevron-down" : "chevron-up"}
            size={28}
            color={colorScheme === "dark" ? "#F7C404" : "#0052FF"}
          />
          <Text className="text-center font-montserratMedium text-Primary dark:text-Accent">
            {isBottomSheetVisible ? "Collapse Modal" : "View More"}
          </Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
  },

  content: {
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(CheckIn);
