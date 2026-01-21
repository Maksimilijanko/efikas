import { reservationService } from "@/src/api/services/reservationService";
import { Reservation, CreateReservationPayload, UpdateReservationPayload } from "@/src/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toastService } from '../services/toastService';


// ------------------- FETCH SVIH REZERVACIJA -------------------
export const useReservations = (apartmentId: number) => {
  const { t } = useTranslation();

  return useQuery<Reservation[], Error>({
    queryKey: ["reservations", apartmentId],
    queryFn: async () => {
      try {
        return await reservationService.getReservations(apartmentId);
      } catch (err: any) {
        const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
        toastService.error(
          t("reservations.toastMessages.fetchErrorTitle"),
          t("reservations.toastMessages.fetchErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
  });
};

// ------------------- FETCH JEDNE REZERVACIJE -------------------
export const useReservation = (reservationId: number, apartmentId: number) => {
  const { t } = useTranslation();

  return useQuery<Reservation, Error>({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      try {
        return await reservationService.getReservation(reservationId, apartmentId);
      } catch (err: any) {
        const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
        toastService.error(
          t("reservations.toastMessages.fetchErrorTitle"),
          t("reservations.toastMessages.fetchErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
    enabled: !!reservationId,
  });
};

// ------------------- CREATE REZERVACIJE -------------------
export const useCreateReservation = (apartmentId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      documentPicture,
    }: {
      payload: CreateReservationPayload;
      documentPicture?: { uri: string; type: string; name: string };
    }) => {
      try {
        return await reservationService.createReservation(
          apartmentId, 
          payload, 
          documentPicture
        );
      } catch (err: any) {
        console.log("=== HOOK ERROR ===", err);
		
		console.log("message:", err.message);
		console.log("status:", err.response?.status);
		console.log("data:", err.response?.data);
		console.log("headers:", err.response?.headers);

		if(err.response?.status === 409) {
			toastService.error(
				t("reservations.toastMessages.create409Title"),
				t("reservations.toastMessages.create409Message")
			);
			const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
			throw new Error(errorMessage);
		}


        const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
        toastService.error(
          t("reservations.toastMessages.createErrorTitle"),
          t("reservations.toastMessages.createErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["reservations", apartmentId],
      });
    
      await queryClient.invalidateQueries({
        queryKey: ["userReservations"],
      });
    
      toastService.success(
        t("reservations.toastMessages.createSuccessTitle"),
        t("reservations.toastMessages.createSuccessMessage")
      );
    },
  });
};

// ------------------- UPDATE REZERVACIJE -------------------
export const useUpdateReservation = (reservationId: number, apartmentId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      payload,
      documentPicture,
    }: {
      payload: UpdateReservationPayload;
      documentPicture?: { uri: string; type: string; name: string };
    }) => {
      try {
        return await reservationService.updateReservation(
          reservationId, 
          payload, 
          documentPicture
        );
      } catch (err: any) {
        const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
        toastService.error(
          t("reservations.toastMessages.updateErrorTitle"),
          t("reservations.toastMessages.updateErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservation", reservationId] });
      queryClient.invalidateQueries({ queryKey: ["reservations", apartmentId] });
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
      toastService.success(
        t("reservations.toastMessages.updateSuccessTitle"),
        t("reservations.toastMessages.updateSuccessMessage")
      );
    },
  });
};

// ------------------- DELETE REZERVACIJE -------------------
export const useDeleteReservation = (reservationId: number, apartmentId: number) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log("Brisanje rezervacije - hook:", reservationId);
        return await reservationService.deleteReservation(reservationId);
      } catch (err: any) {
        const errorMessage =
          err?.message || t("reservations.toastMessages.genericError");
        toastService.error(
          t("reservations.toastMessages.deleteErrorTitle"),
          t("reservations.toastMessages.deleteErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations", apartmentId] });
      queryClient.invalidateQueries({ queryKey: ["userReservations"] });
      toastService.success(
        t("reservations.toastMessages.deleteSuccessTitle"),
        t("reservations.toastMessages.deleteSuccessMessage")
      );
    },
  });
};
