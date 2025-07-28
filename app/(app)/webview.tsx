import React, { useState } from "react";
import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import BackButton from "@/components/shared/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";

const WebviewPage = () => {
  const { url, title, page } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();

  if (!url) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-100 dark:bg-Dark">
        <Text className="text-lg font-semibold text-gray-600">
          No URL Provided
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-Dark">
      {/* Header with Back Button */}
      <View className="flex-row items-center justify-center py-6">
        {/* <BackButton
          onPress={() => router.replace(`${page}`)}
          className="absolute left-5"
          iconSize={28}
          iconColor="black"
        /> */}
        {/* Centered text */}
        <Text className="text-lg text-center font- dark:text-white">
          {title}
        </Text>
      </View>
      {loading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50 items-center justify-center flex-1 bg-white dark:bg-Dark">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-2 font-medium text-gray-500">Loading...</Text>
        </View>
      )}
      {/* WebView */}
      <WebView
        injectedJavaScript={`document.body.style.backgroundColor = '${
          colorScheme === "dark" ? "#131214" : "green"
        }'; 
        document.body.style.color = '${
          colorScheme === "dark" ? "white" : "black"
        }';

    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.color = '${colorScheme === "dark" ? "white" : "black"}';
    });
        true;`}
        style={{ backgroundColor: "green" }}
        source={{ uri: decodeURIComponent(url as string) }}
        onLoadEnd={() => setLoading(false)}
      />
    </SafeAreaView>
  );
};

export default WebviewPage;
