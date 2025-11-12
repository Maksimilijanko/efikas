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

import { Colors } from "@/src/styles/style";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import { Icon } from "@/src/components/atoms/Icon/Icon"; 


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
  const { imageUrl, bedrooms = 2, squareMeters = 60, maxGuests = 3 } = props;

  const apartmentServices = useMemo(() => getServicesFromProps(props), [props]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const visibleServices = apartmentServices.slice(0, VISIBLE_SERVICES_COUNT);

  return (
    <>
      <View style={styles.cardWrapper}>
        <ImageBackground
          source={imageUrl}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.infoContainer}>
            <View style={styles.attrBox}>
              <View style={[styles.attrInner, { marginRight: 5 }]}>
                <Icon name="Bed" size={20} color="#000" />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 14,
                    fontWeight: "400",
                    color: Colors.shadowColor,
                  }}
                >
                  {bedrooms}
                </Text>
              </View>
            </View>

            <View style={styles.attrBox}>
              <View style={styles.attrInner}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: Colors.shadowColor,
                  }}
                >
                  {squareMeters} m²
                </Text>
              </View>
            </View>

            <View style={styles.attrBox}>
              <View style={[styles.attrInner, { marginRight: 5 }]}>
                <Icon name="Users" size={20} color="#000" />
                <Text
                  style={{
                    marginLeft: 20,
                    fontSize: 14,
                    fontWeight: "400",
                    color: Colors.shadowColor,
                  }}
                >
                  {maxGuests}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.servicesHeaderContainer}>
        <Text style={styles.servicesTitle}>Usluge</Text>
        {apartmentServices.length > VISIBLE_SERVICES_COUNT && (
          <Pressable onPress={() => setIsModalVisible(true)}>
            <Text style={styles.showAllLink}>Prikaži sve›</Text>
          </Pressable>
        )}
      </View>

      <View style={serviceStyles.gridContainer}>
        {visibleServices.map((service) => (
          <View style={serviceStyles.featureWrapper} key={service.id}>
            <ApartmentFeatureCard
              label={service.name}
              icon={
                <Icon
                  name={service.icon as any}
                  color={Colors.primary}
                  size={22}
                />
              }
              backgroundColor="#f0f0f0"
            />
          </View>
        ))}
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={serviceStyles.modalOverlay}>
          <View style={serviceStyles.modalContainer}>
            <FlatList
              data={apartmentServices}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={serviceStyles.modalListContent}
              renderItem={({ item }) => (
                <View style={serviceStyles.featureWrapper}>
                  <ApartmentFeatureCard
                    label={item.name}
                    icon={
                      <Icon
                        name={item.icon as any}
                        color={Colors.primary}
                        size={22}
                      />
                    }
                    backgroundColor="#f0f0f0"
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

const styles = StyleSheet.create({
  cardWrapper: {
    width: "96%",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 8,
    shadowColor: "#000",
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
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  attrInner: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,
  paddingVertical: 8,
},
  servicesHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "96%",
    alignSelf: "center",
    marginTop: 7,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.shadowColor,
  },
  showAllLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "400",
  },
});

const serviceStyles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "98%",
    alignSelf: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  featureWrapper: {
    width: "49%",   
    marginVertical: 1, 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
     width: "94%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
     marginTop: -10,          
  },
  modalListContent: {
    paddingBottom: 10,
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