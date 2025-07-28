import { View, Text } from "react-native";
import React from "react";

const CurvedContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="absolute bottom-10 w-full" style={{ zIndex: 30 }}>
      <View
        className="bg-white dark:bg-black pt-6 px-4"
        style={{
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          paddingBottom: -20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default CurvedContainer;
