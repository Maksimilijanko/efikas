import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "@/src/styles/style";

// ---- Lokalizacija ----
LocaleConfig.locales["sr"] = {
  monthNames: [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun",
    "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
  ],
  monthNamesShort: ["Jan.", "Feb.", "Mar.", "Apr.", "Maj", "Jun", "Jul.", "Avg.", "Sep.", "Okt.", "Nov.", "Dec."],
  dayNames: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
  dayNamesShort: ["NED", "PON", "UTO", "SRI", "ČET", "PET", "SUB"],
  today: "Danas",
};
LocaleConfig.defaultLocale = "sr";

//  neke informacije o rezervaciji - kasnije izmjeniti
interface Reservation {
  id: string;
  startDate: string;
  endDate?: string;
  guestName: string;
  note?: string;
}

interface ReservationsCalendarProps {
  reservations: Reservation[];
}

export const ReservationsCalendar: React.FC<ReservationsCalendarProps> = ({ reservations }) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const marks: { [key: string]: any } = {};
    const dateCount: { [key: string]: number } = {};

    // Pomocna funkcija - svi datumi u intervalu
    const getDateRange = (start: Date, end: Date) => {
      const range: string[] = [];
      const current = new Date(start);
      while (current <= end) {
        range.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return range;
    };

    // Brojimo koliko puta se svaki datum pojavljuje (da znamo preklapanja)
    reservations.forEach((res) => {
      const start = new Date(res.startDate);
      const end = res.endDate ? new Date(res.endDate) : start;
      const dates = getDateRange(start, end);

      dates.forEach((d) => {
        dateCount[d] = (dateCount[d] || 0) + 1;
      });
    });

    // Sortirani datumi za logiku povezivanja
    const allDates = Object.keys(dateCount).sort();

    // Sada prolazimo kroz sve datume i odredjujemo kako ce izgledati period
    allDates.forEach((date, index) => {
      const prevDate = index > 0 ? allDates[index - 1] : null;
      const nextDate = index < allDates.length - 1 ? allDates[index + 1] : null;

      const current = new Date(date);
      const prev = prevDate ? new Date(prevDate) : null;
      const next = nextDate ? new Date(nextDate) : null;

      const isConsecutivePrev = prev && current.getTime() - prev.getTime() === 86400000;
      const isConsecutiveNext = next && next.getTime() - current.getTime() === 86400000;

      // Ako ima preklapanja — koristiti tamniju boju
      const isOverlap = dateCount[date] > 1;

      marks[date] = {
        startingDay: !isConsecutivePrev,
        endingDay: !isConsecutiveNext,
        color: isOverlap ? Colors.calendarPeriodOverlap : Colors.calendarPeriod,
        textColor: Colors.textLight,
      };
    });

    setMarkedDates(marks);
  }, [reservations]);


  const handleDayPress = (day: any) => {
    const date = day.dateString;

    const resList = reservations.filter((r) => {
      const start = new Date(r.startDate);
      const end = r.endDate ? new Date(r.endDate) : start;
      const d = new Date(date);
      return d >= start && d <= end;
    });

    if (resList.length > 0) {
      setSelectedReservations(resList);
      setModalVisible(true);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}.`;
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths
        firstDay={1}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: Colors.background,
        }}
        theme={{
          arrowColor: Colors.primary,
          monthTextColor: Colors.textPrimary,
          textMonthFontSize: 18,
          textMonthFontWeight: "600",
          todayTextColor: Colors.primary,
        }}
      />

      {/* --- Privremeni modal -> prikaz informacija o rezervaciji za kliknuti datum  --- */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Rezervacije ({selectedReservations.length})
            </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {selectedReservations.map((res) => (
                <View
                  key={res.id}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#ddd",
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>{res.guestName}</Text>
                  <Text>
                    {formatDate(res.startDate)} -{" "}
                    {formatDate(res.endDate || res.startDate)}
                  </Text>
                  {res.note && <Text>Napomena: {res.note}</Text>}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[
                styles.modalButton,
                { backgroundColor: Colors.primary, marginTop: 12 },
              ]}
            >
              <Text style={{ color: Colors.textLight }}>Zatvori</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.background,
    width: "90%",
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
