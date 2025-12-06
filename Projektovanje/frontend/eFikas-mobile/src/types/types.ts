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

export interface Apartment {
  apartmentId: number;
  name: string;
  address: string;
  numberOfBeds: number;
  numberOfRooms: number;
  capacity: number;
  pricePerDay: number;
  pricePerNight: number;
  pictures: string[]; 
}

export interface ApartmentCurrentInfo {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    status: boolean;
    statusUntil: string | null;
    nextGuestsDate: string | null;
}

export interface Reservation {
  reservationId: number;
  apartment: Apartment; 
  guestFullName: string;
  guestPhoneNumber: string;
  dateTimeOfArrival: string;
  dateTimeOfDeparture: string;
  guestNumber: number;
  price: number | null;
  note: string | null;
  personalDocumentURL: string | null;
  reservationType: string;
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

export interface ProfileData {
    firstName: string;
    lastName: string;
    taxId: string;
    registerNumber: string;
    softwareVersion: string;
}