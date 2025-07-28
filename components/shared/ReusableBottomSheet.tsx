import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

// Define the props for the BottomSheet component
interface BottomSheetProps {
  children: React.ReactNode;
  onSheetChange: (index: number) => void;
  snapPoints: string[];
}

const ReusableBottomSheet = forwardRef((props: BottomSheetProps, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();

  // Expose BottomSheet methods through the ref
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
    close: () => bottomSheetRef.current?.close(),
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={props.snapPoints.length - 1}
      snapPoints={props.snapPoints} // Define snap points
      enablePanDownToClose={true} // Allow drag-down to close
      onChange={props.onSheetChange} // Handle bottom sheet state changes
      handleIndicatorStyle={{
        backgroundColor: colorScheme === "dark" ? "white" : "black",
      }}
      backgroundStyle={{
        backgroundColor: colorScheme === "dark" ? "#131214" : "white",
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={4}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetView
        style={[
          styles.contentContainer,
          { backgroundColor: colorScheme === "dark" ? "#131214" : "white" },
        ]}
      >
        {React.isValidElement(props.children) ? (
          props.children
        ) : (
          <Text>{String(props.children)}</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ReusableBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
