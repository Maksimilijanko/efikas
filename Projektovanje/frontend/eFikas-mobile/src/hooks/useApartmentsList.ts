import { useQuery } from '@tanstack/react-query';
import { apartmentsListService } from '../api/services/apartmentsListService';

export function useApartmentsList() {
  return useQuery({
    queryKey: ['apartments'],
    queryFn: () => apartmentsListService.getApartments(),
  });
}
