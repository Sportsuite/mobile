import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";
import { LinearGradient } from "expo-linear-gradient";
import StartingPrice from "./StartingPrice";
import DateIconBg from "./DateIconBg";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import NoTicketBadge from "./NoTicketBadge";
import SoldOutBadge from "./SoldOutBadge";

interface EventCompMdProps {
  eventItem: EventObj;
  width?: number;
  height?: number;
  className?: string;
  onPress?: () => void;
  topRightComponent?: React.ReactNode;
}
const EventCompMd: React.FC<EventCompMdProps> = ({
  eventItem,
  width = 92.09,
  height = 30.84,
  className = "",
  onPress,
  topRightComponent,
}) => {
  // Default topRightComponent if not provided
  const defaultTopRightComponent = (() => {
    if (eventItem.hasTicket && !eventItem.isSoldOut) {
      return <StartingPrice price={eventItem?.startingPrice?.price ?? "0"} />;
    }

    if (!eventItem.hasTicket) {
      return <NoTicketBadge />;
    }

    if (eventItem.isSoldOut) {
      return <SoldOutBadge />;
    }

    return null;
  })();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.95}
      style={{
        width: getSize(width, "width"),
        height: getSize(height, "height"),
        alignSelf: "center",
      }}
      className={`rounded-xl overflow-hidden ${className}`}
    >
      <ImageBackground
        source={
          eventItem.images[0]
            ? { uri: eventItem.images[0] }
            : require("../../assets/icons/default-avatar.png")
        }
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          // Gradient from the bottom (strong dark) to the top (lighter)
          colors={["transparent", "rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.9)"]}
          style={styles.overlay}
        >
          {/* Card Content */}
          <View className="px-4 mt-4">
            {/* external component */}
            {topRightComponent || defaultTopRightComponent}
            <View className="mt-2">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-montserratBold text-white text-lg"
              >
                {eventItem.title}
              </Text>
              <View className="flex-row items-center mb-2 mt-2">
                <DateIconBg
                  className="mr-2"
                  date={formatDateToReadableString(eventItem.startDate.date)}
                  iconUrl={require("../../assets/icons/start_date.png")}
                />
                <DateIconBg
                  date={formatDateToReadableString(eventItem.endDate.date)}
                  iconUrl={require("../../assets/icons/end_date.png")}
                />
              </View>
              <Text className="text-white font-montserratBold mt-2">
                {eventItem?.city?.name} - {eventItem?.country?.name}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: 12, // Matches the NativeWind rounded-xl class
  },
  overlay: {
    flex: 1,
    padding: 4,
  },
});
export default EventCompMd;
