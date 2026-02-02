import axiosInstance from "../axiosInstance";
import { ApartmentTaskDTO } from "@/src/types/types";

export const taskService = {
    getTasks: async (apartmentId: number) => {
        const response = await axiosInstance.get(`/apartments/${apartmentId}/tasks`);
        return response.data;
    },

    create: async (apartmentId: number, payload: ApartmentTaskDTO) => {
        const response = await axiosInstance.post(`/apartments/${apartmentId}/tasks`, payload);
        return response.data;
    },

   updateStatus: async (apartmentId: number, taskName: string, currentData: ApartmentTaskDTO) => {
    // Filtriramo polja tačno prema tvom interfejsu
    const payload: ApartmentTaskDTO = { 
        name: currentData.name,
        note: currentData.note,
        dateTime: currentData.dateTime,
        status: true // Završavamo zadatak
    }; 

    const response = await axiosInstance.put(
        `/apartments/${apartmentId}/tasks/${encodeURIComponent(taskName)}`, 
        payload
    );
    return response.data;
}
};