import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import type { ApartmentResponse, AddingApartmentResponse, CreateApartmentPayload } from "@/src/types/types";

export const updateApartmentService = {
  updateApartment: async (
    apartmentId: number,
    payload: CreateApartmentPayload
  ): Promise<ApartmentResponse | AddingApartmentResponse> => {
    const formData = new FormData();

    const apartmentJson = JSON.stringify(payload.apartment);
    formData.append("apartment", { string: apartmentJson, type: "application/json" } as any);

    const localPictures = payload.pictures.filter((p) => {
      const uri = p.uri ?? "";
      return uri.startsWith("file://") || uri.startsWith("content://");
    });

    localPictures.forEach((img, index) => {
      formData.append("pictures", {
        uri: img.uri,
        name: img.name || `image_${index}.jpg`,
        type: img.type || "image/jpeg",
      } as any);
    });

    const res = await axiosInstance.put(
      API_URLS.apartments.update(apartmentId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        timeout: 60000,
        transformRequest: (data) => data,
      }
    );

    return res.data;
  },
};
