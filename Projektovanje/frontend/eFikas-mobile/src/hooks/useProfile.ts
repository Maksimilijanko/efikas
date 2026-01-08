import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from "@/src/api/services/profileService";
import { ProfileData, StoreDTO } from "@/src/types/types";
import { toastService } from '../services/toastService';
import { useTranslation } from "react-i18next";
import { AxiosError } from 'axios';

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

	// -------- ADD STORE --------
	const {
		mutateAsync: addStore,
		isPending: isAddingStore,
	} = useMutation({
		mutationFn: async (data: StoreDTO) => {
			try {
				await profileService.registerStore(data);
			} catch (err: any) {
				if(err instanceof AxiosError) {
					const status = err.response?.status;
					if(status === 409) {
						toastService.error(
							t("profile.toastMessages.addStoreErrorExistsTitle")
						);
					}
					else {
						toastService.error(
							t("profile.toastMessages.addStoreErrorTitle"),
							t("profile.toastMessages.addStoreErrorMessage")
						);
					}
				}

				console.log(err.message);
			}
		},
		onSuccess: async () => {
			// safest option: refetch profile
			await queryClient.invalidateQueries({ queryKey: ["profile"] });

			toastService.success(
				t("profile.toastMessages.addStoreSuccessTitle"),
				t("profile.toastMessages.addStoreSuccessMessage")
			);
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
		addStore,
		isAddingStore
    };
};