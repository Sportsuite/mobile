import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import SafeHTMLRenderer from "./SafeHTMLRenderer";
import { getSize } from "@/utils/useScaleSize";
import containsHTML from "@/utils/ContainsHTML";

interface RichTextRendererProps {
  htmlContent: string;
  maxLines?: number;
  onToggle?: () => void;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  htmlContent,
  maxLines = 3,
  onToggle,
}) => {
  const height = getSize(2, "height");
  const [expanded, setExpanded] = useState(false);
  const isHTML = containsHTML(htmlContent);

  return isHTML ? (
    <View style={{ flexGrow: 1 }} className="mb-4">
      <SafeHTMLRenderer
        source={{ html: htmlContent }}
        baseStyle={{
          overflow: "hidden",
          maxHeight: expanded ? "auto" : maxLines * height,
        }}
      />

      {!expanded && htmlContent.length > maxLines * height && (
        <TouchableOpacity
          onPress={() => {
            setExpanded(true);
            onToggle?.();
          }}
        >
          <Text className="text-blue-500 mt-2">Show more</Text>
        </TouchableOpacity>
      )}

      {expanded && htmlContent.length > maxLines * height && (
        <TouchableOpacity
          onPress={() => {
            setExpanded(false);
            onToggle?.();
          }}
        >
          <Text className="text-blue-500 mt-2">Show less</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <Text
      className="font-montserratRegular mt-4 leading-relaxed dark:text-white"
      style={{ fontSize: getSize(4, "width") }}
    >
      {htmlContent}
    </Text>
  );
};

export default RichTextRenderer;
