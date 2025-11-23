import React, { useState } from "react";
import { Modal, View, TextInput, StyleSheet, Platform } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Colors } from "@/src/styles/style";

interface ReportDialogProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (text: string) => void;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [text, setText] = useState("");
  const [inputHeight, setInputHeight] = useState(140);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.textInput, { height: inputHeight }]}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Opis problema..."
              placeholderTextColor={Colors.tertiary}
              onContentSizeChange={(e) =>
                setInputHeight(Math.max(140, e.nativeEvent.contentSize.height))
              }
            />
          </View>

          {/* Dugmad */}
          <View style={styles.buttonsContainer}>
            <DialogButton title="Odustani" onPress={onCancel} />
            <DialogButton title="Pošalji" onPress={() => onSubmit(text)} />
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
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",

    elevation: 8,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  inputWrapper: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 0.2,
    borderColor: Colors.borderColor,

    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 4 },
    }),
  },

  textInput: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlignVertical: "top",
  },

  buttonsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
