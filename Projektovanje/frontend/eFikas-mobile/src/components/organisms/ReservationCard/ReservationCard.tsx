import { Card } from "@/src/components/ui/card";
import { useTheme } from "@/src/providers/ThemeProvider";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface ReservationCardProps {
  reservationId: string;
  name: string;
  address: string;
  dateFrom: string;
  dateTo: string;
  onIconPress: (id: string) => void;
}

export default function ReservationCard({
  reservationId,
  name,
  address,
  dateFrom,
  dateTo,
  onIconPress,
}: ReservationCardProps) {
  const { Colors } = useTheme();
  const styles = getStyles(Colors);

  const handlePress = () => {
    onIconPress(reservationId);
  };

  return (
    <Card variant="elevated" size="md" style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        {/* LEFT SIDE */}
        <View style={styles.leftSection}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.subtitle}>{address}</Text>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightSection}>
          <View style={styles.dateInfo}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Od: </Text>
              <Text style={styles.dateValue}>{dateFrom}.</Text>
            </View>

            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Do: </Text>
              <Text style={styles.dateValue}>{dateTo}.</Text>
            </View>
          </View>

          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.pressableWrapper,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ChevronRight size={30} color={Colors.primary} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const getStyles = (Colors: any) =>
  StyleSheet.create({
    cardContainer: {
      marginVertical: 10,
      backgroundColor: Colors.secondary,
      padding: 15,
      borderRadius: 12,

      // Shadow
      shadowColor: Colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.8,
      elevation: 4,
    },

    contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 5,
    },

    leftSection: {
      flex: 1,
    },

    title: {
      fontSize: 20,
      fontWeight: "600",
      color: Colors.textPrimary,
      marginBottom: 5,
    },

    subtitle: {
      fontSize: 14,
      color: Colors.tertiary,
    },

    rightSection: {
      flexDirection: "row",
      alignItems: "center",
    },

    dateInfo: {
      marginRight: 10,
      alignItems: "flex-end",
      marginTop: 8,
    },

    dateRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 5,
    },

    dateLabel: {
      fontSize: 14,
      color: Colors.tertiary,
    },

    dateValue: {
      fontSize: 14,
      color: Colors.textPrimary,
    },

    pressableWrapper: {
      marginLeft: 5,
      padding: 5,
    },
  });

//PRIMJER UPOTREBE IZ INDEX.TSX FAJLA
/**  
  import React from 'react';
 import { Text, View, StyleSheet, Alert, ScrollView } from "react-native"; 
 import { Colors } from "@/src/styles/style";
 
 import  ReservationCard from "@/src/components/organisms/ReservationCard/ReservationCard";
 
 
 const RESERVATIONS = [
     { reservationId: 'r1', name: "Stan Centar", address: "Jevrejska 14A", dateFrom: "05.01.2025", dateTo: "09.01.2025" },
     { reservationId: 'r2', name: "Lokal Stari Grad", address: "Dunavska 22", dateFrom: "10.03.2025", dateTo: "15.03.2025" },
     { reservationId: 'r3', name: "Kuća na Fruškoj", address: "Sremska 3", dateFrom: "01.05.2025", dateTo: "01.06.2025" }, 
     { reservationId: 'r4', name: "Kancelarije NBG", address: "Bulevar Zorana Đinđića 5", dateFrom: "20.10.2025", dateTo: "30.10.2025" }, 
 ];
 
 
 export default function Index() {
     
     const handleCardClick = (id: string) => { 
         console.log(`Pritisnuta navigacija kod rezervacije ID: ${id}`);
     };
 
     return(
         
         <ScrollView style={styles.screenContainer}>
             
             {RESERVATIONS.map((reservation) => (
                 
                 <ReservationCard 
                     key={reservation.reservationId} 
                     reservationId={reservation.reservationId} 
                     name={reservation.name}
                     address={reservation.address}
                     dateFrom={reservation.dateFrom}
                     dateTo={reservation.dateTo}
                     onIconPress={handleCardClick} 
                 />
             ))}
             
             <View style={{ height: 50 }} />
         </ScrollView>
     );
 }
 
 
 const styles = StyleSheet.create({
     screenContainer: {
         flex: 1,
         padding: 10,
         backgroundColor: 'default', 
     },
     header: {
         fontSize: 20,
         fontWeight: 'bold',
         marginBottom: 15,
         color: Colors.textPrimary,
     },
 });
 
 
 */
