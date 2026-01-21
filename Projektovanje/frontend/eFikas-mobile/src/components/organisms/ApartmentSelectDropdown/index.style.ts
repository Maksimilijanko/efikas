import { StyleSheet } from "react-native";

export const getStyles = (Colors: any) =>
  StyleSheet.create({
    wrapper: {
      width: "100%",
    },

    card: {
      borderWidth: 1,
      borderColor: Colors.borderColor,
      borderRadius: 10,
      backgroundColor: Colors.cardBackground,
      overflow: "hidden",
    },

    head: {
      justifyContent: "center",
    },

    dropdown: {
      borderTopWidth: 1,
      borderTopColor: Colors.borderColor,
    },

    item: {
      justifyContent: "center",
    },

    content: {
      padding: 12,
      minHeight: 88,
      justifyContent: "center",
    },

    row: {
      // alignItems: "center",
      alignItems: "flex-start",
    },

    thumb: {
      width: 72,
      height: 72,
      borderRadius: 6,
    },

    textCol: {
      flex: 1,
    },

    divider: {
      height: 1,
      backgroundColor: Colors.borderColor,
    },

    pressed: {
      opacity: 0.85,
    },
  });