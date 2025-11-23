import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Colors } from "@/src/styles/style";

interface DownloadDialogProps {
  visible: boolean;
  onClose: () => void;
}

export const DownloadDialog: React.FC<DownloadDialogProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Tekst */}
          <Text style={styles.title}>Dokument se preuzima</Text>
          <Text style={styles.subtitle}>Provjerite folder sa preuzimanjima</Text>

          {/* Dugme */}
          <View style={styles.buttonContainer}>
            <DialogButton title="U redu" onPress={onClose} />
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

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
  },

  buttonContainer: {
    width: "50%",
  },
});
