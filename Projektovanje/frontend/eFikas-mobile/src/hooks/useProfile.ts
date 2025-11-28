import { useState, useEffect, useCallback } from "react";
import { profileService } from "@/src/api/services/profileService";
import { ProfileData } from "@/src/types/types";
import { toastService } from '../services/toastService';
import { useTranslation } from "react-i18next";

export const useProfile = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dohvati profil sa backend-a
    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await profileService.fetchProfile();
            setProfile(data);
        } catch (err: any) {
            console.error("Failed to fetch profile:", err);
            const errorMessage = err.message || t("profile.toastMessages.genericError");
            setError(errorMessage);
            toastService.error(
                t("profile.toastMessages.fetchErrorTitle"), 
                t("profile.toastMessages.fetchErrorMessage")
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update profila
    const updateProfile = useCallback(async (updatedData: ProfileData) => {
        setIsSaving(true);
        setError(null);
        try {
            await profileService.updateProfile(updatedData);
            setProfile(updatedData);
        } catch (err: any) {
            console.error("Failed to update profile:", err);
            const errorMessage = err.message || t("profile.toastMessages.genericError");
            setError(errorMessage);
            toastService.error(
                t("profile.toastMessages.updateErrorTitle"), 
                t("profile.toastMessages.updateErrorMessage")
            );
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    // Automatsko ucitavanje podataka pri mount-u
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        isLoading,
        isSaving,
        error,
        fetchProfile,
        updateProfile,
    };
};