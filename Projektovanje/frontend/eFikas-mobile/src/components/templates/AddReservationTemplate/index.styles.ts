import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const getStyles = (Colors: any) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  inner: {
    width: "100%",
    alignItems: "center",
  },
  apartmentSection: {
    width: "100%",
    marginBottom: 10,
    overflow: "visible",
  },
  row: {
    width: "100%",
    marginTop: 14,
  },
  rowTight: {
    width: "100%",
    marginTop: 12,
  },
  submitWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 72,
    paddingBottom: 10,
  },
});