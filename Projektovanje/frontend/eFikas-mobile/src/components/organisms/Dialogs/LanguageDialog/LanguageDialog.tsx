import React, { useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Colors } from "@/src/styles/style";
import { useTranslation } from "react-i18next";

interface LanguageOption {
  id: string;
  label: string;
  image: any;
}

interface LanguageDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (languageId: string) => void;
  selectedLanguage: string;
}

export const LanguageDialog: React.FC<LanguageDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedLanguage,
}) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(selectedLanguage);

  const languageOptions: LanguageOption[] = [
    { 
      id: "en", 
      label: t("dialogs.language.langEn"),
      image: require("@/assets/images/language-en.jpg")
    },
    {
      id: "sr",
      label: t("dialogs.language.langSr"),
      image: require("@/assets/images/language-sr.jpg")
    },
  ];

  const handleSelect = (id: string) => setSelected(id);
  const handleConfirm = () => { onConfirm(selected); onClose(); };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Unutrasnji kontejner */}
          <View style={styles.innerContainer}>
            <Text style={styles.sectionTitle}>{t("dialogs.language.title")}</Text>

            <View style={styles.optionsContainer}>
              {languageOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.option}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.flagShadowWrapper}>
                    <View style={styles.flagRoundedWrapper}>
                      <Image source={option.image} style={styles.flag} />
                    </View>
                  </View>

                  <Text style={styles.label}>{option.label}</Text>

                  <View style={[
                    styles.radioOuter,
                    selected === option.id && styles.radioOuterSelected
                  ]}>
                    {selected === option.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <DialogButton title={t("dialogs.language.cancelButton")} onPress={onClose} />
            <DialogButton title={t("dialogs.language.confirmButton")} onPress={handleConfirm} />
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
    backgroundColor: Colors.background,
    width: "90%",
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
  innerContainer: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.tertiary,
    marginBottom: 24,
    textAlign: "left",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  option: {
    alignItems: "center",
    width: "40%",
  },
  flagShadowWrapper: {
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: Colors.background,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },
  flagRoundedWrapper: {
    borderRadius: 5,
    overflow: "hidden",
  },
  flag: {
    width: 100,
    height: 60,
    resizeMode: "cover",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: Colors.primary,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
  },
});