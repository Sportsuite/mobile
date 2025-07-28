import { Dimensions } from "react-native";

const useDimensions = (widthRatio: number = 1, heightRatio: number = 1) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const width = screenWidth * widthRatio;
  const height = screenHeight * heightRatio;

  return { width, height };
};

export default useDimensions;
