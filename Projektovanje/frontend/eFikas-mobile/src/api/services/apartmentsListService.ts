import { ApartmentCurrentInfo } from "@/src/types/types";

export interface ApartmentResponse {
  apartmentId: number;
  name: string;
  address: string;
  numberOfBeds: number;
  numberOfRooms: number;
  capacity: number;
  pricePerDay: number;
  pricePerNight: number;
  pictures: string[];
  traits: Record<string, boolean>;
}

export interface ReservationResponse {
  reservationId: number;
  apartment: ApartmentResponse;
  guestFullName: string;
  guestPhoneNumber: string;
  dateTimeOfArrival: string; 
  dateTimeOfDeparture: string; 
  guestNumber: number;
  price: number;
  note: string;
  personalDocumentURL: string;
  reservationType: string;
}


//HELPER FUNCTIONS
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}.`;
};

const isApartmentOccupied = (
  now: Date,
  reservations: ReservationResponse[]
): {
  isOccupied: boolean;
  occupiedUntil: Date | null;
} => {
  for (const reservation of reservations) {
    const arrival = new Date(reservation.dateTimeOfArrival);
    const departure = new Date(reservation.dateTimeOfDeparture);

    if (now >= arrival && now < departure) {
      return { isOccupied: true, occupiedUntil: departure };
    }
  }

  return { isOccupied: false, occupiedUntil: null };
};

const getNextReservation = (
  now: Date,
  reservations: ReservationResponse[]
): ReservationResponse | null => {
  const futureReservations = reservations
    .filter((r) => new Date(r.dateTimeOfArrival) > now)
    .sort(
      (a, b) =>
        new Date(a.dateTimeOfArrival).getTime() -
        new Date(b.dateTimeOfArrival).getTime()
    );

  return futureReservations.length > 0 ? futureReservations[0] : null;
};

const convertApartmentToCurrentInfo = (
  apartment: ApartmentResponse,
  reservations: ReservationResponse[]
): ApartmentCurrentInfo => {
  const now = new Date();

  const { isOccupied, occupiedUntil } = isApartmentOccupied(now, reservations);
  const nextReservation = getNextReservation(now, reservations);

  return {
    id: apartment.apartmentId,
    name: apartment.name,
    address: apartment.address,
    imageUrl: apartment.pictures[0] || 'https://picsum.photos/600/400',
    status: isOccupied,
    statusUntil: occupiedUntil ? formatDate(occupiedUntil.toISOString()) : null,
    nextGuestsDate: nextReservation
      ? formatDate(nextReservation.dateTimeOfArrival)
      : null,
  };
};

// Mockup apartmani
const MOCK_APARTMENTS: ApartmentResponse[] = [
  {
    apartmentId: 1,
    name: 'Modern Loft',
    address: 'Ulica kralja Petra I Karadjordjevica 73',
    numberOfBeds: 2,
    numberOfRooms: 1,
    capacity: 4,
    pricePerDay: 80,
    pricePerNight: 120,
    pictures: ['https://picsum.photos/id/1018/600/400'],
    traits: {
      parking: true,
      wifi: true,
      klima: true,
      tv: true,
      kafa: true,
      vesMasina: false,
      fen: true,
      balkon: false,
    },
  },
  {
    apartmentId: 2,
    name: 'Cozy Studio',
    address: 'Ulica Veselina Maslese 18',
    numberOfBeds: 1,
    numberOfRooms: 1,
    capacity: 2,
    pricePerDay: 50,
    pricePerNight: 80,
    pictures: ['https://picsum.photos/id/1025/600/400'],
    traits: {
      parking: false,
      wifi: true,
      klima: false,
      tv: true,
      kafa: true,
      vesMasina: true,
      fen: false,
      balkon: true,
    },
  },
  {
    apartmentId: 3,
    name: 'Family Apartment',
    address: 'Ulica Aleja Svetog Save 5',
    numberOfBeds: 3,
    numberOfRooms: 2,
    capacity: 6,
    pricePerDay: 100,
    pricePerNight: 150,
    pictures: ['https://picsum.photos/id/1035/600/400'],
    traits: {
      parking: true,
      wifi: true,
      klima: true,
      tv: true,
      kafa: true,
      vesMasina: true,
      fen: true,
      balkon: true,
    },
  },
];

// Mockup rezervacije za sve apartmane
const MOCK_RESERVATIONS: ReservationResponse[] = [
  // Rezervacije za apartman 1 (Modern Loft)
  {
    reservationId: 1,
    apartment: MOCK_APARTMENTS[0],
    guestFullName: 'Marko Marković',
    guestPhoneNumber: '+387 61 123 4567',
    dateTimeOfArrival: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dateTimeOfDeparture: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    guestNumber: 2,
    price: 1200,
    note: 'Rezervacija je potvrđena',
    personalDocumentURL: 'https://example.com/doc1.pdf',
    reservationType: 'Overnight',
  },
  {
    reservationId: 2,
    apartment: MOCK_APARTMENTS[0],
    guestFullName: 'Ana Anić',
    guestPhoneNumber: '+387 65 987 6543',
    dateTimeOfArrival: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    dateTimeOfDeparture: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    guestNumber: 3,
    price: 600,
    note: 'Dolazak oko 15:00',
    personalDocumentURL: 'https://example.com/doc2.pdf',
    reservationType: 'Day',
  },

  // Rezervacije za apartman 2 (Cozy Studio)
  {
    reservationId: 3,
    apartment: MOCK_APARTMENTS[1],
    guestFullName: 'Jovan Jovanović',
    guestPhoneNumber: '+387 62 555 6666',
    dateTimeOfArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    dateTimeOfDeparture: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    guestNumber: 2,
    price: 320,
    note: 'Bez posebnih zahteva',
    personalDocumentURL: 'https://example.com/doc3.pdf',
    reservationType: 'Overnight',
  },

  // Rezervacije za apartman 3 (Family Apartment)
  {
    reservationId: 4,
    apartment: MOCK_APARTMENTS[2],
    guestFullName: 'Milena Milenković',
    guestPhoneNumber: '+387 64 777 8888',
    dateTimeOfArrival: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dateTimeOfDeparture: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    guestNumber: 4,
    price: 800,
    note: 'Gosti su već otišli',
    personalDocumentURL: 'https://example.com/doc4.pdf',
    reservationType: 'Overnight',
  },
  {
    reservationId: 5,
    apartment: MOCK_APARTMENTS[2],
    guestFullName: 'Petar Petrović',
    guestPhoneNumber: '+387 63 999 0000',
    dateTimeOfArrival: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    dateTimeOfDeparture: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    guestNumber: 5,
    price: 450,
    note: 'Ima kućnog ljubimca',
    personalDocumentURL: 'https://example.com/doc5.pdf',
    reservationType: 'Day',
  },
];

export const apartmentsListService = {
  getApartments: async (): Promise<ApartmentCurrentInfo[]> => {
    try {
      // Za sada koristi mockup podatke
      return MOCK_APARTMENTS.map((apartment) => {
        const apartmentReservations = MOCK_RESERVATIONS.filter(
          (r) => r.apartment.apartmentId === apartment.apartmentId
        );
        return convertApartmentToCurrentInfo(apartment, apartmentReservations);
      });
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  },
};