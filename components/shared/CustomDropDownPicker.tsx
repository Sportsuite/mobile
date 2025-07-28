import React from "react";
import { View, Text, useColorScheme } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface CustomDropDownPickerProps {
  open: boolean;
  value: string | null;
  items: { label: string; value: string }[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  placeholder: string;
  label: string;
}

const CustomDropDownPicker: React.FC<CustomDropDownPickerProps> = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder,
  label,
}) => {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Text className="mb-2 text-sm font-montserratSemiBold dark:text-white">
        {label}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        style={{
          borderColor: "#ccc",
          paddingVertical: 16,
          backgroundColor: colorScheme === "dark" ? "#131214" : "white",
        }}
        dropDownContainerStyle={{ borderColor: "#ccc" }}
        placeholderStyle={{
          color: colorScheme === "dark" ? "white" : "black",
        }}
        listMode="MODAL"
      />
    </View>
  );
};

export default CustomDropDownPicker;
