import React from "react";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";

import LandingApartmentInfo from "@/src/components/organisms/LandingApartmentInfo/LandingApartmentInfo";
import ApartmentDetailsTemplate from "../../templates/ApartmentDetailsTemplate/ApartmentDetailsTemplate";
import { apartmentDetailsService } from "@/src/api/services/apartmentDetailsService";
import { Gallery } from "../../organisms/Gallery/Gallery";
import { ReservationsCalendar } from "../../atoms/ReservationsCalendar/ReservationsCalendar";
import { Label } from "../../atoms/Label/Label";
import { useTheme } from "@/src/providers/ThemeProvider";

export default function ApartmentScreen() {

  const { Colors } = useTheme();

  const {
    data: apartment,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["apartment-details", 1],
    queryFn: () => apartmentDetailsService.getApartmentDetails(1),
    staleTime: 1000 * 60 * 10, 
  });

  if (isLoading && !apartment) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <Label text="Doslo je do greske pri ucitavanju stana." color={Colors.textPrimary} />
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: Colors.textSecondary, fontWeight: "600" }}>Pokusaj ponovo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!apartment) {
    return null;
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
