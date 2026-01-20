import {
  apartmentService,
  ApartmentResponse,
} from "@/src/api/services/apartmentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toastService } from "../services/toastService";

// ------------------- FETCH SVIH APARTMANA -------------------
export const useApartments = () => {
  const { t } = useTranslation();

  return useQuery<ApartmentResponse[], Error>({
    queryKey: ["apartments"],
    queryFn: async () => {
      try {
        const result = await apartmentService.getApartments();
        //console.log("Apartments dobavljeni:", result);
        return result;
      } catch (err: any) {
        console.error("(GRESKA)Nije moguce dobaviti apartmane:", err);
        console.error("Status:", err?.response?.status);
        console.error("Data:", err?.response?.data);

        const errorMessage =
          err?.message || t("apartments.toastMessages.genericError");
        toastService.error(
          t("apartments.toastMessages.fetchErrorTitle"),
          t("apartments.toastMessages.fetchErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
  });
};

// ------------------- FETCH JEDNOG APARTMANA -------------------
export const useApartment = (apartmentId: number) => {
  const { t } = useTranslation();

  return useQuery<ApartmentResponse, Error>({
    queryKey: ["apartment", apartmentId],
    queryFn: async () => {
      try {
        return await apartmentService.getApartment(apartmentId);
      } catch (err: any) {
        const errorMessage =
          err?.message || t("apartments.toastMessages.genericError");
        toastService.error(
          t("apartments.toastMessages.fetchErrorTitle"),
          t("apartments.toastMessages.fetchErrorMessage")
        );
        throw new Error(errorMessage);
      }
    },
    enabled: !!apartmentId,
  });
};
