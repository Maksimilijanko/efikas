import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
  Text,
  Pressable,
  Modal,
  FlatList,
} from "react-native";

import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Label } from "../../atoms/Label/Label";

interface Service {
  id: string;
  name: string;
  icon: string;
}

type ServiceKey =
  | "parking"
  | "klima"
  | "tv"
  | "vesmasina"
  | "wifi"
  | "kafa"
  | "fen"
  | "balkon";

const SERVICE_MAP: Record<ServiceKey, Service> = {
  parking: { id: "parking", name: "Parking", icon: "ParkingCircle" },
  wifi: { id: "wifi", name: "Wi-Fi", icon: "Wifi" },
  klima: { id: "klima", name: "Klima", icon: "Wind" },
  tv: { id: "tv", name: "Smart TV", icon: "Tv" },
  kafa: { id: "kafa", name: "Kafa", icon: "Coffee" },
  vesmasina: { id: "vesmasina", name: "Veš mašina", icon: "WashingMachine" },
  fen: { id: "fen", name: "Fen", icon: "Fan" },
  balkon: { id: "balkon", name: "Balkon", icon: "Home" },
};

const VISIBLE_SERVICES_COUNT = 4;

type ServiceProps = {
  [key in ServiceKey]?: boolean;
};

const getServicesFromProps = (props: ServiceProps): Service[] => {
  const activeServices: Service[] = [];
  for (const key in SERVICE_MAP) {
    const serviceKey = key as ServiceKey;
    if (props[serviceKey]) activeServices.push(SERVICE_MAP[serviceKey]);
  }
  return activeServices;
};

interface LandingApartmentInfoProps extends ServiceProps {
  imageUrl: ImageSourcePropType;
  bedrooms: number;
  squareMeters: number;
  maxGuests: number;
}

export default function LandingApartmentInfo(props: LandingApartmentInfoProps) {
  const { Colors } = useTheme();
  const styles = getStyles(Colors);

  const { imageUrl, bedrooms = 2, squareMeters = 60, maxGuests = 3 } = props;

  const apartmentServices = useMemo(() => getServicesFromProps(props), [props]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const visibleServices = apartmentServices.slice(0, VISIBLE_SERVICES_COUNT);

  return (
    <>
      {/* Apartment Main Image */}
      <View style={styles.cardWrapper}>
        <ImageBackground
          source={imageUrl}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.infoContainer}>
            {/* Bedrooms */}
            <View style={styles.attrBox}>
              <View style={styles.attrInner}>
                <Icon name="Bed" size={20} color={Colors.textPrimary} />
                <Text style={styles.attrText}>{bedrooms}</Text>
              </View>
            </View>

            {/* Square meters */}
            <View style={styles.attrBox}>
              <View style={styles.attrInner}>
                <Text style={styles.attrText}>{squareMeters} m²</Text>
              </View>
            </View>

            {/* Max guests */}
            <View style={styles.attrBox}>
              <View style={styles.attrInner}>
                <Icon name="Users" size={20} color={Colors.textPrimary} />
                <Text style={styles.attrText}>{maxGuests}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Services Header */}
      <View style={styles.servicesHeaderContainer}>
        <Label
          text="Usluge"
          color={Colors.textPrimary}
          size="xl"
          className="font-bold mb-4"
        />

        {apartmentServices.length > VISIBLE_SERVICES_COUNT && (
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text style={styles.showAllLink}>Prikaži sve›</Text>
          </Pressable>
        )}
      </View>

      {/* Visible services grid */}
      <View style={styles.gridContainer}>
        {visibleServices.map((service) => (
          <View style={styles.featureWrapper} key={service.id}>
            <ApartmentFeatureCard
              label={service.name}
              icon={
                <Icon
                  name={service.icon as any}
                  color={Colors.primary}
                  size={22}
                />
              }
            />
          </View>
        ))}
      </View>

      {/* Modal with full list */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={apartmentServices}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={styles.modalListContent}
              renderItem={({ item }) => (
                <View style={styles.featureWrapper}>
                  <ApartmentFeatureCard
                    label={item.name}
                    icon={
                      <Icon
                        name={item.icon as any}
                        color={Colors.primary}
                        size={22}
                      />
                    }
                    backgroundColor={Colors.secondary}
                  />
                </View>
              )}
            />

            <DialogButton
              title="U redu"
              onPress={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const getStyles = (Colors: any) =>
  StyleSheet.create({
    cardWrapper: {
      alignSelf: "center",
      backgroundColor: Colors.secondary,
      borderRadius: 15,
      marginVertical: 10,
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 60,
      elevation: 10,
    },
    imageBackground: {
      width: "100%",
      aspectRatio: 16 / 9,
      borderRadius: 15,
      overflow: "hidden",
      justifyContent: "flex-end",
    },
    imageStyle: {
      borderRadius: 15,
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
    },
    attrBox: {
      borderRadius: 10,
      backgroundColor: Colors.secondary,
    },
    attrInner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    attrText: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "500",
      color: Colors.textPrimary,
    },
    servicesHeaderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      alignSelf: "center",
      marginTop: 7,
      paddingVertical: 5,
    },
    servicesTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.textPrimary,
    },
    showAllLink: {
      fontSize: 14,
      color: Colors.primary,
    },

    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: "100%",
      alignSelf: "center",
      marginBottom: 20,
    },
    featureWrapper: {
      width: "49%",
      marginVertical: 4,
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.65)",
    },
    modalContainer: {
      width: "90%",
      backgroundColor: Colors.background,
      borderRadius: 20,
      padding: 8,
      paddingBottom: 24,
      alignItems: "center",
    },
    modalListContent: {
      paddingBottom: 24,
      width: '100%'
    },
  });

//Primjer upotrebe iz index.tsx  fajla
/**
 import { ScrollView, StyleSheet, Text, View } from 'react-native';
 import React from 'react';
 
 import LandingApartmentInfo from '@/src/components/organisms/LandingApartmentInfo/LandingApartmentInfo'; 
 
 
 const APARTMENT_IMAGES = {
     LUXURY: { uri: 'https://plus.unsplash.com/premium_photo-1676321046262-4978a752fb15?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071' },
 };
 
 
 export default function TabOneScreen() {
   return (
     <ScrollView style={styles.container}>
       <LandingApartmentInfo
         imageUrl={APARTMENT_IMAGES.LUXURY}
         bedrooms={4}
         squareMeters={150}
         maxGuests={8}
 
       
         tv={true}
         wifi={true}
         kafa={true}
         klima={true}
         balkon={true}
         fen={true}
         parking={true}
         vesmasina={true}
       />
 
       <View style={{ height: 50 }} />
     </ScrollView>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#f8f8f8',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginHorizontal: 15,
     marginTop: 20,
     marginBottom: 5,
   },
   separator: {
     height: 1,
     backgroundColor: '#ccc',
     marginHorizontal: 15,
     marginBottom: 10,
   },
 });
 
 */
