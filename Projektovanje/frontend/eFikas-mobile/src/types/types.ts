import * as LucideIcons from "lucide-react-native";

export type LucideIconName = keyof typeof LucideIcons;

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    surname: string;
    email: string;
    password: string;
    repeatPassword: string;
    jib: string;
}

export interface AuthenticationResponse {
    email: string;
    token: string;
}
export interface StatisticsDataPoint {
  label: string;
  value: number;
}

export interface StatisticsResponse {
  data: StatisticsDataPoint[];
}

export interface Reservation {
  ReservationId: number;
  ApartmentId: number;
  GuestFullName: string;
  GuestPhoneNumber: string;
  DateTimeOfArrival: string;
  DateTimeOfDeparture: string;
  GuestNumber: number;
  Price: number;
  Note: string;
  PersonalDocumentURL: string;
  IdTypeOfReservation: number;
  TypeId: number;
}

export interface DashboardResponse {
  fullName: string;
  statistics: StatisticsResponse;
  reservations: Reservation[];
}

export interface MenuItemProps {
  id: string;
  icon: LucideIconName; 
  text: string;
  onPressMenuItem: () => void;
};

export interface MenuSectionProps {
  title: string;
  items: MenuItemProps[];
};