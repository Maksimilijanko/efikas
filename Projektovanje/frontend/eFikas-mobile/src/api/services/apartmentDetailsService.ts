// src/services/apartmentDetailsService.ts

export const apartmentDetailsService = {
  getApartmentDetails: async (id: number) => {
    return {
      id,
      title: "Modern Loft – Banja Luka",
      address: "Ulica kralja Petra I Karađorđevića 73",
      heroImageUrl: "https://picsum.photos/id/1018/900/600",

      tags: ["WiFi", "Parking", "Klima", "TV"],

      services: [
        { icon: "Wifi", label: "WiFi" },
        { icon: "Car", label: "Parking" },
        { icon: "Snowflake", label: "Klima" },
        { icon: "Tv", label: "Smart TV" },
        { icon: "CookingPot", label: "Kuhinja" },
        { icon: "Bath", label: "Kupatilo" }
      ],

      galleryImages: [
        "https://picsum.photos/id/1025/600/400",
        "https://picsum.photos/id/1035/600/400",
        "https://picsum.photos/id/1041/600/400",
        "https://picsum.photos/id/1043/600/400"
      ],

      availability: {
        reservedDates: ["2025-02-10", "2025-02-11", "2025-02-12"]
      }
    };
  }
};
