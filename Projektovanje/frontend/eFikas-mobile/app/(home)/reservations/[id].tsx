import React from "react";
import { useLocalSearchParams } from "expo-router";
import ReservationDetailsScreen from "@/src/components/screens/ReservationDetailsScreen/ReservationDetailsScreen";

const ReservationDetailsById = () => {
  const { id } = useLocalSearchParams();

  // Ovdje kasnije radiš fetch:
  // const reservation = useQuery(["reservation", id], ...)

  // Za sada mock:
  const reservation = {
    id,
    guestName: "Janko Janković",
    phone: "066/123-123",
    peopleCount: 2,
    checkIn: "05.01.2025. 13:30",
    checkOut: "29.02.2025. 22:25",
    apartment: {
      title: "Stan Centar",
      subtitle: "Jevrejska 14A",
      imageUrl: "https://picsum.photos/300/300",
      status: false,
      statusUntil: "08.01.2025.",
      nextGuestsDate: "10.01.2025.",
    },
  };

  return <ReservationDetailsScreen reservation={reservation} />;
};

export default ReservationDetailsById;
