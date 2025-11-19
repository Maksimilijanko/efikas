import React, { useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Colors } from "@/src/styles/style";

interface ThemeOption {
  id: string;
  label: string;
  image: any;
}

interface ThemeDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (themeId: string) => void;
  selectedTheme: string;
}

export const ThemeDialog: React.FC<ThemeDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedTheme,
}) => {
  const [selected, setSelected] = useState(selectedTheme);

  const themeOptions: ThemeOption[] = [
    { id: "light", label: "Svijetla", image: require("@/assets/images/theme_light.png") },
    { id: "dark", label: "Tamna", image: require("@/assets/images/theme_dark.png") },
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
            <Text style={styles.sectionTitle}>Tema</Text>

            <View style={styles.optionsContainer}>
              {themeOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.option}
                  onPress={() => handleSelect(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.themeShadowWrapper}>
                    <View style={styles.themeRoundedWrapper}>
                      <Image source={option.image} style={styles.themeImage} />
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
            <DialogButton title="Odustani" onPress={onClose} />
            <DialogButton title="Potvrdi" onPress={handleConfirm} />
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
  themeShadowWrapper: {
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
  themeRoundedWrapper: {
    borderRadius: 5,
    overflow: "hidden",
  },
  themeImage: {
    width: 51,
    height: 105,
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