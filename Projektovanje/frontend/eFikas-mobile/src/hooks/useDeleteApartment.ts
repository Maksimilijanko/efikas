import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApartmentService } from "@/src/api/services/deleteApartmentService";
import { ApartmentResponse } from "@/src/types/types";

export function useDeleteApartment() {
  const queryClient = useQueryClient();

  return useMutation<ApartmentResponse, Error, number>({
    mutationFn: (apartmentId: number) =>
      deleteApartmentService.deleteApartment(apartmentId),
    
    onSuccess: (data, apartmentId) => {
      queryClient.invalidateQueries({ queryKey: ['apartments'] });
      queryClient.removeQueries({ queryKey: ['apartment', apartmentId] });
    },
  });
}