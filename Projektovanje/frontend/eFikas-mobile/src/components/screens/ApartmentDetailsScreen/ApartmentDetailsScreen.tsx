import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";

import LandingApartmentInfo from "@/src/components/organisms/LandingApartmentInfo/LandingApartmentInfo";
import ApartmentDetailsTemplate from "../../templates/ApartmentDetailsTemplate/ApartmentDetailsTemplate";
import { apartmentDetailsService } from "@/src/api/services/apartmentDetailsService";
import { Gallery } from "../../organisms/Gallery/Gallery";
import { ReservationsCalendar } from "../../atoms/ReservationsCalendar/ReservationsCalendar";
import { Label } from "../../atoms/Label/Label";
import { Colors } from "@/src/styles/style";

export default function ApartmentScreen() {

  const {
    data: apartment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["apartment-details", 1],
    queryFn: () => apartmentDetailsService.getApartmentDetails(1),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const servicesProps = {
    wifi: apartment.services.some((s) => s.name === "WiFi"),
    parking: apartment.services.some((s) => s.name === "Parking"),
    klima: apartment.services.some((s) => s.name === "AC"),
    tv: apartment.services.some((s) => s.name === "TV"),

    kafa: apartment.services.some((s) => s.name === "Kitchen"),
    vesmasina: apartment.services.some((s) => s.name === "Washing Machine"),
    fen: apartment.services.some((s) => s.name === "Hair Dryer"),
    balkon: apartment.services.some((s) => s.name === "Balcony"),
  };


  return (
    <ApartmentDetailsTemplate
      basicInfo={
        <LandingApartmentInfo
          imageUrl={{ uri: apartment.heroImageUrl }}
          bedrooms={apartment.bedrooms}
          squareMeters={apartment.squareMeters}
          maxGuests={apartment.maxGuests}
          {...servicesProps}
        />
      }
      gallery={
        <Gallery
          style={[{ width: "100%" }]}
          images={apartment.galleryImages}
        />
      }
      calendar={
        <View>
          <Label
            text="Dostupnost"
            color={Colors.textPrimary}
            size="xl"
            className="font-bold mb-4"
          />
          <ReservationsCalendar reservations={apartment.availability} />
        </View>
      }
    />
  );
}
