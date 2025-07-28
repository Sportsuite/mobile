import React from "react";
import { TouchableOpacity } from "react-native";
import { Fontisto } from "@expo/vector-icons";

interface ToggleSwitchProps {
  isToggled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isToggled, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Fontisto
        name={isToggled ? "toggle-on" : "toggle-off"}
        size={52}
        color={isToggled ? "#0052FF" : "#D1D1D6"}
      />
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
