import { useQuery } from "@tanstack/react-query";
import { reservationService } from "@/src/api/services/reservationService";
import { toastService } from '../services/toastService';
import { useTranslation } from "react-i18next";
import { Reservation } from "@/src/types/types";

export const useUserReservations = () => {
  const { t } = useTranslation();

  const query = useQuery<Reservation[], Error>({
    queryKey: ["userReservations"],
    queryFn: async () => {
      try {
        return await reservationService.getUserReservations();
      } catch (err: any) {
        toastService.error(
          t("reservations.toastMessages.fetchErrorTitle"),
          t("reservations.toastMessages.fetchErrorMessage")
        );
        throw new Error(err.message || t("reservations.toastMessages.genericError"));
      }
    },
  });

  return query;
};
