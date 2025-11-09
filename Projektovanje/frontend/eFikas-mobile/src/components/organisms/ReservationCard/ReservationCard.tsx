import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native"; 
import { Card } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react-native'; 
import { Colors } from "@/src/styles/style";



export interface ReservationCardProps {
    name: string;
    address: string;
    dateFrom: string;
    dateTo: string;
    onIconPress: (name: string) => void; 
}


export default function ReservationCard({ 
    name,
    address,
    dateFrom,
    dateTo,
    onIconPress
}: ReservationCardProps) {
    
    const handlePress = () => {
        onIconPress(name); 
    };
    
    return(
        <Card variant="elevated" size="md" style={{ marginVertical: 10 }}> 
            
            <View style={styles.contentContainer}>
                
                <View style={styles.leftSection}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.subtitle}>{address}</Text>
                </View>

                
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
                            { opacity: pressed ? 0.6 : 1 },
                            styles.pressableWrapper, 
                        ]}
                    >
                        <ChevronRight 
                            size={30} 
                            color={Colors.primary} 
                        /> 
                    </Pressable>
                </View>
            </View>
            
        </Card>
    );
}


const styles = StyleSheet.create({
   
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5, 
    },
    leftSection: {
        flex: 1, 
    },
    title: {
        fontSize: 18,
        color: Colors.textPrimary,
        fontWeight: '500', 
        marginBottom: 5, 
    },
    subtitle: {
        fontSize: 12,
        color: Colors.tertiary, 
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateInfo: {
        marginRight: 10,
        alignItems: 'flex-end', 
        marginTop: 8, 
    },
    dateRow: { 
        flexDirection: 'row',
        justifyContent: 'flex-end', 
        marginBottom: 5, 
    },
    dateLabel: {
        fontSize: 12, 
        color: Colors.tertiary,
        fontWeight: 'normal',
    },
    dateValue: {
        fontSize: 12,
        color: Colors.shadowColor, 
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
    { id: 'r1', name: "Stan Centar", address: "Jevrejska 14A", dateFrom: "05.01.2025", dateTo: "09.01.2025" },
    { id: 'r2', name: "Lokal Stari Grad", address: "Dunavska 22", dateFrom: "10.03.2025", dateTo: "15.03.2025" },
    { id: 'r3', name: "Kuća na Fruškoj", address: "Sremska 3", dateFrom: "01.05.2025", dateTo: "01.06.2025" }, 
    { id: 'r4', name: "Kancelarije NBG", address: "Bulevar Zorana Đinđića 5", dateFrom: "20.10.2025", dateTo: "30.10.2025" }, 
];


export default function Index() {
    
    const handleCardClick = (apartmentName: string) => {
        console.log(`Pritisnuta navigacija kod stana: ${apartmentName}`);

    };

    return(
       
        <ScrollView style={styles.screenContainer}>
            
          
            {RESERVATIONS.map((reservation) => (
              
                <ReservationCard 
                    key={reservation.id} 
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