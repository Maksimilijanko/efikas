import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ProfileData, StoreDTO } from "@/src/types/types";

export const profileService = {
    fetchProfile: async (): Promise<ProfileData> => {
        const response = await axiosInstance.get<ProfileData>(API_URLS.profile.get);
        return response.data;
    },

    updateProfile: async (data: ProfileData): Promise<void> => {
        await axiosInstance.put(API_URLS.profile.update, data);
    },

	registerStore: async (data: StoreDTO): Promise<void> => {
		await axiosInstance.post(API_URLS.profile.registerStore, data);
	}
};