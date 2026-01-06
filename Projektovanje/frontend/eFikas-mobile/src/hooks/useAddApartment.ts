import { useMutation } from "@tanstack/react-query";
import { addApartmentService } from "@/src/api/services/addApartmentService";
import { CreateApartmentPayload, ApartmentResponse } from "@/src/types/types";

export function useAddApartment() {
  return useMutation<ApartmentResponse, Error, CreateApartmentPayload>({
    mutationFn: (payload) =>
      addApartmentService.createApartment(payload),
  });
}
