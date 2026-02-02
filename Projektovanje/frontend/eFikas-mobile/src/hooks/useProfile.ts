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
        isLoading: isLoadingProfile,
        isError: isProfileError,
        error: profileError,
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
        isPending: isSavingProfile,
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


	// -------- FETCH STORE --------
	const {
        data: store,
        isLoading: isLoadingStore,
        isError: isErrorStore,
        error: storeError,
        refetch: fetchStore,
    } = useQuery({
        queryKey: ["store"],
        queryFn: async () => {
            try {
                return await profileService.fetchStore();
            } catch (err: any) {
                const errorMessage = err.message || t("profile.toastMessages.genericError");

                throw new Error(errorMessage);
            }
        },
        retry: 1, 
        // Optional: wait 1 second between retries instead of exponential backoff
        retryDelay: 1000,
    });

	// -------- ADD STORE --------
	const {
		mutateAsync: addStore,
		isPending: isAddingStore,
	} = useMutation({
		mutationFn: async (data: StoreDTO) => {
			// Just return the call. Let Axios throw, it will be catched by onError
			const response = await profileService.registerStore(data);
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["store"] }); // Refetch is safer than setQueryData
			toastService.success(
				t("profile.toastMessages.addStoreSuccessTitle"),
				t("profile.toastMessages.addStoreSuccessMessage")
			);
		},
		onError: (err: any) => {
			if (err.response?.status === 409) {
				toastService.error(t("profile.toastMessages.addStoreErrorExistsTitle"));
			} else {
				toastService.error(
					t("profile.toastMessages.addStoreErrorTitle"),
					t("profile.toastMessages.addStoreErrorMessage")
				);
			}
			console.log("Mutation Error: ", err.message);
		},
	});

    return {
        profile,
		store,
        isLoading: isLoadingProfile,
		isLoadingStore,
        isSaving: isSavingProfile,
        isError: isProfileError,
		isErrorStore,
        error: (profileError as Error)?.message ?? null,
		storeError: (storeError as Error)?.message ?? null,
        fetchProfile,
        updateProfile,
		fetchStore,
		addStore,
		isAddingStore
    };
};