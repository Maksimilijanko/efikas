import { StyleSheet, Platform } from "react-native";
import { Colors } from "@/src/styles/style";

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  card: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 6,
      },
    }),
  },

  cardDisabled: {
    opacity: 0.6,
  },

  thumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },

  textCol: {
    flex: 1,
    justifyContent: "center",
  },

  caretBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },

  caretBtnPressed: {
    opacity: 0.85,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0)",
  },

  dropdown: {
    position: "absolute",
    zIndex: 9999,
  },

  sheet: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 14 },
      },
      android: {
        elevation: 10,
      },
    }),
  },

  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },

  itemPressed: {
    opacity: 0.9,
  },

  row: {
    alignItems: "center",
    width: "100%",
  },

  thumbSmall: {
    width: 58,
    height: 58,
    borderRadius: 16,
  },

  itemTextCol: {
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
  },
});

export default styles;
