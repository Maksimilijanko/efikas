import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import AddCashRegisterDialog from "@/src/components/organisms/Dialogs/AddCashRegisterDialog/AddCashRegisterDialog";
import { EditDeleteDialog } from "@/src/components/organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import ProfileTemplate from "@/src/components/templates/ProfileTemplate/ProfileTemplate";
import { useCashRegisters } from "@/src/hooks/useCashRegister";
import { useProfile } from "@/src/hooks/useProfile";
import { useTheme } from "@/src/providers/ThemeProvider";
import { LucideIconName, ProfileData, StoreDTO } from "@/src/types/types";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import FormField from "../../molecules/FormField/FormField";
import CustomMenu, { CustomMenuItemProp } from "../../organisms/CustomMenu/CustomMenu";
import AddStoreDialog from "../../organisms/Dialogs/AddStoreDialog/AddStoreDialog";
import { StoreValidation } from "@/src/util/validationSchemas";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const navigation = useNavigation();
  const { profile, isLoading, isSaving, updateProfile, addStore } = useProfile();
  

  const { cashRegisters, isLoadingCashRegisters, isAdding, addCashRegister } =
    useCashRegisters();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData | null>(null);

  const [isAddCashRegisterModalVisible, setIsAddCashRegisterModalVisible] = useState(false);
  const [isAddStoreModalVisible, setIsAddStoreModalVisible] = useState(false);

  const menuItems: CustomMenuItemProp[] = [
	{ key: "1", textValue: t('profile.menuItems.addCashRegister'), iconName: "Computer", onPress: () => setIsAddCashRegisterModalVisible(true) },
	{ key: "2", textValue: t('profile.menuItems.addStore'), iconName: "Store", onPress: () => setIsAddStoreModalVisible(true) },
  ];

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

  // header - tri tackice
  useEffect(() => {
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
  }, [navigation, isEditMode, Colors.textPrimary]);

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
          	<CustomMenu
				offset={10}
				crossOffset={10}
				items={menuItems}
				renderTrigger={(triggerProps) => (
					<FloatButton
						size="lg"
						placement="bottom right"
						{...triggerProps}
					/> 
				)}	
			/>
        </View>
		
      )}

      <AddCashRegisterDialog
        visible={isAddCashRegisterModalVisible}
        onClose={() => setIsAddCashRegisterModalVisible(false)}
        isAdding={isAdding}
        onAdd={async (dto) => {
          await addCashRegister(dto);
        }}
      />

		<AddStoreDialog 
			visible={isAddStoreModalVisible} 
			title={t('profile.store.addModalTitle')} 
			onClose={() => setIsAddStoreModalVisible(false)} 
			onConfirm={(data: StoreValidation.FormValues) => { 
				const dto: StoreDTO = { 
					name: data.name,
					address: data.address,
					activity: data.activity,
					activityCode: data.activityCode,
					jib: data.activityCode
				}
				addStore(dto);
			}}
		>
			
		</AddStoreDialog>
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
    bottom: 30,
    right: 20,
    zIndex: 10,
  },
});
