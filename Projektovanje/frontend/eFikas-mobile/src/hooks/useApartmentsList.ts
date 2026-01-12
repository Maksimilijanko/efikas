import { useQuery, useQueries } from "@tanstack/react-query";
import { apartmentsListService } from "@/src/api/services/apartmentsListService";
import { reservationService } from "@/src/api/services/reservationService";
import type { ApartmentCurrentInfo } from "@/src/types/types";
import { buildApartmentCurrentInfo } from "../util/apartmentsListHelper";

export function useApartmentsList() {
  const apartmentsQuery = useQuery({
    queryKey: ["apartments"],
    queryFn: apartmentsListService.getApartments,
  });

  const reservationsQueries = useQueries({
    queries:
      apartmentsQuery.data?.map((apt) => ({
        queryKey: ["reservations", apt.apartmentId],
        queryFn: () => reservationService.getReservations(apt.apartmentId),
        enabled: !!apartmentsQuery.data,
        staleTime: 30_000,
      })) ?? [],
  });

  const data: ApartmentCurrentInfo[] | undefined = apartmentsQuery.data?.map((apt, idx) => {
    const reservations = reservationsQueries[idx]?.data;
    return buildApartmentCurrentInfo(apt, reservations);
  });

  const isLoading =
    apartmentsQuery.isLoading ||
    (apartmentsQuery.data?.length ? reservationsQueries.some((q) => q.isLoading) : false);

  const error =
    apartmentsQuery.error ||
    reservationsQueries.find((q) => q.error)?.error ||
    null;

  return { data, isLoading, error };
}
