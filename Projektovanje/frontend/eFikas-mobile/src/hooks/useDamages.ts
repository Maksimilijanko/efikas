import { useQuery } from '@tanstack/react-query';
import { damageService } from '../api/services/damageService';
import { ApartmentDamageDTO } from '../types/types';

export function useDamages(apartmentId: number | undefined) {
  return useQuery<ApartmentDamageDTO[]>({
    queryKey: ['damages', apartmentId],
    queryFn: () => damageService.getByApartment(apartmentId!),
    enabled: !!apartmentId, 
  });
}