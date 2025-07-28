import { useColorScheme, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

interface Props {
  options: TicketOptions;
}
export default function Aminities({ options }: Props) {
  const colorScheme = useColorScheme();
  return (
    <View className="flex-row justify-between mx-6">
      <View
        className={`rounded-full ${
          options?.giantScreen
            ? "bg-Primary"
            : colorScheme === "dark"
            ? "bg-NavBarDark"
            : "bg-LightGray"
        }  p-2`}
      >
        <MaterialCommunityIcons
          name="projector-screen-outline"
          size={32}
          color={colorScheme === "dark" ? "grey" : "white"}
        />
      </View>

      <View
        className={`rounded-full ${
          options?.giantScreen
            ? "bg-Primary"
            : colorScheme === "dark"
            ? "bg-NavBarDark"
            : "bg-LightGray"
        }  p-2`}
      >
        <MaterialCommunityIcons
          name="wheelchair-accessibility"
          size={32}
          color={colorScheme === "dark" ? "grey" : "white"}
        />
      </View>

      <View
        className={`rounded-full ${
          options?.giantScreen
            ? "bg-Primary"
            : colorScheme === "dark"
            ? "bg-NavBarDark"
            : "bg-LightGray"
        }  p-2`}
      >
        <MaterialIcons
          name="chair-alt"
          size={32}
          color={colorScheme === "dark" ? "grey" : "white"}
        />
      </View>

      <View
        className={`rounded-full ${
          options?.giantScreen
            ? "bg-Primary"
            : colorScheme === "dark"
            ? "bg-NavBarDark"
            : "bg-LightGray"
        }  p-2`}
      >
        <MaterialIcons
          name="warehouse"
          size={32}
          color={colorScheme === "dark" ? "grey" : "white"}
        />
      </View>
    </View>
  );
}
