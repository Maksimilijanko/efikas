// // import axiosInstance from "../axiosInstance";
// // import { API_URLS } from "@/src/util/apiConstants";
// // import { Reservation } from "@/src/types/types";

// // // Tip koji dolazi sa backend-a
// // interface ApartmentResponse {
// //   apartmentId: number;
// //   name: string,
// //   address: string;
// //   numberOfBeds: number;
// //   numberOfRooms: number;
// //   capacity: number;
// //   pricePerDay: number;
// //   pricePerNight: number;
// //   pictures: string[];
// // }

// // interface ReservationResponse {
// //   reservationId: number;
// //   apartment: ApartmentResponse;
// //   guestFullName: string;
// //   guestPhoneNumber: string;
// //   dateTimeOfArrival: string | Date; // backend vraca Instant, TS ga moze tretirati kao string
// //   dateTimeOfDeparture: string | Date;
// //   guestNumber: number;
// //   price?: number;
// //   note?: string;
// //   personalDocumentURL?: string;
// //   reservationType: string;
// // }

// // // Pomocna funkcija za mapiranje ReservationResponse -> Reservation
// // const mapReservation = (r: ReservationResponse): Reservation => ({
// //   reservationId: r.reservationId,
// //   apartment: {
// //     apartmentId: r.apartment.apartmentId,
// //     name: r.apartment.name,
// //     address: r.apartment.address,
// //     numberOfBeds: r.apartment.numberOfBeds,
// //     numberOfRooms: r.apartment.numberOfRooms,
// //     capacity: r.apartment.capacity,
// //     pricePerDay: r.apartment.pricePerDay,
// //     pricePerNight: r.apartment.pricePerNight,
// //     pictures: r.apartment.pictures ?? [],
// //   },
// //   guestFullName: r.guestFullName,
// //   guestPhoneNumber: r.guestPhoneNumber,
// //   dateTimeOfArrival: new Date(r.dateTimeOfArrival).toISOString(),
// //   dateTimeOfDeparture: new Date(r.dateTimeOfDeparture).toISOString(),
// //   guestNumber: r.guestNumber,
// //   price: r.price ?? null,
// //   note: r.note ?? null,
// //   personalDocumentURL: r.personalDocumentURL ?? null,
// //   reservationType: r.reservationType,
// // });

// // export const reservationService = {
// //   getUserReservations: async (): Promise<Reservation[]> => {
// //     const res = await axiosInstance.get<ReservationResponse[]>(API_URLS.reservations.listUser());
// //     console.log(res.data)
// //     return res.data.map(mapReservation);
// //   },

// //   getReservations: async (apartmentId: number): Promise<Reservation[]> => {
// //     const res = await axiosInstance.get<ReservationResponse[]>(
// //       API_URLS.reservations.listByApartment(apartmentId)
// //     );
// //     return res.data.map(mapReservation);
// //   },

// //   getReservation: async (reservationId: number): Promise<Reservation> => {
// //     const res = await axiosInstance.get<ReservationResponse>(
// //       API_URLS.reservations.getById(reservationId)
// //     );
// //     console.log('DETALJI REZERVACIJE', res.data)
// //     return mapReservation(res.data);
// //   },

// //   createReservation: async (apartmentId: number, data: FormData) => {
// //     const res = await axiosInstance.post(
// //       API_URLS.reservations.create(apartmentId),
// //       data,
// //       { headers: { "Content-Type": "multipart/form-data" } }
// //     );
// //     return mapReservation(res.data);
// //   },

// //   updateReservation: async (reservationId: number, data: FormData) => {
// //     const res = await axiosInstance.put(
// //       API_URLS.reservations.update(reservationId),
// //       data,
// //       { headers: { "Content-Type": "multipart/form-data" } }
// //     );
// //     return mapReservation(res.data);
// //   },

// //   deleteReservation: async (reservationId: number) => {
// //     console.log('BRISANJE REZERVACIJE', reservationId)
// //     const res = await axiosInstance.delete(API_URLS.reservations.delete(reservationId));
// //     return res.data;
// //     // console.log('BRISANJE REZERVACIJE', API_URLS.reservations.delete(reservationId))
// //     // console.log(axiosInstance.delete(API_URLS.reservations.delete(reservationId)));
// //     // return await axiosInstance.delete(API_URLS.reservations.delete(reservationId));
// //   },
// // };

// // import axiosInstance from "../axiosInstance";
// // import { API_URLS } from "@/src/util/apiConstants";
// // import { Reservation } from "@/src/types/types";

// // export const reservationService = {
// //   getUserReservations: async (): Promise<Reservation[]> => {
// //     const res = await axiosInstance.get<Reservation[]>(
// //       API_URLS.reservations.listUser()
// //     );
// //     return res.data;
// //   },

// //   getReservations: async (apartmentId: number): Promise<Reservation[]> => {
// //     const res = await axiosInstance.get<Reservation[]>(
// //       API_URLS.reservations.listByApartment(apartmentId)
// //     );
// //     return res.data;
// //   },

// //   getReservation: async (reservationId: number): Promise<Reservation> => {
// //     const res = await axiosInstance.get<Reservation>(
// //       API_URLS.reservations.getById(reservationId)
// //     );
// //     return res.data;
// //   },

// //   createReservation: async (apartmentId: number, data: FormData): Promise<Reservation> => {
// //     const res = await axiosInstance.post<Reservation>(
// //       API_URLS.reservations.create(apartmentId),
// //       data,
// //       { headers: { "Content-Type": "multipart/form-data" } }
// //     );
// //     return res.data;
// //   },

// //   updateReservation: async (reservationId: number, data: FormData): Promise<Reservation> => {
// //     const res = await axiosInstance.put<Reservation>(
// //       API_URLS.reservations.update(reservationId),
// //       data,
// //       { headers: { "Content-Type": "multipart/form-data" } }
// //     );
// //     return res.data;
// //   },

