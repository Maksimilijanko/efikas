import React, { useState, useCallback } from "react";
import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileTemplate from "@/src/components/templates/ProfileTemplate/ProfileTemplate";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { EditDeleteDialog } from "@/src/components/organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Colors } from "@/src/styles/style";
import { useProfile } from "@/src/hooks/useProfile";
import { ProfileData } from "@/src/types/types";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { profile, isLoading, isSaving, updateProfile } = useProfile();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [tempProfile, setTempProfile] = useState<ProfileData | null>(null);

    // Otvoranje edit mode-a i kopiranje trenutnog profil u temp
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

    const handleChange = useCallback((field: keyof ProfileData, value: string) => {
        if (!tempProfile) return;
        setTempProfile(prev => prev ? { ...prev, [field]: value } : null);
    }, [tempProfile]);

    // Header sa tri tackice
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (isEditMode) return null;
                return (
                    <Pressable onPress={() => setIsDialogVisible(true)} style={{ paddingHorizontal: 8 }}>
                        <Icon 
                            name="Ellipsis" 
                            size={24} 
                            color={Colors.textPrimary} />
                    </Pressable>
                );
            },
        });
    }, [navigation, isEditMode]);

    // Render polja
    const renderField = (fieldKey: keyof ProfileData, labelKey: string, readOnly = false) => {
        const value = isEditMode && tempProfile ? tempProfile[fieldKey] : profile ? profile[fieldKey] : "";
        const editable = isEditMode && !readOnly;
        return (
            <LabeledTextField
                label={t(labelKey)}
                value={value}
                size="xl"
                labelSize="lg"
                // Onemoguceno ako nismo u edit modu
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
        <ProfileTemplate
            content={
                <View style={{ gap: 16, paddingBottom: 50 }}>
                    {renderField("firstName", "profile.labels.firstName")}
                    {renderField("lastName", "profile.labels.lastName")}
                    {renderField("taxId", "profile.labels.taxId")}
                    {renderField("registerNumber", "profile.labels.registerNumber")}
                    {/* korisnik ne bi trebao da mijenja verziju softvera ??? */}
                    {renderField("softwareVersion", "profile.labels.softwareVersion", true)}

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

                    {/* Dijalog za edit */}
                    <EditDeleteDialog
                        visible={isDialogVisible}
                        onClose={() => setIsDialogVisible(false)}
                        onEdit={handleStartEdit}
                        onDelete={() => {}}
                        showDelete={false}
                    />
                </View>
            }
        />
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
    button: {
        flex: 1,
        marginHorizontal: 8,
    },
});
