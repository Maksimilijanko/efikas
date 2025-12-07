import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { CashRegister } from "@/src/types/types";

export interface CreateCashRegisterDTO {
  cashRegisterNumber: number;
  softwareVersion: string;
}

export const cashRegisterService = {
  getAll: async (): Promise<CashRegister[]> => {
    const response = await axiosInstance.get<CashRegister[]>(API_URLS.cashRegisters.list);
    return response.data;
  },

  create: async (dto: CreateCashRegisterDTO): Promise<CashRegister> => {
    const response = await axiosInstance.post<CashRegister>(API_URLS.cashRegisters.create, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_URLS.cashRegisters.delete(id));
  }
};