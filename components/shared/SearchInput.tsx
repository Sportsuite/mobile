import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  clearSearch?: () => void;
}
const SearchInput: React.FC<SearchInputProps> = ({
  onChangeText,
  value,
  placeholder = "Search event...",
  className,
  clearSearch,
  ...props
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      className={`bg-LightGray px-4 py-3 rounded-xl ${className} dark:bg-white/10`}
    >
      <View className="flex-row items-center">
        {/* Search Icon */}
        <View className="bg-iconBg p-2 rounded-full dark:bg-Dark">
          <Ionicons
            name="search"
            size={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </View>
        <TextInput
          onChangeText={onChangeText}
          value={value}
          className="flex-1 font-montserratSemiBold ml-1 dark:text-white"
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
          {...props}
        />
        {value && (
          <TouchableOpacity onPress={clearSearch} activeOpacity={0.8}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchInput;
