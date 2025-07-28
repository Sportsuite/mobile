import React from "react";
import { useColorScheme, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import type {
  MixedStyleRecord,
  RenderHTMLProps,
} from "react-native-render-html";

const SafeHTMLRenderer: React.FC<RenderHTMLProps> = (props) => {
  const isLight = useColorScheme() === "light";

  // Set default props manually (modern alternative to defaultProps)
  const {
    contentWidth = useWindowDimensions().width - 40,
    tagsStyles = {},
    baseStyle = {},
    ...rest
  } = props;

  // Properly typed styles
  const baseStyles: MixedStyleRecord = {
    // Text elements
    p: {
      fontSize: 16,
      marginBottom: 8,
      color: isLight ? "black" : "white",
      lineHeight: 22,
      textAlign: "left" as const,
    },
    span: {
      color: isLight ? "black" : "white",
      fontSize: 16,
    },
    div: {
      marginBottom: 8,
    },

    // Headings
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      marginVertical: 12,
      color: isLight ? "black" : "white",
    },
    h2: {
      fontSize: 28,
      fontWeight: "bold" as const,
      marginVertical: 10,
      color: isLight ? "black" : "white",
    },
    h3: {
      fontSize: 24,
      fontWeight: "bold" as const,
      marginVertical: 8,
      color: isLight ? "black" : "white",
    },
    h4: {
      fontSize: 20,
      fontWeight: "bold" as const,
      marginVertical: 6,
      color: isLight ? "black" : "white",
    },
    h5: {
      fontSize: 18,
      fontWeight: "bold" as const,
      marginVertical: 4,
      color: isLight ? "black" : "white",
    },
    h6: {
      fontSize: 16,
      fontWeight: "bold" as const,
      marginVertical: 2,
      color: isLight ? "black" : "white",
    },

    // Text formatting
    strong: {
      fontWeight: "bold" as const,
      color: isLight ? "black" : "white",
    },
    b: {
      fontWeight: "bold" as const,
      color: isLight ? "black" : "white",
    },
    em: {
      fontStyle: "italic" as const,
      color: isLight ? "black" : "white",
    },
    i: {
      fontStyle: "italic" as const,
      color: isLight ? "black" : "white",
    },
    u: {
      textDecorationLine: "underline" as const,
      color: isLight ? "black" : "white",
    },
    s: {
      textDecorationLine: "line-through" as const,
      color: isLight ? "black" : "white",
    },
    strike: {
      textDecorationLine: "line-through" as const,
      color: isLight ? "black" : "white",
    },

    mark: {
      backgroundColor: "yellow",
    },

    // Lists
    ul: {
      marginLeft: 20,
      marginBottom: 8,
      color: isLight ? "black" : "white",
    },
    ol: {
      marginLeft: 20,
      marginBottom: 8,
      color: isLight ? "black" : "white",
    },
    li: {
      marginBottom: 4,
      color: isLight ? "black" : "white",
    },

    // Links
    a: {
      color: "#0066cc",
      textDecorationLine: "underline" as const,
    },

    // Blockquotes
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: "#ddd",
      paddingLeft: 12,
      marginVertical: 8,
      color: isLight ? "black" : "white",
      fontStyle: "italic" as const,
    },

    // Code
    code: {
      fontFamily: "Courier",
      backgroundColor: "#f5f5f5",
      padding: 4,
      borderRadius: 3,
    },
    pre: {
      fontFamily: "Courier",
      backgroundColor: "#f5f5f5",
      padding: 10,
      borderRadius: 3,
      marginVertical: 8,
    },

    // Tables
    table: {
      borderWidth: 1,
      borderColor: isLight ? "black" : "white",
      borderRadius: 3,
      marginVertical: 8,
    },
    th: {
      fontWeight: "bold" as const,
      backgroundColor: isLight ? "black" : "white",
      padding: 8,
      textAlign: "center" as const,
      borderWidth: 1,
      borderColor: isLight ? "black" : "white",
    },
    td: {
      padding: 8,
      borderWidth: 1,
      borderColor: isLight ? "black" : "white",
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: isLight ? "black" : "white",
    },

    // Images
    img: {
      marginVertical: 8,
      maxWidth: "100%",
    },

    // Horizontal rule
    hr: {
      height: 1,
      backgroundColor: isLight ? "black" : "white",
      marginVertical: 12,
    },
  };

  return (
    <RenderHTML
      contentWidth={contentWidth}
      tagsStyles={baseStyles}
      baseStyle={{ ...baseStyle }}
      {...rest}
    />
  );
};

export default SafeHTMLRenderer;
