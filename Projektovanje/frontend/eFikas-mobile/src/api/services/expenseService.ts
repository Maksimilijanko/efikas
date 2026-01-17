import axiosInstance from "../axiosInstance";
import { ApartmentExpenseDTO } from "@/src/types/types";

export const expenseService = {
    getByApartment: async (apartmentId: number) => {
        const response = await axiosInstance.get(`/apartments/${apartmentId}/expenses`);
        return response.data;
    },

    create: async (apartmentId: number, data: ApartmentExpenseDTO) => {
        const response = await axiosInstance.post(`/apartments/${apartmentId}/expenses`, data);
        return response.data;
    },

    updateStatus: async (apartmentId: number, name: string, currentData: ApartmentExpenseDTO) => {
        const payload = { ...currentData, status: true }; 
        const response = await axiosInstance.put(
            `/apartments/${apartmentId}/expenses/${encodeURIComponent(name)}`, 
            payload
        );
        return response.data;
    }
};