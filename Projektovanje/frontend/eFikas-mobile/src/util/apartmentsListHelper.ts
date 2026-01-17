import type { ApartmentCurrentInfo, ApartmentResponse, Reservation } from "@/src/types/types";

export function buildApartmentCurrentInfo(
    apartment: ApartmentResponse,
    reservations?: Reservation[],
    now = new Date()
): ApartmentCurrentInfo {
    const imageUrl = apartment.pictures?.[0] ?? "";
    const safeReservations = reservations ?? [];

    const sorted = [...safeReservations].sort(
        (a, b) =>
            new Date(a.dateTimeOfArrival).getTime() -
            new Date(b.dateTimeOfArrival).getTime()
    );

    const active = sorted.find((r) => {
        const start = new Date(r.dateTimeOfArrival);
        const end = new Date(r.dateTimeOfDeparture);
        return start.getTime() <= now.getTime() && now.getTime() < end.getTime();
    });

    const next = sorted.find((r) => new Date(r.dateTimeOfArrival).getTime() > now.getTime());

    return {
        apartmentId: apartment.apartmentId,
        name: apartment.name,
        address: apartment.address,
        imageUrl,
        status: Boolean(active),                    
        statusUntil: active ? active.dateTimeOfDeparture : null,
        nextGuestsDate: next ? next.dateTimeOfArrival : null,    
    };
}
