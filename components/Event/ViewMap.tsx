import { Linking, Text, TouchableOpacity } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";
import ToastMsg from "../shared/ToastMsg";

interface ViewMapProps {
  className?: string;
  lat?: number;
  lon?: number;
}
const ViewMap = ({ className = "bg-LightPrimary", lat, lon }: ViewMapProps) => {
  const handlePress = () => {
    if (!lat || !lon) {
      ToastMsg("Latitude or longitude not provided", "Warning", "info");
      return;
    }

    // Construct Google Maps URL
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

    // Try to open in Google Maps app, fallback to browser if app not installed
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open Google Maps:", err);
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className={`self-end items-center justify-center p-4 rounded-xl ${className}`}
    >
      <Text
        className={`font-montserratBold text-Primary`}
        style={{ fontSize: getSize(3, "width") }}
      >
        View on Map
      </Text>
    </TouchableOpacity>
  );
};

export default ViewMap;
