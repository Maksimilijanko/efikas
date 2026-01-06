import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { ApartmentResponse, CreateApartmentPayload } from "@/src/types/types";

export const addApartmentService = {
  createApartment: async (payload: CreateApartmentPayload): Promise<ApartmentResponse> => {
    try {
      const formData = new FormData();

      formData.append("apartment", JSON.stringify(payload.apartment));

      payload.pictures?.forEach((image, index) => {
        formData.append("pictures", {
          uri: image.uri,
          name: image.fileName ?? `image_${index}.jpg`,
          type: image.type ?? "image/jpeg",
        } as any);
      });

      const response = await axiosInstance.post<ApartmentResponse>(
        API_URLS.apartments.create,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;

    } catch (e: any) {
      console.log("ADD APARTMENT ERROR", {
        message: e.message,
        status: e.response?.status,
        data: e.response?.data,
      });
      throw e; // ⬅️ OBAVEZNO (da React Query dobije error)
    }
  },
};
