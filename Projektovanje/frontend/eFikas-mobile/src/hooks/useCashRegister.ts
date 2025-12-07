import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cashRegisterService,
  CreateCashRegisterDTO,
} from "@/src/api/services/cashRegisterService";
import { CashRegister } from "@/src/types/types";
import { toastService } from "../services/toastService";
import { useTranslation } from "react-i18next";

const QUERY_KEY = ["cashRegisters"];

export const useCashRegisters = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: cashRegisters,
    isLoading: isLoadingCashRegisters,
    isError,
    error,
    refetch: fetchCashRegisters,
  } = useQuery<CashRegister[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      try {
        return await cashRegisterService.getAll();
      } catch (err: any) {
        const msg = err?.message ?? t("cashRegisters.toastMessages.fetchError");
        toastService.error(
          t("cashRegisters.toastMessages.fetchErrorTitle"),
          msg
        );
        throw err;
      }
    },
  });

  const { mutateAsync: addCashRegister, isPending: isAdding } = useMutation({
    mutationFn: async (dto: CreateCashRegisterDTO) => {
      try {
        return await cashRegisterService.create(dto);
      } catch (err: any) {
        const msg =
          err?.message ?? t("cashRegisters.toastMessages.createError");
        toastService.error(
          t("cashRegisters.toastMessages.createErrorTitle"),
          msg
        );
        throw err;
      }
    },
    onSuccess: (newRegister: CashRegister) => {
      queryClient.setQueryData<CashRegister[] | undefined>(QUERY_KEY, (old) => {
        if (!old) return [newRegister];
        return [...old, newRegister];
      });
    },
  });

  return {
    cashRegisters: cashRegisters ?? [],
    isLoadingCashRegisters,
    isAdding,
    isError,
    error: (error as Error)?.message ?? null,
    fetchCashRegisters,
    addCashRegister,
  };
};
