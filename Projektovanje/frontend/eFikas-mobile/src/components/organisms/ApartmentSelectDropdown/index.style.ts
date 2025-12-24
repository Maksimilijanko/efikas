import { StyleSheet, Platform } from "react-native";

export const getStyles = (Colors: any) => StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "relative",
    zIndex: 1000,
  },
  
  head: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.cardBackground || "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor || "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  dropdown: {
    position: "absolute", 
    top: "100%", 
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: Colors.cardBackground || "#FFFFFF", 
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    overflow: "hidden",
    zIndex: 1001, 
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  
  row: {
    width: "100%",
    alignItems: "center",
  },
  
  thumb: {
    width: 95,
    height: 95,
    borderRadius: 14,
  },
  
  textCol: {
    flex: 1,
  },
  
  chevWrap: {
    width: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  
  item: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.cardBackground || "#FFFFFF",
  },
  
  divider: {
    height: 1,
    backgroundColor: Colors.borderColor,
  },
  
  pressed: {
    opacity: 0.85,
  },
});