import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { Reservation } from "@/src/types/types";

// Tip koji dolazi sa backend-a
interface ApartmentResponse {
  apartmentId: number;
  name: string,
  address: string;
  numberOfBeds: number;
  numberOfRooms: number;
  capacity: number;
  pricePerDay: number;
  pricePerNight: number;
  pictures: string[];
}

interface ReservationResponse {
  reservationId: number;
  apartment: ApartmentResponse;
  guestFullName: string;
  guestPhoneNumber: string;
  dateTimeOfArrival: string | Date; // backend vraca Instant, TS ga moze tretirati kao string
  dateTimeOfDeparture: string | Date;
  guestNumber: number;
  price?: number;
  note?: string;
  personalDocumentURL?: string;
  reservationType: string;
}

// Pomocna funkcija za mapiranje ReservationResponse → Reservation
const mapReservation = (r: ReservationResponse): Reservation => ({
  reservationId: r.reservationId,
  apartment: {
    apartmentId: r.apartment.apartmentId,
    name: r.apartment.name,
    address: r.apartment.address,
    numberOfBeds: r.apartment.numberOfBeds,
    numberOfRooms: r.apartment.numberOfRooms,
    capacity: r.apartment.capacity,
    pricePerDay: r.apartment.pricePerDay,
    pricePerNight: r.apartment.pricePerNight,
    pictures: r.apartment.pictures ?? [],
  },
  guestFullName: r.guestFullName,
  guestPhoneNumber: r.guestPhoneNumber,
  dateTimeOfArrival: new Date(r.dateTimeOfArrival).toISOString(),
  dateTimeOfDeparture: new Date(r.dateTimeOfDeparture).toISOString(),
  guestNumber: r.guestNumber,
  price: r.price ?? null,
  note: r.note ?? null,
  personalDocumentURL: r.personalDocumentURL ?? null,
  reservationType: r.reservationType,
});

export const reservationService = {
  getUserReservations: async (): Promise<Reservation[]> => {
    const res = await axiosInstance.get<ReservationResponse[]>(API_URLS.reservations.listUser());
    console.log(res.data)
    return res.data.map(mapReservation);
  },

  getReservations: async (apartmentId: number): Promise<Reservation[]> => {
    const res = await axiosInstance.get<ReservationResponse[]>(
      API_URLS.reservations.listByApartment(apartmentId)
    );
    return res.data.map(mapReservation);
  },

  getReservation: async (reservationId: number): Promise<Reservation> => {
    const res = await axiosInstance.get<ReservationResponse>(
      API_URLS.reservations.getById(reservationId)
    );
    console.log('DETALJI REZERVACIJE', res.data)
    return mapReservation(res.data);
  },

  createReservation: async (apartmentId: number, data: FormData) => {
    const res = await axiosInstance.post(
      API_URLS.reservations.create(apartmentId),
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return mapReservation(res.data);
  },

  updateReservation: async (reservationId: number, data: FormData) => {
    const res = await axiosInstance.put(
      API_URLS.reservations.update(reservationId),
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return mapReservation(res.data);
  },

  deleteReservation: async (reservationId: number) => {
    const res = await axiosInstance.delete(API_URLS.reservations.delete(reservationId));
    return res.data;
  },
};