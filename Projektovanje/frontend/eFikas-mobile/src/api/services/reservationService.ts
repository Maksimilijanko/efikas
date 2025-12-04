// import axiosInstance from "../axiosInstance";
// import { API_URLS } from "@/src/util/apiConstants";
// import { Reservation } from "@/src/types/types";

// export const reservationService = {
//     getUserReservations: async (): Promise<Reservation[]> => {
//         const res = await axiosInstance.get(API_URLS.reservations.listUser());
//         return res.data;
//     },

//     getReservations: async (apartmentId: number): Promise<Reservation[]> => {
//         const res = await axiosInstance.get(
//             API_URLS.reservations.listByApartment(apartmentId)
//         );
//         return res.data;
//     },

//     getReservation: async (reservationId: number): Promise<Reservation> => {
//         const res = await axiosInstance.get(
//             API_URLS.reservations.getById(reservationId)
//         );
//         return res.data;
//     },

//     createReservation: async (apartmentId: number, data: FormData) => {
//         const res = await axiosInstance.post(
//             API_URLS.reservations.create(apartmentId),
//             data,
//             {
//                 headers: { "Content-Type": "multipart/form-data" },
//             }
//         );
//         return res.data;
//     },

//     updateReservation: async (reservationId: number, data: FormData) => {
//         const res = await axiosInstance.put(
//             API_URLS.reservations.update(reservationId),
//             data,
//             {
//                 headers: { "Content-Type": "multipart/form-data" },
//             }
//         );
//         return res.data;
//     },

//     deleteReservation: async (reservationId: number) => {
//         const res = await axiosInstance.delete(
//             API_URLS.reservations.delete(reservationId)
//         );
//         return res.data;
//     },
// };










import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { Reservation } from "@/src/types/types";

// Tip koji dolazi sa backend-a
interface ApartmentResponse {
  apartmentId: number;
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
  dateTimeOfArrival: string | Date; // backend vraća Instant, TS ga može tretirati kao string
  dateTimeOfDeparture: string | Date;
  guestNumber: number;
  price?: number;
  note?: string;
  personalDocumentURL?: string;
  reservationType: string;
}

// Pomoćna funkcija za mapiranje ReservationResponse → Reservation
const mapReservation = (r: ReservationResponse): Reservation => ({
  reservationId: r.reservationId,
  apartment: {
    apartmentId: r.apartment.apartmentId,
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










// // MOCK podaci - mada sam izmjenila da postoji apartmentId da ne pisem sve za Apartment
// import { Reservation } from "@/src/types/types";

// const mockReservations: Reservation[] = [
//   {
//    reservationId: 3,
//     apartmentId: 2,
//     guestFullName: "Simo Simic",
//     guestPhoneNumber: "066066066",
//     dateTimeOfArrival: "2025-11-01 12:00:00",
//     dateTimeOfDeparture: "2025-11-02 00:00:00",
//     guestNumber: 3,
//     price: 50,
//     note: "",
//     personalDocumentURL: "url",
//     reservationType: "dan",
//   },
//   {
//     reservationId: 3,
//     apartmentId: 2,
//     guestFullName: "Simo Simic",
//     guestPhoneNumber: "066066066",
//     dateTimeOfArrival: "2025-11-01 12:00:00",
//     dateTimeOfDeparture: "2025-11-02 00:00:00",
//     guestNumber: 3,
//     price: 50,
//     note: "",
//     personalDocumentURL: "url",
//     reservationType: "dan",
//   },
//   {
//     reservationId: 3,
//     apartmentId: 2,
//     guestFullName: "Simo Simic",
//     guestPhoneNumber: "066066066",
//     dateTimeOfArrival: "2025-11-01 12:00:00",
//     dateTimeOfDeparture: "2025-11-02 00:00:00",
//     guestNumber: 3,
//     price: 50,
//     note: "",
//     personalDocumentURL: "url",
//     reservationType: "dan",
//   },
// ];

// export const reservationService = {
//   getUserReservations: async (): Promise<Reservation[]> => {
//     // MOCK
//     return mockReservations;

//     // API verzija:
//     // const res = await axiosInstance.get(API_URLS.reservations.listUser());
//     // return res.data;
//   },

  
// };
