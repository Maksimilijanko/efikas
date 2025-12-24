import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import { ModalHeader } from "@/src/components/ui/modal";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd: (payload: {
    cashRegisterNumber: number;
    softwareVersion: string;
  }) => Promise<void>;
  isAdding?: boolean;
}

export default function AddCashRegisterDialog({
  visible,
  onClose,
  onAdd,
  isAdding,
}: Props) {
  const { Colors } = useTheme();
  const { t } = useTranslation();

  const [cashRegisterNumber, setCashRegisterNumber] = useState<string>("");
  const [softwareVersion, setSoftwareVersion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCashRegisterNumber("");
    setSoftwareVersion("");
    setError(null);
  };

  const handleCancel = useCallback(() => {
    reset();
    onClose();
  }, [onClose]);

  const handleAdd = async () => {
    setError(null);
    const numberParsed = Number(cashRegisterNumber);

    if (!cashRegisterNumber || Number.isNaN(numberParsed)) {
      setError(
        t("cashRegisters.validation.invalidNumber") ||
          "Invalid cash register number"
      );
      return;
    }
    if (!softwareVersion.trim()) {
      setError(
        t("cashRegisters.validation.invalidVersion") ||
          "Invalid software version"
      );
      return;
    }

    try {
      await onAdd({
        cashRegisterNumber: numberParsed,
        softwareVersion: softwareVersion.trim(),
      });
      reset();
      onClose();
    } catch (err) {
      setError(
        (err as Error)?.message ?? t("cashRegisters.toastMessages.createError")
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <View style={[styles.backdrop]}>
          <View style={[styles.modal, { backgroundColor: Colors.background }]}>
            <ModalHeader>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={[styles.sectionTitle, { color: Colors.tertiary }]}>
                  {t("dialogs.cashRegister.title")}
                </Text>
              </View>
            </ModalHeader>
            <View style={{ marginBottom: 16 }}>
              <LabeledTextField
                label={t("cashRegisters.fields.number")}
                required
                value={cashRegisterNumber}
                onChangeText={setCashRegisterNumber}
                size="lg"
                labelSize="lg"
                inputProps={{
                  keyboardType: "number-pad",
                }}
              />
            </View>

            <View>
              <LabeledTextField
                label={t("cashRegisters.fields.version")}
                required
                value={softwareVersion}
                onChangeText={setSoftwareVersion}
                size="lg"
                labelSize="lg"
              />
            </View>

            {error ? <Text style={[styles.errorText]}>{error}</Text> : null}

            <View style={styles.buttonsRow}>
              <View style={styles.buttonWrapper}>
                <DialogButton
                  title={t("dialogs.cashRegister.cancel")}
                  onPress={handleCancel}
                />
              </View>

              <View style={styles.buttonWrapper}>
                <DialogButton
                  title={t("dialogs.cashRegister.add")}
                  onPress={handleAdd}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  errorText: {
    marginTop: 8,
    color: "crimson",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  },
});