// //   deleteReservation: async (reservationId: number) => {
// //     const res = await axiosInstance.delete(
// //       API_URLS.reservations.delete(reservationId)
// //     );
// //     return res.data;
// //   },
// // };

// import axiosInstance from "../axiosInstance";
// import { API_URLS } from "@/src/util/apiConstants";
// import { Reservation, CreateReservationPayload, UpdateReservationPayload } from "@/src/types/types";

// export const reservationService = {
//   getUserReservations: async (): Promise<Reservation[]> => {
//     const res = await axiosInstance.get<Reservation[]>(
//       API_URLS.reservations.listUser()
//     );
//     return res.data;
//   },

//   getReservations: async (apartmentId: number): Promise<Reservation[]> => {
//     const res = await axiosInstance.get<Reservation[]>(
//       API_URLS.reservations.listByApartment(apartmentId)
//     );
//     return res.data;
//   },

//   getReservation: async (reservationId: number): Promise<Reservation> => {
//     const res = await axiosInstance.get<Reservation>(
//       API_URLS.reservations.getById(reservationId)
//     );
//     return res.data;
//   },

//   createReservation: async (
//     apartmentId: number,
//     payload: CreateReservationPayload,
//     documentPicture?: { uri: string; type: string; name: string }
//   ): Promise<Reservation> => {

//     if (documentPicture) {
//       // Ako postoji slika, saljemo FormData
//       const formData = new FormData();

//       formData.append("reservation", JSON.stringify({
//         apartmentId,
//         ...payload
//       }));

//       formData.append("picture", {
//         uri: documentPicture.uri,
//         type: documentPicture.type,
//         name: documentPicture.name,
//       } as any);

//       const res = await axiosInstance.post<Reservation>(
//         API_URLS.reservations.create(apartmentId),
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       return res.data;
//     } else {
//       // Ako nema slike, saljemo obican JSON
//       const res = await axiosInstance.post<Reservation>(
//         API_URLS.reservations.create(apartmentId),
//         { apartmentId, ...payload } // samo JSON
//       );
//       return res.data;
//     }
//   },

//   updateReservation: async (
//     reservationId: number,
//     payload: UpdateReservationPayload,
//     documentPicture?: { uri: string; type: string; name: string }
//   ): Promise<Reservation> => {
//     const formData = new FormData();

//     formData.append("reservation", JSON.stringify(payload));

//     if (documentPicture) {
//       formData.append("picture", {
//         uri: documentPicture.uri,
//         type: documentPicture.type,
//         name: documentPicture.name,
//       } as any);
//     }

//     const res = await axiosInstance.put<Reservation>(
//       API_URLS.reservations.update(reservationId),
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );
//     return res.data;
//   },

//   deleteReservation: async (reservationId: number): Promise<Reservation> => {
//     const res = await axiosInstance.delete<Reservation>(
//       API_URLS.reservations.delete(reservationId)
//     );
//     return res.data;
//   },
// };

import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";
import { Reservation, CreateReservationPayload, UpdateReservationPayload } from "@/src/types/types";

export const reservationService = {
  getUserReservations: async (): Promise<Reservation[]> => {
    const res = await axiosInstance.get<Reservation[]>(
      API_URLS.reservations.listUser()
    );
    return res.data;
  },

  getReservations: async (apartmentId: number): Promise<Reservation[]> => {
    const res = await axiosInstance.get<Reservation[]>(
      API_URLS.reservations.listByApartment(apartmentId)
    );
    return res.data;
  },

  getReservation: async (reservationId: number): Promise<Reservation> => {
    const res = await axiosInstance.get<Reservation>(
      API_URLS.reservations.getById(reservationId)
    );
    return res.data;
  },

  createReservation: async (
    apartmentId: number,
    payload: CreateReservationPayload,
    documentPicture?: { uri: string; type: string; name: string }
  ): Promise<Reservation> => {
    // ALWAYS send as FormData because backend expects multipart/form-data
    const formData = new FormData();

    // Add reservation as JSON string
    formData.append("reservation", JSON.stringify({
      apartmentId,
      ...payload
    }));

    // Add picture (backend requires this part)
    if (documentPicture) {
      formData.append("picture", {
        uri: documentPicture.uri,
        type: documentPicture.type,
        name: documentPicture.name,
      } as any);
    } else {
      // If no picture, send an empty blob or handle on backend
      // Backend needs to be updated to make picture optional
      // For now, you must provide a picture or backend needs modification
      formData.append("picture", {
        uri: '',
        type: 'image/jpeg',
        name: 'empty.jpg',
      } as any);
    }

    const res = await axiosInstance.post<Reservation>(
      API_URLS.reservations.create(apartmentId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  },

  updateReservation: async (
    reservationId: number,
    payload: UpdateReservationPayload,
    documentPicture?: { uri: string; type: string; name: string }
  ): Promise<Reservation> => {
    const formData = new FormData();

    formData.append("reservation", JSON.stringify(payload));

    if (documentPicture) {
      formData.append("picture", {
        uri: documentPicture.uri,
        type: documentPicture.type,
        name: documentPicture.name,
      } as any);
    } else {
      // Same issue with update - picture is required
      formData.append("picture", {
        uri: '',
        type: 'image/jpeg',
        name: 'empty.jpg',
      } as any);
    }

    const res = await axiosInstance.put<Reservation>(
      API_URLS.reservations.update(reservationId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  deleteReservation: async (reservationId: number): Promise<Reservation> => {
    const res = await axiosInstance.delete<Reservation>(
      API_URLS.reservations.delete(reservationId)
    );
    return res.data;
  },
};