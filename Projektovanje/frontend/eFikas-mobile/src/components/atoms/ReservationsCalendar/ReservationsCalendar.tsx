import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Colors } from "@/src/styles/style";
import { DialogButton } from "@/src/components/atoms/DialogButton/DialogButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Platform } from "react-native";

// ------------------ Lokalizacija ------------------
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

export interface DbReservation {
  ReservationId: number;
  ApartmentId: number;
  GuestFullName: string;
  GuestPhoneNumber: string;
  DateTimeOfArrival: string;
  DateTimeOfDeparture: string;
  GuestNumber: number;
  Price?: number;
  Note?: string;
  PersonalDocumentURL?: string;
  IdTypeOfReservation: number;
  TypeId: number;
}

interface ReservationsCalendarProps {
  reservations: DbReservation[];
  onOpenDetails?: (reservation: DbReservation) => void;
}

export const ReservationsCalendar: React.FC<ReservationsCalendarProps> = ({
  reservations,
  onOpenDetails,
}) => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedReservations, setSelectedReservations] = useState<DbReservation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- Animacije ----------------
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const [navigationLocked, setNavigationLocked] = useState(false);

  const safeNavigate = (delta: number) => {
    if (navigationLocked) return;
    setNavigationLocked(true);

    setCurrentIndex((i) => i + delta);

    setTimeout(() => setNavigationLocked(false), 120);
  };

  // Pomocna funkcija koja izdvaja samo datum iz stringa datuma i vremena
  const getDateOnly = (datetime: string): string => {
    return datetime.split(" ")[0];
  };

  // Pomocna funkcija za tacno parsiranje datuma (obradjuje format YYYY-MM-DD)
  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // ---------------- Obrada rezervacija za kalendar ----------------
  useEffect(() => {
    const marks: { [key: string]: any } = {};
    const reservationsByDate: { [key: string]: DbReservation[] } = {};

    const getDateRange = (startDate: string, endDate: string) => {
      const range: string[] = [];
      const start = parseDate(startDate);
      const end = parseDate(endDate);
      
      const current = new Date(start);
      // Ukljucivanje svih dana od pocetka do kraja (ukljucujuci kraj)
      while (current <= end) {
        const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        range.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
      return range;
    };

    // Grupisanje rezervacija po datumu
    reservations.forEach((res) => {
      const startDate = getDateOnly(res.DateTimeOfArrival);
      const endDate = getDateOnly(res.DateTimeOfDeparture);

      getDateRange(startDate, endDate).forEach((d) => {
        if (!reservationsByDate[d]) {
          reservationsByDate[d] = [];
        }
        reservationsByDate[d].push(res);
      });
    });

    // Oznacavanje svakog perioda rezervacije pojedinacno
    reservations.forEach((res) => {
      const startDate = getDateOnly(res.DateTimeOfArrival);
      const endDate = getDateOnly(res.DateTimeOfDeparture);
      const dates = getDateRange(startDate, endDate);

      dates.forEach((date, index) => {
        const isStart = index === 0;
        const isEnd = index === dates.length - 1;
        const isOverlap = reservationsByDate[date].length > 1;

        // Preklapanje datuma
        if (marks[date]) {
          marks[date] = {
            startingDay: marks[date].startingDay || isStart,
            endingDay: marks[date].endingDay || isEnd,
            color: Colors.calendarPeriodOverlap,
            textColor: Colors.textPrimary,
          };
        } else {
          marks[date] = {
            startingDay: isStart,
            endingDay: isEnd,
            color: isOverlap ? Colors.calendarPeriodOverlap : Colors.calendarPeriod,
            textColor: Colors.textPrimary,
          };
        }
      });
    });

    setMarkedDates(marks);
  }, [reservations]);

  // ---------------- Klik na dan ----------------
  const handleDayPress = (day: any) => {
    const clickedDate = day.dateString;

    const list = reservations.filter((r) => {
      // Uporedjuje samo dane, ali ne i sate
      const startDate = getDateOnly(r.DateTimeOfArrival);
      const endDate = getDateOnly(r.DateTimeOfDeparture);
      
      return clickedDate >= startDate && clickedDate <= endDate;
    });

    if (list.length > 0) {
      setSelectedReservations(list);
      setCurrentIndex(0);
      setModalVisible(true);

      setTimeout(animateIn, 10);
    }
  };

  const current = selectedReservations[currentIndex] ?? null;

  const formatDateTime = (iso: string) => {
    if (!iso) return "";
    const [datePart, timePart] = iso.split(" ");
    const d = new Date(datePart);
    const dateStr = `${String(d.getDate()).padStart(2, "0")}. ${String(
      d.getMonth() + 1
    ).padStart(2, "0")}. ${d.getFullYear()}.`;

    // Ako postoji vrijeme i nije 00:00:00, prikazuje se
    if (timePart && timePart !== "00:00:00") {
      const [h, m] = timePart.split(":");
      return `${dateStr} ${h}:${m}`;
    }

    return dateStr;
  };

  const nights =
    current &&
    Math.max(
      1,
      Math.ceil(
        (parseDate(getDateOnly(current.DateTimeOfDeparture)).getTime() -
          parseDate(getDateOnly(current.DateTimeOfArrival)).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

  return (
    <View style={styles.calendarWrapper}>
      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        enableSwipeMonths
        firstDay={1}
        style={styles.calendar}
        theme={{
          arrowColor: Colors.primary,
          monthTextColor: Colors.textPrimary,
          textMonthFontSize: 18,
          textMonthFontWeight: "600",
          todayTextColor: Colors.primary,
        }}
      />

      {/* ---------------- MODAL ---------------- */}
      <Modal visible={modalVisible} transparent animationType="none">
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            {/* Strelice - samo ako ima vise rezervacija */}
            {selectedReservations.length > 1 && (
              <>
                <TouchableOpacity
                  style={styles.leftArrow}
                  disabled={currentIndex === 0}
                  onPress={() => safeNavigate(-1)}
                >
                  <Icon
                    name="ChevronLeft"
                    size={28}
                    color={currentIndex === 0 ? Colors.tertiary : Colors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rightArrow}
                  disabled={currentIndex === selectedReservations.length - 1}
                  onPress={() => safeNavigate(1)}
                >
                  <Icon
                    name="ChevronRight"
                    size={28}
                    color={
                      currentIndex === selectedReservations.length - 1
                        ? Colors.tertiary
                        : Colors.primary
                    }
                  />
                </TouchableOpacity>
              </>
            )}

            {/* Naslov */}
            <Text style={styles.modalTitle}>
              Informacije o boravku
              {selectedReservations.length > 1 &&
                ` (${selectedReservations.length})`}
            </Text>

            {/* Podaci o rezervaciji */}
            {current && (
              <View style={styles.resContent}>
                <Text style={styles.label}>
                  Broj gostiju: <Text style={styles.bold}>{current.GuestNumber}</Text>
                </Text>

                <Text style={styles.label}>
                  Broj noćenja: <Text style={styles.bold}>{nights}</Text>
                </Text>
                
                <Text style={[styles.label, { marginTop: 12 }]}>
                  Dolazak: <Text style={styles.bold}>{formatDateTime(current.DateTimeOfArrival)}</Text>
                </Text>

                <Text style={styles.label}>
                  Odlazak: <Text style={styles.bold}>{formatDateTime(current.DateTimeOfDeparture)}</Text>
                </Text>

                {current.Price && (
                  <Text style={[styles.label, { marginTop: 12 }]}>
                    Cijena: <Text style={styles.bold}>{current.Price.toFixed(2)} BAM</Text>
                  </Text>
                )}
              </View>
            )}

            {/* Dugmad */}
            <View style={styles.buttonRow}>
              <DialogButton
                title="U redu"
                onPress={() =>
                  animateOut(() => {
                    setModalVisible(false);
                  })
                }
              />
              <DialogButton
                title="Detalji"
                onPress={() => onOpenDetails && onOpenDetails(current!)}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  calendar: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.background,
    paddingTop: 10,
    paddingBottom: 10,
  },

  calendarWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.background,
    width: '100%',
    // SHADOW
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadowColor,
        shadowOpacity: 0.05,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },

  leftArrow: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 6,
    zIndex: 999,
  },

  rightArrow: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 6,
    zIndex: 999,
  },

  resContent: {
    marginBottom: 26,
  },

  label: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 6,
  },

  bold: {
    fontWeight: "600",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
});