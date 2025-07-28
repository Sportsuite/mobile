import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import React, { useRef, useState, memo, useEffect } from "react";
import BackButton from "@/components/shared/BackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReusableBottomSheet from "@/components/shared/ReusableBottomSheet";
import AuthenticatedUser from "@/components/Transportation/AuthenticatedUser";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import Button from "@/components/shared/Button";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import SearchBar from "@/components/shared/SearchBar";
import { useStatusBarHeight } from "@/utils/useMarginTop";

const CheckIn = () => {
  const bottomSheetRef = useRef<{
    open: () => void;
    collapse: () => void;
    close: () => void;
  }>(null);
  const [isBottomSheetVisible, setBottomSheetVisible] =
    useState<boolean>(false);

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

  const users = [
    {
      avatarUrl:
        "https://images.pexels.com/photos/2834009/pexels-photo-2834009.jpeg",
      name: "John Doe",
      userId: "123ABC456",
      lastActive: "5 mins ago",
    },
    {
      avatarUrl:
        "https://images.pexels.com/photos/1975342/pexels-photo-1975342.jpeg",
      name: "Majid Chinemerem J.",
      userId: "255S2DF2F5FEE1E2RE",
      lastActive: "46 mins ago",
    },
    // Add more user data as needed
  ];

  const [type, setType] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [turnOnTorch, setTurnOnTorch] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const statusBarHeight = useStatusBarHeight();
  const colorScheme = useColorScheme();

  const handleInactivity = () => {
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);

    // Reset timeout on user activity
    inactivityTimeout.current = setTimeout(() => {
      setIsCameraActive(false); // Deactivate the camera
    }, 20000);
  };

  const resumeCamera = () => {
    setIsCameraActive(true); // Reactivate the camera
    handleInactivity(); // Restart the inactivity timer
  };

  useEffect(() => {
    // Start inactivity timeout when the camera is active
    if (isCameraActive) handleInactivity();

    return () => {
      // Clear timeout on unmount
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    };
  }, [isCameraActive]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="items-center justify-center flex-1">
        <Text className="py-6 text-center font-montserratRegular">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Continue" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={[styles.header, { marginTop: statusBarHeight }]}>
        <BackButton
          iconColor={isCameraActive ? "white" : "black"}
          className={`p-4 rounded-full ${isCameraActive ? "bg-black/40" : ""}`}
        />
        <Text className="text-white font-montserratBold">
          Transportation Check-In
        </Text>
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
      {isCameraActive ? (
        <CameraView
          autofocus="on"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          enableTorch={turnOnTorch}
          style={styles.camera}
          facing={type}
        ></CameraView>
      ) : (
        <View className="items-center justify-center flex-1 dark:bg-Dark">
          <Image
            style={{
              width: getSize(18.6, "width"),
              height: getSize(18.6, "width"),
            }}
            source={require("../../../../../assets/icons/camera-moon.png")}
          />
          <Text className="p-12 text-center font-montserratRegular dark:text-white">
            Identification on sleep mode, tap on the ‘Resume Identification’ to
            continue the process.
          </Text>

          <Button onPress={resumeCamera} title="Resume Identification" />
        </View>
      )}

      {/* BottomSheet */}
      <ReusableBottomSheet
        ref={bottomSheetRef}
        onSheetChange={handleSheetChanges}
        snapPoints={["32%", "50%", "90%"]}
      >
        <View style={styles.content}>
          <View style={styles.infoRow}>
            {!isBottomSheetVisible ? (
              <Text className="font-montserratRegular text-Gray dark:text-white">
                Last authenticated account
              </Text>
            ) : (
              <Text className="text-lg font-montserratSemiBold">
                Checked Users
              </Text>
            )}
            <Text className="font-montserratRegular text-Gray dark:text-white">
              Total:{" "}
              <Text className="font-montserratSemiBold text-Primary dark:text-Accent">
                122
              </Text>{" "}
              /200
            </Text>
          </View>

          {/* Search Input */}
          {isBottomSheetVisible && (
            <SearchBar
              onChangeText={() => {}}
              value=""
              placeholder="Search... eg username or identity"
              className="mb-4"
            />
          )}

          {isBottomSheetVisible ? (
            <ScrollView>
              {users.map((user, index) => (
                <AuthenticatedUser
                  key={index}
                  avatarUrl={user.avatarUrl}
                  name={user.name}
                />
              ))}
            </ScrollView>
          ) : (
            <AuthenticatedUser
              avatarUrl={users[0].avatarUrl}
              name={users[0].name}
            />
          )}
        </View>
      </ReusableBottomSheet>

      {/* Bottom Function */}

      <View className="bg-white dark:bg-Dark" style={styles.bottomAction}>
        <TouchableOpacity
          onPress={() => {
            isBottomSheetVisible
              ? bottomSheetRef.current?.collapse()
              : bottomSheetRef.current?.open();
            setBottomSheetVisible(!isBottomSheetVisible);
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
