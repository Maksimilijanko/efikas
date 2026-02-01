import axiosInstance from "../axiosInstance";
import { ApartmentDamageDTO } from "@/src/types/types";

export const damageService = {
    getByApartment: async (apartmentId: number) => {
        const response = await axiosInstance.get(`/apartments/${apartmentId}/damages`);
        return response.data;
    },

    create: async (apartmentId: number, data: ApartmentDamageDTO) => {
        const response = await axiosInstance.post(`/apartments/${apartmentId}/damages`, data);
        return response.data;
    },

     updateStatus: async (apartmentId: number, name: string, currentData: ApartmentDamageDTO) => {

    // Ovako filtriramo samo polja koja Java DTO dozvoljava

    const payload = {

        name: currentData.name,

        damagePrice: currentData.damagePrice,

        note: currentData.note,

        status: true // Ovde ga menjamo

    };



    const response = await axiosInstance.put(

        `/apartments/${apartmentId}/damages/${encodeURIComponent(name)}`,

        payload

    );

    return response.data;

}
};
