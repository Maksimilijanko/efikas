import { ApartmentResponse, CreateApartmentPayload } from "@/src/types/types";

export const addApartmentService = {
    createApartment: async (payload: CreateApartmentPayload): Promise<ApartmentResponse> => {
        console.log("📤 Slanje podataka:", payload);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Spremni ste za prve goste.",
                    apartmentId: Math.floor(Math.random() * 1000),
                    data: payload,
                });
            }, 1000);
        });
    },
};
