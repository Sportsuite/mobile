import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface Tab {
  title: string;
  content: React.ReactNode;
}

interface TabbedComponentProps {
  tabs: Tab[];
}
const TabbedComponent: React.FC<TabbedComponentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      {/* Tab Options */}
      <View className="mx-4 flex-row gap-6">
        {tabs.map((tab, index) => (
          <TouchableOpacity key={index} onPress={() => setActiveTab(index)}>
            <Text
              className={`font-montserratMedium text-lg ${
                activeTab === index ? "text-Primary" : "text-gray-400"
              }`}
            >
              {tab.title}
            </Text>
            {activeTab === index && (
              <View className="h-1 w-full bg-Primary my-1" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      {/* Content */}
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        // style={{ flex: 1 }} // BottomSheetScrollView takes remaining space
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      >
        {tabs[activeTab].content}
      </BottomSheetScrollView>
    </View>
  );
};

export default TabbedComponent;
