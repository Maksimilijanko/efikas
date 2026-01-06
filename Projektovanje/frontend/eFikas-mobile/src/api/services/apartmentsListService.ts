import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ApartmentCurrentInfo } from "@/src/types/types";

export const apartmentsListService = {
  getApartments: async (): Promise<ApartmentCurrentInfo[]> => {
    const response = await axiosInstance.get<ApartmentCurrentInfo[]>(
      API_URLS.apartments.list
    );

    console.log("APARTMENTS FROM BACKEND:", response.data);
    
    return response.data;
  },
};
