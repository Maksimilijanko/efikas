import * as LucideIcons from "lucide-react-native";

export type LucideIconName = keyof typeof LucideIcons;

export type BookkeepingMode = "yearly" | "custom";

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
    jmbg: string;
    address: string;
	phoneNumber: string;
}

export interface AuthenticationResponse {
  email: string;
  token: string;
}

export interface OtpSendRequest {
	email: string;
}

export interface OtpVerifyRequest {
	email: string;
	otp: string;
}

export interface ResetPasswordRequest {
	email: string;
	newPassword: string;
	confirmPassword: string;
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
  apartment: {
    name: string;
    address: string;
    numberOfBeds: number;
    numberOfRooms: number;
    capacity: number;
    pricePerNight: number;
    pricePerDay: number;
    traits: Record<string, boolean>;
  };
  pictures: {
    uri: string;
    name: string;   
    type: string;   
  }[];
};

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
  traits?: Record<string, boolean>;
}

export type AddingApartmentResponse = {
  success: boolean;
  message?: string;
  apartmentId?: number;
  data?: any;
};

export interface ApartmentCurrentInfo {
  apartmentId: number;
  name: string;
  address: string;
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
  reservationTypeId?: number;
}

export interface MenuItemProps {
  id: string;
  icon: LucideIconName;
  text: string;
  onPressMenuItem: () => void;
}

export interface MenuSectionProps {
  title: string;
  items: MenuItemProps[];
}

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

// ================ Book DTOs ===================
export type PdfResult = {
  uri: string;
};

export interface DateRangeDTO {
  from: string | null;
  to: string | null;
}

export interface DownloadIncomeBookRequest {
  taxpayerId: number;
  storeId: number;
  period: DateRangeDTO;
}

export interface GuestsBookRequest {
  period: DateRangeDTO;
  active: boolean;
}

export interface BookPath {
    displayName: string;
    path: string;
}

export interface StoreDTO {
	name: string;
	address: string;
	activity: string;
	activityCode: string;
	jib: string;
}

// ================ Notification ===================
export interface PushNotificationTokenRequest {
    token: string;
	platform: 'android' | 'ios';
    email: string;
}

export interface ToggleNotificationRequest {
    pushToken: string;
	enabled: boolean;
}

export interface ApartmentDamageDTO {
    name: string;        
    damagePrice: number; 
    note: string;       
    status: boolean;     
}


export interface ApartmentTaskDTO {
    name: string;
    note: string;
    status: boolean;
    dateTime: string; 
}

export interface ApartmentTaskResponse {
    apartmentId: number;
    name: string;
    note: string;
    status: boolean;
    dateTime: string;
}

export interface ApartmentExpenseDTO {
    name: string;      
    amount: number;    
    note: string;     
    status: boolean;  
    expenseType: string; 
}

export interface ApartmentExpenseResponse extends ApartmentExpenseDTO {
    apartmentId: number;
}

export interface FiscalConfig {
  ipAddress: string;
  apiKey: string;
  cashierName: string;
}

export interface FiscalItem {
  name: string;
  gtin: string;
  taxLabel: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

export interface PaymentAmounts {
  cash?: number;
  card?: number;
  check?: number;
  wireTransfer?: number;
}

export interface PaymentMethodApi {
  amount: string;
  paymentType: "Cash" | "Card" | "Check" | "WireTransfer";
}

export interface FiscalResponse {
  invoiceNumber: string;
  sdcDateTime: string;
  tin: string;
  invoiceCounter?: string;
  mrc?: string;
}
