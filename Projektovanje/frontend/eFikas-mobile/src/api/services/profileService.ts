import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ProfileData } from "@/src/types/types";

// export const profileService = {
//     fetchProfile: async (): Promise<ProfileData> => {
//         const response = await axiosInstance.get<ProfileData>(API_URLS.profile.get);
//         return response.data;
//     },

//     updateProfile: async (data: ProfileData): Promise<void> => {
//         await axiosInstance.put(API_URLS.profile.update, data);
//     }
// };


// MOCK podaci
const mockProfile: ProfileData = {
    firstName: "Marko",
    lastName: "Markovic",
    taxId: "1234567890",
    registerNumber: "54321",
    softwareVersion: "2.1.0",
};

export const profileService = {
    fetchProfile: async (): Promise<ProfileData> => {
        // simuliramo network delay
        return new Promise(resolve => setTimeout(() => resolve(mockProfile), 500));
    },

    updateProfile: async (data: ProfileData): Promise<void> => {
        return new Promise(resolve => setTimeout(() => {
            console.log("Profil sacuvan:", data);
            resolve();
        }, 500));
    },
};