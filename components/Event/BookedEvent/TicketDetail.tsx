import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getSize } from "@/utils/useScaleSize";
import { DottedDivider } from "@/components/shared/DottedDivider";
import Aminities from "./Aminities";
import { formatCurrency } from "@/utils/formatCurrency";

interface Props {
  item: TicketItem;
}
export default function TicketDetail({ item }: Props) {
  return (
    <View
      style={{
        width: getSize(92.55, "width"), // Account for margins
        marginHorizontal: 10,
        padding: 16,
        borderRadius: 35,
        marginTop: 16,
        height: getSize(70, "height"),
      }}
      className="gap-4 bg-white dark:bg-white/10"
    >
      <Image
        source={{ uri: item?.ticket?.image }}
        style={{
          width: "100%",
          height: getSize(23, "height"),
          borderRadius: 35,
        }}
        contentFit="cover"
      />

      <Text className="font-montserratSemiBold text-lg text-center dark:text-white">
        {item?.ticket?.title}
      </Text>

      <View className="items-center justify-center flex-row w-full">
        <View className="bg-Primary dark:bg-Dark rounded-full w-8 h-8 z-10" />
        <DottedDivider color="black" thickness={3} spacing={4} />
        <View className="bg-Primary dark:bg-Dark rounded-full w-8 h-8 z-10" />
      </View>

      <View className="flex-row items-center justify-between mx-6">
        <View className="flex-1">
          <Text className="font-montserratMedium text-gray-400 text-lg dark:text-stone-200">
            Days
          </Text>
          <View className="flex-row items-center gap-2">
            {item?.ticket?.session?.days?.map((day, index) => (
              <Text
                key={index}
                className="font-montserratSemiBold dark:text-Accent"
              >
                {day}
              </Text>
            ))}
            <Text className="font-montserratSemiBold dark:text-Accent">{`(${
              item?.ticket?.session?.numberOfDays
            } ${
              item?.ticket?.session?.days?.length > 1 ? "Days" : "Day"
            })`}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View className="justify-between mx-6">
        <Text className="font-montserratMedium text-gray-400 text- dark:text-stone-200">
          Description
        </Text>
        <Text className="font-montserratSemiBold dark:text-Accent">
          {item?.ticket?.session?.description}
        </Text>
      </View>

      <View className="items-center">
        <DottedDivider
          className="w-96"
          color="black"
          thickness={3}
          spacing={4}
        />
      </View>

      {/* Cost */}
      <View className="items-center justify-center">
        <Text className="font-montserratBold text-xl text-Primary dark:text-white">
          {formatCurrency(item?.total)}
        </Text>
        <Text className="font-montserratRegular dark:text-stone-200">
          Total
        </Text>
      </View>

      {/* Amenities */}
      <Aminities options={item?.ticket?.options} />
    </View>
  );
}
