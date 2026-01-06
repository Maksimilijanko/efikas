import axiosInstance from "../axiosInstance";
import { API_URLS } from "@/src/util/apiConstants";

export interface ApartmentDTO {
  name: string;
  address: string;
  numberOfBeds: number;
  numberOfRooms: number;
  capacity: number;
  pricePerNight: number;
  pricePerDay: number;
  traits: Record<string, boolean>;
}

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

//  Dobavljanje svih apartmana trenutnog korisnika
export const apartmentService = {
  getApartments: async (): Promise<ApartmentResponse[]> => {
    const res = await axiosInstance.get<ApartmentResponse[]>(
      API_URLS.apartments.list()
    );
    return res.data;
  },

//  Dobavljanje jednog apartmana po ID-u
  getApartment: async (apartmentId: number): Promise<ApartmentResponse> => {
    const res = await axiosInstance.get<ApartmentResponse>(
      API_URLS.apartments.getById(apartmentId)
    );
    return res.data;
  }
}