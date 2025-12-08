import React from "react";
import { Modal, View, Text, Image, StyleSheet } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
// import { Colors } from "@/src/styles/style";
import { useTheme } from "@/src/providers/ThemeProvider";

interface DocumentDialogProps {
  visible: boolean;
  documentUrl?: string; // URL ili lokalna putanja slike
  onClose: () => void;
}

export const DocumentDialog: React.FC<DocumentDialogProps> = ({
  visible,
  documentUrl,
  onClose,
}) => {
    const { Colors } = useTheme();

    const styles = StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.60)",
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
          // shadowColor: Colors.shadowColor,
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },
        documentImage: {
          width: "100%",
          height: 300,
          marginBottom: 20,
          borderRadius: 10,
        },
        noDocumentText: {
          fontSize: 14,
          color: Colors.textSecondary,
          textAlign: "center",
          marginBottom: 20,
        },
    });

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {documentUrl ? (
              <Image source={{ uri: documentUrl }} style={styles.documentImage} resizeMode="contain" />
            ) : (
              <Text style={styles.noDocumentText}>
                Za ovu rezervaciju nema dokumenta gosta
              </Text>
            )}
            <DialogButton title="U redu" onPress={onClose} />
          </View>
        </View>
      </Modal>
    );
};