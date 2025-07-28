import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "./Button";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";

interface BarCodeScannerProps {
  onScanned: (data: string) => void;
  isActive: boolean;
  isTorchOn: boolean;
  onCameraActive?: (status: boolean) => void;
}
export default function BarCodeScanner({
  onScanned,
  isActive,
  onCameraActive,
  isTorchOn,
}: Readonly<BarCodeScannerProps>) {
  const [type, setType] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);

  const handleBarCodeScanned = useCallback(
    async ({ data }: BarcodeScanningResult) => {
      if (!isActive) onScanned(data); // Prevent multiple scans
    },
    [isActive, onScanned]
  );

  const handleInactivity = () => {
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);

    // Reset timeout on user activity
    inactivityTimeout.current = setTimeout(() => {
      setIsCameraActive(false); // Deactivate the camera
    }, 100000);
  };

  const resumeCamera = () => {
    onCameraActive?.(true); // Reactivate the camera
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
    <>
      {isCameraActive ? (
        <CameraView
          autofocus="on"
          onBarcodeScanned={isActive ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          enableTorch={isTorchOn}
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
            source={require("../../assets/icons/camera-moon.png")}
          />
          <Text className="p-12 text-center font-montserratRegular dark:text-white">
            Identification on sleep mode, tap on the ‘Resume Identification’ to
            continue the process.
          </Text>

          <Button onPress={resumeCamera} title="Resume Identification" />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  camera: {
    flex: 1,
  },
});
