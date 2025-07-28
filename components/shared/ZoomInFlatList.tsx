import { Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

interface ZoomInFlatListProps {
  data: any[];
  renderItem: ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => React.ReactNode;
  keyExtractor?: ((item: any, index: number) => string) | undefined;
  horizontal?: boolean;
  scrollAxis: string;
  ListFooterComponent?: any;
  refreshControl?: any;
}

export default function ZoomInFlatList({
  data,
  renderItem,
  keyExtractor,
  horizontal = false,
  scrollAxis = "x",
  ListFooterComponent,
  refreshControl,
}: ZoomInFlatListProps) {
  const zoomAnim = useRef(new Animated.Value(0.8)).current; // Start at 50% scale
  const scrollPos = useRef(new Animated.Value(0)).current; // Start at 0 position

  useEffect(() => {
    Animated.timing(zoomAnim, {
      toValue: 1, // Animate to full size
      duration: 500, // 0.5s animation
      easing: Easing.out(Easing.cubic), // Smooth easing
      useNativeDriver: true, // Better performance
    }).start();
  }, []);

  const getZoomOutStyle = (index: number) => {
    // Adjust these values based on your item size
    const itemSize = horizontal ? 200 : 100;

    return {
      transform: [
        {
          scale: scrollPos.interpolate({
            inputRange: [
              (index - 1) * itemSize,
              index * itemSize,
              (index + 1) * itemSize,
            ],
            outputRange: [1, 0.9, 1],
            extrapolate: "clamp",
          }),
        },
        { scale: zoomAnim },
      ],
      opacity: zoomAnim,
    };
  };

  return (
    <Animated.FlatList
      refreshControl={refreshControl}
      data={data}
      renderItem={({ item, index }) => (
        <Animated.View style={getZoomOutStyle(index)}>
          {renderItem({ item, index })}
        </Animated.View>
      )}
      keyExtractor={keyExtractor}
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                // Dynamic axis selection
                [scrollAxis]: scrollPos,
              },
            },
          },
        ],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      ListEmptyComponent={ListFooterComponent}
    />
  );
}
