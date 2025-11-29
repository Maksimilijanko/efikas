import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from "@/src/api/services/profileService";
import { ProfileData } from "@/src/types/types";
import { toastService } from '../services/toastService';
import { useTranslation } from "react-i18next";

export const useProfile = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // -------- FETCH PROFILE --------
    const {
        data: profile,
        isLoading,
        isError,
        error,
        refetch: fetchProfile,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                return await profileService.fetchProfile();
            } catch (err: any) {
                const errorMessage = err.message || t("profile.toastMessages.genericError");
                toastService.error(
                    t("profile.toastMessages.fetchErrorTitle"),
                    t("profile.toastMessages.fetchErrorMessage")
                );
                throw new Error(errorMessage);
            }
        },
    });

    // -------- UPDATE PROFILE --------
    const {
        mutateAsync: updateProfile,
        isPending: isSaving,
    } = useMutation({
        mutationFn: async (updatedData: ProfileData) => {
            try {
                await profileService.updateProfile(updatedData);
                return updatedData;
            } catch (err: any) {
                const errorMessage = err.message || t("profile.toastMessages.genericError");
                toastService.error(
                    t("profile.toastMessages.updateErrorTitle"),
                    t("profile.toastMessages.updateErrorMessage")
                );
                throw new Error(errorMessage);
            }
        },
        onSuccess: (updatedData) => {
            // Ovim mozemo azurirati keš!
            queryClient.setQueryData(["profile"], updatedData);
        },
    });

    return {
        profile,
        isLoading,
        isSaving,
        isError,
        error: (error as Error)?.message ?? null,
        fetchProfile,
        updateProfile,
    };
};