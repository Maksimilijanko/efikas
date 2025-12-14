import { Reservation } from "@/src/types/types";

const MOCK_APARTMENT_DETAILS = {
  id: 1,
  title: "Modern Loft – Banja Luka",
  address: "Ulica kralja Petra I Karađorđevića 73",
  heroImageUrl: "https://picsum.photos/id/1018/900/600",

  bedrooms: 4,
  squareMeters: 150,
  maxGuests: 8,

  tags: ["WiFi", "Parking", "Klima", "TV"],

  services: [
  { name: "WiFi" },
  { name: "Parking" },
  { name: "AC" },
  { name: "TV" },
  { name: "Kitchen" },
  { name: "Washing Machine" },
  { name: "Hair Dryer" },
  { name: "Balcony" },
],

  galleryImages: [
    "https://picsum.photos/id/1068/800/600",
    "https://picsum.photos/id/1070/800/600",
    "https://picsum.photos/id/1084/800/600",
    "https://picsum.photos/id/1080/800/600",
    "https://picsum.photos/id/1074/800/600",
    "https://picsum.photos/id/1062/800/600"
  ],

  availability: [] as Reservation[]
};


export const apartmentDetailsService = {
  getApartmentDetails: async (id: number) => {
    return {
      ...MOCK_APARTMENT_DETAILS,
      id 
    };
  }
};
