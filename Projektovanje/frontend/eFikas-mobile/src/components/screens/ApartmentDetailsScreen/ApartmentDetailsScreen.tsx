// src/screens/ApartmentDetailsScreen/ApartmentDetailsScreen.tsx

import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

import ApartmentDetailsTemplate from "../../templates/ApartmentDetailsTemplate/ApartmentDetailsTemplate";
import { apartmentDetailsService } from "@/src/api/services/apartmentDetailsService";
import { Icon } from "../../atoms/Icon/Icon";
import { Gallery } from "../../organisms/Gallery/Gallery";

const ApartmentDetailsScreen: React.FC = () => {
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    apartmentDetailsService.getApartmentDetails(1).then(setDetails);
  }, []);

  if (!details) return null;

  const heroImage = (
    <Image
      source={{ uri: details.heroImageUrl }}
      style={{ width: "100%", height: 230 }}
      resizeMode="cover"
    />
  );

  const heroTags = details.tags.map((tag: string, i: number) => (
    <View
      key={i}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 12
      }}
    >
      <Text style={{ color: "white", fontSize: 13 }}>{tag}</Text>
    </View>
  ));

  const services = details.services.map((s: any, i: number) => (
    <View
      key={i}
      style={{
        backgroundColor: "white",
        padding: 14,
        borderRadius: 12,
        alignItems: "center"
      }}
    >
      <Icon name={s.icon} size={20} />
      <Text style={{ marginTop: 6 }}>{s.label}</Text>
    </View>
  ));

  const galleryItems = details.galleryImages.map((url: string, i: number) => (
    <Image
      key={i}
      source={{ uri: url }}
      style={{ width: 160, height: 110, borderRadius: 12 }}
    />
  ));

  

  const calendar = (
    <View
      style={{
        width: "100%",
        height: 200,
        backgroundColor: "#ececec",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text>Calendar Placeholder</Text>
    </View>
  );

  return (
    <ApartmentDetailsTemplate
      heroImage={heroImage}
      heroTags={heroTags}
      servicesHeader={<Text style={{ fontSize: 18, fontWeight: "600" }}>Usluge</Text>}
      services={services}
      gallery={<Gallery images={details.galleryImages} style={[{width: '100%', height: 250}]} />}
      availabilityHeader={<Text style={{ fontSize: 18, fontWeight: "600" }}>Dostupnost</Text>}
      calendar={calendar}
    />
  );
};

export default ApartmentDetailsScreen;
