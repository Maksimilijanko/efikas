import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateApartmentPayload } from "@/src/types/types";
import { updateApartmentService } from "../api/services/editApartmentService";

export function useUpdateApartment(apartmentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApartmentPayload) =>
      updateApartmentService.updateApartment(apartmentId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.invalidateQueries({ queryKey: ["apartment-details", apartmentId] });
    },
  });
}
