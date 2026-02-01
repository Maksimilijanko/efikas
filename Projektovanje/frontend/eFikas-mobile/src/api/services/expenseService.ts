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
        // Filtriramo polja tačno onako kako Java DTO zahteva
        const payload = { 
            name: currentData.name,
            amount: currentData.amount,
            expenseType: currentData.expenseType,
            note: currentData.note || "",
            status: true // Menjamo status u završeno
        }; 

        const response = await axiosInstance.put(
            `/apartments/${apartmentId}/expenses/${encodeURIComponent(name)}`, 
            payload
        );
        return response.data;
    }
};