import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileTemplate from "@/src/components/templates/ProfileTemplate/ProfileTemplate";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { EditDeleteDialog } from "@/src/components/organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import AddCashRegisterDialog from "@/src/components/organisms/Dialogs/AddCashRegisterDialog/AddCashRegisterDialog";
import { useCashRegisters } from "@/src/hooks/useCashRegister";
import { Label } from "@/src/components/atoms/Label/Label";
import { useProfile } from "@/src/hooks/useProfile";
import { ProfileData } from "@/src/types/types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const navigation = useNavigation();
  const { profile, isLoading, isSaving, updateProfile } = useProfile();

  const { cashRegisters, isLoadingCashRegisters, isAdding, addCashRegister } =
    useCashRegisters();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData | null>(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleStartEdit = () => {
    if (profile) {
      setTempProfile(profile);
      setIsEditMode(true);
    }
    setIsDialogVisible(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!tempProfile) return;

    try {
      await updateProfile(tempProfile);
      setIsEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleChange = useCallback(
    (field: keyof ProfileData, value: string) => {
      setTempProfile((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    []
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (isEditMode) return null;
        return (
          <Pressable
            onPress={() => setIsDialogVisible(true)}
            style={{ paddingHorizontal: 8 }}
          >
            <Icon name="Ellipsis" size={24} color={Colors.textPrimary} />
          </Pressable>
        );
      },
    });
  }, [navigation, isEditMode]);

  const renderField = (
    fieldKey: keyof ProfileData,
    labelKey: string,
    readOnly = false
  ) => {
    const current = isEditMode ? tempProfile ?? profile : profile;
    const value = current?.[fieldKey] ?? "";
    const editable = isEditMode && !readOnly;

    return (
      <LabeledTextField
        label={t(labelKey)}
        value={value}
        size="xl"
        labelSize="lg"
        disabled={!editable}
        inputProps={{
          value,
          onChangeText: (text) => handleChange(fieldKey, text),
        }}
      />
    );
  };

  if (isLoading || !profile) {
    return (
      <ProfileTemplate
        content={
          <View style={{ marginTop: 80, alignItems: "center" }}>
            <ActivityIndicator size="large" color={Colors.tertiary} />
          </View>
        }
      />
    );
  }

  return (
    <>
      <ProfileTemplate
        content={
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={{ gap: 16, paddingBottom: 50 }}>
              {/* Sekcija za profil */}
              <Label
                text={t("profile.sectionTitle")}
                size="xl"
                color={Colors.primary}
                className="font-semibold"
              />

              {renderField("name", "profile.labels.firstName")}
              {renderField("surname", "profile.labels.lastName")}
              {renderField("jib", "profile.labels.taxId")}
              {renderField("email", "profile.labels.email")}

              {/* Sekcija za kase */}
              <View style={styles.cashRegisterSection}>
                <Label
                  text={t("cashRegisters.sectionTitle")}
                  size="xl"
                  color={Colors.primary}
                  className="font-semibold mb-4"
                />

                {isLoadingCashRegisters ? (
                  <ActivityIndicator
                    style={{ marginTop: 24 }}
                    color={Colors.tertiary}
                  />
                ) : (
                  cashRegisters.map((c, i) => (
                    <View
                      key={c.cashRegisterId}
                      style={styles.cashRegisterCard}
                    >
                      <LabeledTextField
                        label={`${t("cashRegisters.fields.number")} #${i + 1}`}
                        value={String(c.cashRegisterNumber)}
                        size="xl"
                        labelSize="lg"
                        disabled={true}
                        inputProps={{ value: String(c.cashRegisterNumber) }}
                      />
                      <LabeledTextField
                        label={t("cashRegisters.fields.version")}
                        value={c.softwareVersion}
                        size="xl"
                        labelSize="lg"
                        disabled={true}
                        inputProps={{ value: c.softwareVersion }}
                      />
                    </View>
                  ))
                )}
              </View>

              {isEditMode && (
                <View style={styles.buttonContainer}>
                  <DialogButton
                    title={t("profile.buttons.cancel")}
                    onPress={handleCancel}
                  />
                  <DialogButton
                    title={t("profile.buttons.save")}
                    onPress={handleSave}
                  />
                </View>
              )}

              <EditDeleteDialog
                visible={isDialogVisible}
                onClose={() => setIsDialogVisible(false)}
                onEdit={handleStartEdit}
                onDelete={() => {}}
                showDelete={false}
              />
            </View>
          </ScrollView>
        }
      />

      {/* <FloatButton
        size="lg"
        placement="bottom right"
        onClick={() => setIsAddModalVisible(true)}
      /> */}
      {!isEditMode && (
        <View style={styles.floatButtonContainer}>
          <FloatButton
            size="lg"
            placement="bottom right"
            onClick={() => setIsAddModalVisible(true)}
          />
        </View>
      )}

      <AddCashRegisterDialog
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        isAdding={isAdding}
        onAdd={async (dto) => {
          await addCashRegister(dto);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 32,
  },
  cashRegisterSection: {
    marginTop: 24,
  },
  cashRegisterCard: {
    padding: 0,
    gap: 16,
    marginBottom: 20,
  },
  floatButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});
