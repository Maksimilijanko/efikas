import React from "react";
import { useLocalSearchParams } from "expo-router";
import ReservationDetailsScreen from "@/src/components/screens/ReservationDetailsScreen/ReservationDetailsScreen";
import { useReservation } from "@/src/hooks/useReservation";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/src/providers/ThemeProvider";

const ReservationDetailsById = () => {
  const { id, apartmentId } = useLocalSearchParams<{
    id: string;
    apartmentId?: string;
  }>();
  const { Colors } = useTheme();

  // id iz URL-a je string, a useReservation ocekuje number
  const reservationId = Number(id);
  const apartmentIdNum = Number(apartmentId);

  const { data: reservation, isLoading } = useReservation(reservationId, apartmentIdNum);

  if (isLoading || !reservation) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return <ReservationDetailsScreen reservation={reservation} />;
};

export default ReservationDetailsById;
