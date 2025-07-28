import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import ToastMsg from "@/components/shared/ToastMsg";

type PermissionStatus = "granted" | "denied" | "undetermined";
type ReverseGeocodeArray = Awaited<
  ReturnType<typeof Location.reverseGeocodeAsync>
>;

export default function useLocationPermission() {
  const [errorMsg, setErrorMsg] = useState("");
  const [longitude, setLongitude] = useState<string>();
  const [latitude, setLatitude] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PermissionStatus>("undetermined");
  const [locationInfo, setLocationInfo] = useState<ReverseGeocodeArray>();

  const LOCATION_CACHE_KEY = "@location_permission";

  useEffect(() => {
    initialisePermission();
  }, []);

  const initialisePermission = async () => {
    try {
      const savedStatus = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (savedStatus) {
        setStatus(savedStatus as PermissionStatus);
        if (savedStatus === "granted") await fetchLocation();
      } else {
        setStatus("undetermined");
      }
    } catch (error) {
      ToastMsg("Initialise permission error:", "Initialise Permission Failed");
      setStatus("undetermined");
    }
  };

  const requestPermission = async () => {
    try {
      setLoading(true);
      const { status: permissionStatus } =
        await Location.requestForegroundPermissionsAsync();

      setStatus(permissionStatus);
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, permissionStatus);

      if (permissionStatus === "granted") {
        await fetchLocation();
      } else {
        setErrorMsg("Permission denied");
        ToastMsg("Please enable location in Settings", "Permission Required");
      }
    } catch (error) {
      setErrorMsg("Location request failed");
      if (error instanceof Error) {
        ToastMsg(error.message, "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setLatitude(String(coords.latitude));
      setLongitude(String(coords.longitude));

      const response = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setLocationInfo(response);
    } catch (error) {
      setErrorMsg("Could not fetch location");
      if (error instanceof Error) {
        ToastMsg(error.message, "Location Error");
      }
    }
  };

  return {
    latitude,
    longitude,
    errorMsg,
    requestPermission,
    status,
    locationInfo,
    loading,
    initialisePermission,
  };
}
