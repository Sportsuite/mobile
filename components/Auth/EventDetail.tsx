import { View, StyleSheet, Text } from "react-native";
import React, { useCallback } from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import StartingPrice from "../Event/StartingPrice";
import DateIconSide from "../Event/DateIconSide";
import { formatDateToReadableString } from "@/utils/formatDateTime";
import Button from "../shared/Button";
import CustomActivityIndicator from "../shared/CustomActivityIndicator";
import { router } from "expo-router";
import RichTextRenderer from "../shared/RichTextRenderer";

interface EventDetailProps {
  details: EventObj | null;
  bottomSheetRef: any;
}

const EventDetail: React.FC<EventDetailProps> = ({
  details,
  bottomSheetRef,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} contentFit="cover" />
      </View>
    ),
    []
  );
  if (!details) {
    return <CustomActivityIndicator />;
  }
  return (
    <View className="mx-2.5 dark:bg-Dark">
      {/* Title and Starting Price */}
      <View className="items-center flex-row justify-between ml-2 mt-2">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-montserratBold flex-wrap w-[70%] dark:text-white"
          style={{ fontSize: getSize(4, "width") }}
        >
          {details.title}
        </Text>
        {details.startingPrice && (
          <StartingPrice
            price={details.startingPrice.price}
            bgColor="bg-Accent"
            textColor="text-black"
          />
        )}
      </View>
      {/* City and Countrry */}
      <Text
        className="font-montserratRegular mb-4 text-Gray dark:text-white"
        style={{ fontSize: getSize(3, "width") }}
      >{`${details?.city?.name} - ${details?.country?.name}`}</Text>

      <View style={styles.carouselContainer} className="self-center">
        {renderItem({ item: details.images[0] })}
      </View>

      {/* About Event */}
      <View className="mt-4">
        <Text className="font-montserratBold text-lg dark:text-white">
          About Event
        </Text>
        {details?.desc && (
          <RichTextRenderer
            htmlContent={details?.desc}
            maxLines={2} // Show only 2 lines initially
          />
        )}
        {/* <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-montserratRegular mt-4 dark:text-white"
          style={{ fontSize: getSize(3, "width") }}
        >
          {details.desc}
        </Text> */}
      </View>

      {/* Start and End Dates */}
      <View className="mt-6">
        <View className="flex-row items-center justify-between">
          {/* Start Date */}
          <DateIconSide
            date={formatDateToReadableString(details.startDate.date)}
            title="Start"
          />

          {/* End Date */}
          <DateIconSide
            date={formatDateToReadableString(details.endDate.date)}
            title="End"
          />
        </View>
      </View>

      {/* Book Ticket */}
      <Button
        onPress={() => {
          bottomSheetRef.current?.close();
          router.push("login");
        }}
        title="Login to Book a Ticket"
        size="medium"
        borderRadius="rounded-xl"
        padding="py-6"
        color={"bg-Primary"}
        textColor="text-white"
        margin="mt-12"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: getSize(90, "width"),
    height: getSize(23, "height"),
    overflow: "hidden",
    borderRadius: 20,
  },
  imageContainer: {
    width: getSize(90, "width"),
    height: getSize(23, "height"),
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default EventDetail;
