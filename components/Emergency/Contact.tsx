import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { getSize } from "@/utils/useScaleSize";
import { Image } from "expo-image";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { obfuscateEmail } from "@/utils/obfuscateEmail";
import { obfuscatePhoneNumber } from "@/utils/obfuscatePhoneNo";

interface ContactProps {
  item: EContact;
  onEdit: (c: EContact) => void;
  onDelete: (c: EContact) => void;
}
export default function Contact({ item, onDelete, onEdit }: ContactProps) {
  return (
    <View className="bg-LightGray p-4 rounded-2xl flex-row items-center mb-4 dark:bg-Primary/20">
      {/* Image */}
      <View
        style={{
          width: getSize(12, "width"),
          height: getSize(12, "width"),
          overflow: "hidden",
        }}
        className="items-center justify-center rounded-full mr-4 bg-Primary"
      >
        <Image
          source={
            item?.image
              ? { uri: item.image }
              : require("../../assets/icons/default-avatar.png")
          }
          style={{
            width: getSize(12, "width"),
            height: getSize(12, "width"),
          }}
          contentFit="cover"
        />
      </View>
      <View className="justify-between items-center flex-row flex-1">
        {/* details */}
        <View>
          <Text className="text-Primary text-xs font-montserratBold">
            {item?.relationship}
          </Text>
          <Text
            className="font-montserratExtraBold text-lg text-wrap w-52 dark:text-white"
            numberOfLines={1}
          >
            {item?.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-sm font-montserratRegular mr-1 text-Accent">
              {obfuscatePhoneNumber(item?.phone)}
            </Text>
            {item?.email && (
              <Text className="text-sm font-montserratRegular dark:text-white">
                | {obfuscateEmail(item?.email)}
              </Text>
            )}
          </View>
        </View>
        {/* actions */}
        <View className="flex-row items-center gap-2 justify-between">
          {/* edit button */}
          <TouchableOpacity
            onPress={() => onEdit(item)}
            activeOpacity={0.6}
            className="bg-Primary/20 p-2 rounded-full"
          >
            <SimpleLineIcons name="pencil" size={24} color="#0052FF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item)}
            activeOpacity={0.6}
            className="bg-Danger/20 p-2 rounded-full"
          >
            <Ionicons name="trash-outline" size={24} color="#E41D12" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
