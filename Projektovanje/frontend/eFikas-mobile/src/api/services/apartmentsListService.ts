import { ApartmentResponse } from "@/src/types/types";
import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";


export const apartmentsListService = {
  getApartments: async (): Promise<ApartmentResponse[]> => {
    const res = await axiosInstance.get<ApartmentResponse[]>(API_URLS.apartments.list);
    return res.data ?? [];
  },
};
