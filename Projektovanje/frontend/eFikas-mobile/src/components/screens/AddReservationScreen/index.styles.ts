import { StyleSheet } from "react-native";
import { Colors } from "@/src/styles/style";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  radioRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginTop: 10,
    marginBottom: 6,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.borderColor,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: Colors.background,
  },

  radioOuterActive: {
    borderColor: Colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },

  toggleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },

  switchWrap: {
    marginRight: -8,
  },

  inlineRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  counterRight: {
    alignItems: "center",
  },

  counterBtn: {
    width: 44,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: "center",
    justifyContent: "center",
  },

  counterMid: {
    width: 60,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: "center",
    justifyContent: "center",
  },

  counterValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  counterSymbol: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.primary,
    marginTop: -1,
  },

  priceRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  priceInputWrap: {
    width: 190,
    position: "relative",
    justifyContent: "center",
  },

  priceCurrency: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -9 }],
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textSecondary,
  },

  noteWrap: {
    width: "100%",
  },

  noteLabelRow: {
    marginBottom: 8,
  },

  noteBox: {
    width: "100%",
    position: "relative",
  },

  notePencil: {
    position: "absolute",
    right: 12,
    bottom: 12,
  },

  documentWrap: {
    width: "100%",
  },

  cameraBtn: {
    width: 64,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },

  documentPreviewRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  documentPreview: {
    width: 86,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.background,
  },

  documentRemove: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },

  submitBtn: {
    width: "72%",
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  submitBtnPressed: {
    backgroundColor: Colors.primaryPressed,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ translateY: 1 }],
  },

  radioText: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  submitBtnText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.85,
  },
});

export default styles;
