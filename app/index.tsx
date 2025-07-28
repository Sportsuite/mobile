import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import OnboardingData from "@/data/onboardingData";
import BottomIndicator from "@/components/OnBoarding/BottomIndicator";
import Button from "@/components/shared/Button";
import { Redirect } from "expo-router";
import ListItem from "@/components/OnBoarding/ListItem";
import useDimensions from "@/utils/useDimensions";
import { checkFirstLaunch, setFirstLaunch } from "@/utils/firstLaunch";
import { useAuth } from "@/store/context/auth-context";
import { useStatusBarHeight } from "@/utils/useMarginTop";

const Index = () => {
  const { token, isAuthReady } = useAuth();
  const { width } = useDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef<FlatList | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const statusBarHeight = useStatusBarHeight();

  // check if it's user's first time
  useEffect(() => {
    const checkLaunch = async () => {
      const firstLaunch = await checkFirstLaunch();
      setIsFirstLaunch(firstLaunch);
      setLoading(false);
    };

    checkLaunch();
  }, []);

  const handleGetStarted = async () => {
    await setFirstLaunch();
    setIsFirstLaunch(true);
  };

  // Move to the next slide
  const goToNextSlide = () => {
    if (slidesRef.current && currentIndex < OnboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      slidesRef.current.scrollToIndex({ animated: true, index: nextIndex });
      setCurrentIndex(nextIndex);
    }
  };

  // Move to the previous slide
  const goToPreviousSlide = () => {
    if (slidesRef.current && currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      slidesRef.current.scrollToIndex({
        animated: true,
        index: previousIndex,
      });
      setCurrentIndex(previousIndex);
    }
  };

  // Function to render each item in the FlatList

  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingDataItem;
    index: number;
  }) => <ListItem item={item} scrollX={scrollX} width={width} index={index} />;

  if (!isAuthReady || loading || isFirstLaunch === null) {
    // Show ActivityIndicator or splash screen while loading
    return (
      <SafeAreaView className="items-center justify-center flex-1 dark:bg-Dark">
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  if (isFirstLaunch && !token) {
    return <Redirect href={{ pathname: "landing" }} />;
  }

  if (isFirstLaunch && token) {
    return <Redirect href={{ pathname: "/(app)/" }} />;
  }

  return (
    <SafeAreaView
      style={{
        paddingTop: statusBarHeight,
      }}
      className="items-center justify-center flex-1 bg-white dark:bg-Dark"
    >
      <View className="flex-1">
        {/* Skip Button */}
        <View className="items-end justify-center ">
          <TouchableOpacity onPress={handleGetStarted} className="p-4">
            <Text className="text-Gray font-montserratBold dark:text-Accent">
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Flatlist */}

        <View className="flex-1">
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            data={OnboardingData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={({ viewableItems }) =>
              setCurrentIndex(viewableItems[0]?.index ?? 0)
            }
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>

        {/* buttons and swiper */}
        <View className="items-center justify-center">
          <View className="flex flex-row justify-between">
            <BottomIndicator
              scrollX={scrollX}
              data={OnboardingData}
              color="bg-Accent"
            />
          </View>
        </View>
        <View className="items-center  h-[20%]">
          <View
            className={`flex-row items-center ${
              currentIndex > 0 ? "justify-between" : "justify-center"
            } flex-1 w-[90%]  mt-8`}
          >
            {currentIndex > 0 && (
              <View>
                <TouchableOpacity onPress={goToPreviousSlide}>
                  <Text className="p-4 font-montserratSemiBold text-Gray dark:text-Accent">
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View>
              {currentIndex < OnboardingData.length - 1 ? (
                <TouchableOpacity
                  onPress={goToNextSlide}
                  activeOpacity={0.8}
                  className="p-2 border rounded-full border-Primary"
                >
                  <View className="p-4 rounded-full bg-Primary">
                    <Ionicons
                      name="chevron-forward-outline"
                      size={32}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <Button
                  padding="p-4"
                  size="medium"
                  title="Get Started"
                  textSize="text-lg"
                  borderRadius="rounded-2xl"
                  onPress={handleGetStarted}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
