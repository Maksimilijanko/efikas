import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { SettingsDialog } from "../SettingsDialog/SettingsDialog";
import { useTheme } from "@/src/providers/ThemeProvider";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

interface LanguageDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (languageId: string) => void;
  selectedLanguage?: string;
}

export const LanguageDialog: React.FC<LanguageDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedLanguage,
}) => {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const [selected, setSelected] = useState(selectedLanguage);

  const languageOptions = [
    { id: "en", label: t("dialogs.language.langEn"), image: require("@/assets/images/language-en.jpg") },
    { id: "sr", label: t("dialogs.language.langSr"), image: require("@/assets/images/language-sr.jpg") },
  ];

  return (
    <SettingsDialog
      visible={visible}
      title={t("dialogs.language.title")}
      onClose={onClose}
      onConfirm={() => onConfirm(selected!)}
    >
      <HStack style={styles.optionsContainer}>
        {languageOptions.map((opt) => (
          <Pressable key={opt.id} onPress={() => setSelected(opt.id)} style={styles.option}>
            <VStack style={{ alignItems: "center", width: "100%" }}>
              <View style={{ marginBottom: 16 }}>
                <Image source={opt.image} style={{ width: 100, height: 60, borderRadius: 5 }} />
              </View>
              <Text style={[styles.label, { color: Colors.textSecondary }]}>{opt.label}</Text>
              <Box
                style={[
                  styles.radioOuter,
                  { borderColor: selected === opt.id ? Colors.primary : Colors.tertiary },
                ]}
              >
                {selected === opt.id && <Box style={[styles.radioInner, { backgroundColor: Colors.primary }]} />}
              </Box>
            </VStack>
          </Pressable>
        ))}
      </HStack>
    </SettingsDialog>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  option: {
    alignItems: "center",
    width: "40%",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
});