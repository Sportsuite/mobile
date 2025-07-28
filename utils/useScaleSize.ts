import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");
export function getSize(
  percent: number,
  axis: "width" | "height" = "width"
): number {
  switch (axis) {
    case "width":
      return (percent / 100) * width;

    case "height":
      return (percent / 100) * height;

    default:
      throw new Error("Invalid axis. Use 'width' or 'height'.");
  }
}
