import axiosInstance from "@/src/api/axiosInstance";
import { DashboardResponse, Reservation } from "@/src/types/types";

// ---- MOCK PODACI ----
export const dashboardService = {
  getDashboardData: async (): Promise<DashboardResponse> => {
    return {
      fullName: "Marko Marković",

      statistics: {
        data: [
          { label: "Jan", value: 150 },
          { label: "Feb", value: 260 },
          { label: "Mar", value: 489 },
          { label: "Apr", value: 420 },
          { label: "Maj", value: 120 },
          { label: "Jun", value: 230 },
          { label: "Jul", value: 180 },
          { label: "Avg", value: 180 },
          { label: "Sep", value: 120 },
          { label: "Okt", value: 220 },
          { label: "Nov", value: 180 },
          { label: "Dec", value: 480 },
        ],
      },

      reservations: testReservations,
    };
  },
};

const testReservations: Reservation[] = [
  {
    ReservationId: 1,
    ApartmentId: 1,
    GuestFullName: "Marko Markovic",
    GuestPhoneNumber: "066066066",
    DateTimeOfArrival: "2025-11-03 13:00:00",
    DateTimeOfDeparture: "2025-11-06 22:00:00",
    GuestNumber: 3,
    Price: 123.5,
    Note: "",
    PersonalDocumentURL: "url",
    IdTypeOfReservation: 1,
    TypeId: 2,
  },
  {
    ReservationId: 2,
    ApartmentId: 2,
    GuestFullName: "Janko Jankovic",
    GuestPhoneNumber: "066066066",
    DateTimeOfArrival: "2025-11-06 12:00:00",
    DateTimeOfDeparture: "2025-11-08 12:00:00",
    GuestNumber: 3,
    Price: 60,
    Note: "",
    PersonalDocumentURL: "url",
    IdTypeOfReservation: 1,
    TypeId: 2,
  },
  {
    ReservationId: 3,
    ApartmentId: 1,
    GuestFullName: "Simo Simic",
    GuestPhoneNumber: "066066066",
    DateTimeOfArrival: "2025-11-01 12:00:00",
    DateTimeOfDeparture: "2025-11-02 00:00:00",
    GuestNumber: 3,
    Price: 50,
    Note: "",
    PersonalDocumentURL: "url",
    IdTypeOfReservation: 1,
    TypeId: 2,
  },
  {
    ReservationId: 4,
    ApartmentId: 1,
    GuestFullName: "Pero Simic",
    GuestPhoneNumber: "066066066",
    DateTimeOfArrival: "2025-11-18 12:00:00",
    DateTimeOfDeparture: "2025-11-19 00:00:00",
    GuestNumber: 3,
    Price: 50,
    Note: "",
    PersonalDocumentURL: "url",
    IdTypeOfReservation: 1,
    TypeId: 2,
  },
];
