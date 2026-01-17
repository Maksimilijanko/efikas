import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ApartmentResponse } from "@/src/types/types";


export const deleteApartmentService = {
  deleteApartment: async (apartmentId: number): Promise<ApartmentResponse> => {
    const url = API_URLS.apartments.delete(apartmentId);
        
    try {
      const response = await axiosInstance.delete<ApartmentResponse>(url, {
        timeout: 30000,
      });

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};