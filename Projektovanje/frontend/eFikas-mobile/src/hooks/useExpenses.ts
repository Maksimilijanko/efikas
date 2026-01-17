import { useQuery } from '@tanstack/react-query';
import { expenseService } from '../api/services/expenseService';
import { ApartmentExpenseDTO } from '../types/types';

export function useExpenses(apartmentId: number | undefined) {
  return useQuery<ApartmentExpenseDTO[]>({
    queryKey: ['expenses', apartmentId],
    queryFn: () => expenseService.getByApartment(apartmentId!),
    enabled: !!apartmentId,
  });
}