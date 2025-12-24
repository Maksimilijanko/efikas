import { StyleSheet } from "react-native";
import { Colors } from "@/src/styles/style";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.background,
  },

  pressed: {
    opacity: 0.85,
  },

  image: {
    width: 64,
    height: 64,
    borderRadius: 14,
    marginRight: 14,
  },

  textCol: {
    flex: 1,
    justifyContent: "center",
  },
});
