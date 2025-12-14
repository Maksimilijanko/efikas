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
  inventory: ApartmentInventory; 
}


export type ApartmentInventory = {
    parking: boolean;
    tv: boolean;
    wifi: boolean;
    fen: boolean;
    klima: boolean;
    vesMasina: boolean;
    kafa: boolean;
    balkon: boolean;
};

export type CreateApartmentPayload = {
    name: string;
    address: string;
    noBeds: number;           
    noBedrooms: number;       
    capacity: number;        
    overnightPrice: number;   
    dayPrice: number;        
    images: string[];
    inventory: ApartmentInventory;
};

export type ApartmentResponse = {
    success: boolean;
    message?: string;
    apartmentId?: number;
    data?: any;
};

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
  reservationTypeId?: number;
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
    name: string;
    surname: string;
    jib: string;
    email: string;
}

export interface CashRegister {
  cashRegisterId: number;
  cashRegisterNumber: number;
  softwareVersion: string;
}