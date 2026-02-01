import { reservationService } from "@/src/api/services/reservationService";
import type { ApartmentResponse, Reservation } from "@/src/types/types";
import type { QueryClient } from "@tanstack/react-query";

type ServiceItem = { name: string };

export type ApartmentDetailsVM = {
  id: number;
  title: string;
  address: string;
  heroImageUrl: string;

  beds: number;      // = numberOfBeds
  bedrooms: number;  // = numberOfRooms 
  maxGuests: number;     // = capacity 

  tags: string[];
  services: ServiceItem[];

  galleryImages: string[];
  availability: Reservation[];
};

function traitsToServices(traits?: Record<string, boolean>): ServiceItem[] {
  if (!traits) return [];

  const map: Record<string, string> = {
    wifi: "WiFi",
    parking: "Parking",
    klima: "AC",
    tv: "TV",
    kafa: "Kitchen",
    vesMasina: "Washing Machine",
    fen: "Hair Dryer",
    balkon: "Balcony",
  };

  return Object.entries(traits)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => ({ name: map[key] ?? key }));
}

function traitsToTags(traits?: Record<string, boolean>): string[] {
  return traitsToServices(traits).map((s) => s.name);
}


export const apartmentDetailsService = {
  getApartmentDetailsFromCacheAndReservations: async (
    queryClient: QueryClient,
    apartmentId: number
  ): Promise<ApartmentDetailsVM> => {
    const apartments = queryClient.getQueryData<ApartmentResponse[]>(["apartments"]) ?? [];

    const apartment = apartments.find((a) => a.apartmentId === apartmentId);
    if (!apartment) {
      throw new Error("Apartment not found in cache. Please go back to list and try again.");
    }

    const availability = await reservationService.getReservations(apartmentId);

    const galleryImages = apartment.pictures ?? [];
    const heroImageUrl = galleryImages[0] ?? "https://picsum.photos/900/600";

    const services = traitsToServices(apartment.traits);
    const tags = traitsToTags(apartment.traits);

    return {
      id: apartment.apartmentId,
      title: apartment.name,
      address: apartment.address,
      heroImageUrl,

      beds: apartment.numberOfBeds ?? 0,
      bedrooms: apartment.numberOfRooms ?? 0,
      maxGuests: apartment.capacity ?? 0,

      tags,
      services,

      galleryImages,
      availability,
    };
  },
};
