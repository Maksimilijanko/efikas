import React from "react";
import { Modal, View, Text, StyleSheet, Platform } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Colors } from "@/src/styles/style";

interface LogoutDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Tekst */}
          <Text style={styles.message}>
            Da li ste sigurni da želite da se odjavite sa ovog naloga?
          </Text>

          {/* Dugmad */}
          <View style={styles.buttonsContainer}>
            <DialogButton title="Odustani" onPress={onCancel} />
            <DialogButton title="Potvrdi" onPress={onConfirm} />
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 8,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },

  buttonsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
