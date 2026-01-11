import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addApartmentService } from "@/src/api/services/addApartmentService";
import { CreateApartmentPayload, AddingApartmentResponse } from "@/src/types/types";

export function useAddApartment() {
  const queryClient = useQueryClient();

  return useMutation<AddingApartmentResponse, Error, CreateApartmentPayload>({
    mutationFn: (payload) => addApartmentService.createApartment(payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
    },
  });
}