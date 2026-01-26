import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ProfileData, StoreDTO } from "@/src/types/types";
import { AxiosResponse } from "axios";

export const profileService = {
    fetchProfile: async (): Promise<ProfileData> => {
        const response = await axiosInstance.get<ProfileData>(API_URLS.profile.get);
        return response.data;
    },

    updateProfile: async (data: ProfileData): Promise<void> => {
        await axiosInstance.put(API_URLS.profile.update, data);
    },

	fetchStore: async (): Promise<StoreDTO> => {
		const response = await axiosInstance.get<StoreDTO>(API_URLS.profile.getStore);
		return response.data;
	},

	registerStore: async (data: StoreDTO): Promise<AxiosResponse> => {
		const response = await axiosInstance.post(API_URLS.profile.registerStore, data);
		return response;
	}
};