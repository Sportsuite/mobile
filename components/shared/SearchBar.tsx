import React, { memo } from "react";
import { View, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  iconColor?: string;
  borderColor?: string;
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  iconColor = "#F2F2F2",
  borderColor = "border-LightGray",
  className,
}) => {
  return (
    <View
      className={`flex-row items-center p-4  border rounded-xl ${borderColor} ${className}`}
    >
      <Ionicons name="search" size={28} color={iconColor} />
      <TextInput
        className="flex-1 ml-4 text-black font-montserratRegular"
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default memo(SearchBar);
