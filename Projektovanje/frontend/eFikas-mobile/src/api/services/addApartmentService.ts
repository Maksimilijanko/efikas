import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { AddingApartmentResponse, CreateApartmentPayload } from "@/src/types/types";


export const addApartmentService = {
  createApartment: async (payload: CreateApartmentPayload): Promise<AddingApartmentResponse> => {
    try {
      const formData = new FormData();

      const apartmentJson = JSON.stringify(payload.apartment);

      formData.append("apartment", {
        string: apartmentJson,
        type: "application/json"
      } as any);


      payload.pictures.forEach((img, index) => {
        console.log(`📸 Adding image ${index}:`, {
          uri: img.uri.substring(0, 50) + "...",
          name: img.name,
          type: img.type,
        });

        formData.append("pictures", {
          uri: img.uri,
          name: img.name || `image_${index}.jpg`,
          type: img.type || "image/jpeg",
        } as any);
      });

      const response = await axiosInstance.post<AddingApartmentResponse>(
        API_URLS.apartments.create,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 60000,
          transformRequest: (data, headers) => {
            return data;
          },
        }
      );

      return response.data;
    } catch (e: any) {
      throw e;
    }
  },
};