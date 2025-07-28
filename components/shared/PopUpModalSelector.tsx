import React, { useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  Modal,
  View,
  TextInput,
  FlatList,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "./Button";
import { useStatusBarHeight } from "@/utils/useMarginTop";

interface PopUpModalSelectorProps<T> {
  placeholder: string; // Placeholder text (e.g., "Select Country")
  items: T[]; // List of selectable items (generic type)
  itemLabelKey: keyof T; // Key for the label in each item
  onSelect: (item: T) => void; // Callback when an item is selected
}

const PopUpModalSelector = <T extends object>({
  placeholder,
  items,
  itemLabelKey,
  onSelect,
}: PopUpModalSelectorProps<T>) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const colorScheme = useColorScheme();

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    String(item[itemLabelKey]).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle item selection
  const handleItemSelect = (item: T) => {
    setSelectedItem(item); // Update the selected item
    setIsModalVisible(false); // Close the modal
    onSelect(item); // Call the parent callback with the full item
  };

  const renderItem = useMemo(() => {
    return ({ item }: { item: any }) => (
      <TouchableOpacity
        className="p-4 border-b border-gray-200"
        onPress={() => handleItemSelect(item)}
      >
        <Text className="font-montserratMedium dark:text-white">
          {String(item[itemLabelKey])}
        </Text>
      </TouchableOpacity>
    );
  }, [handleItemSelect, itemLabelKey]);

  const statusBarHeight = useStatusBarHeight();
  return (
    <View>
      {/* Trigger Button */}
      <TouchableOpacity
        className="bg-LightGray flex-row justify-between items-center p-6 rounded-2xl dark:bg-Dark dark:border dark:border-white"
        onPress={() => setIsModalVisible(true)}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-montserratSemiBold w-11/12 text-lg text-black dark:text-white"
        >
          {selectedItem ? String(selectedItem[itemLabelKey]) : placeholder}
        </Text>
        <Ionicons
          name="chevron-down-sharp"
          size={24}
          color={colorScheme === "dark" ? "white" : "black"}
        />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="w-11/12 bg-white rounded-lg h-auto p-4 dark:bg-Dark"
            style={{ marginVertical: statusBarHeight }}
          >
            {/* Search Input */}
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="mb-4 p-4 font-montserratMedium border border-gray-300 rounded-md dark:text-white"
              placeholderTextColor={colorScheme === "dark" ? "white" : "black"}
            />

            {/* Item List */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredItems}
              keyExtractor={(item, index) => String(index)}
              renderItem={renderItem}
              ListEmptyComponent={
                <View className="justify-center items-center">
                  <Text className="font-montserratMedium py-4 dark:text-white">
                    No data was found!
                  </Text>
                  <Button
                    padding="px-4 py-3"
                    size="small"
                    title="Try again"
                    textSize="text-lg"
                    borderRadius="rounded-2xl"
                    onPress={() => setIsModalVisible(false)}
                  />
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PopUpModalSelector;
