import React, { useState, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Reservation } from "@/src/types/types";
import { QuickInfoDialog, QuickInfoItem } from "@/src/components/organisms/Dialogs/QuickInfoDialog/QuickInfoDialog";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { calculateNights } from "@/src/util/dateUtils";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ReservationsCalendarProps {
  reservations: Reservation[];
  onOpenDetails?: (reservation: Reservation) => void;
}

export const ReservationsCalendar: React.FC<ReservationsCalendarProps> = ({
  reservations,
  onOpenDetails,
}) => {
  const { t, i18n } = useTranslation();
  const { Colors } = useTheme();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedReservations, setSelectedReservations] = useState<
    Reservation[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ---------------- Dinamicka lokalizacija kalendara ----------------
  useEffect(() => {
    const currentLang = i18n.language;

    LocaleConfig.locales[currentLang] = {
      monthNames: t("calendar.months", { returnObjects: true }) as string[],
      monthNamesShort: t("calendar.monthsShort", {
        returnObjects: true,
      }) as string[],
      dayNames: t("calendar.dayNames", { returnObjects: true }) as string[],
      dayNamesShort: t("calendar.dayNamesShort", {
        returnObjects: true,
      }) as string[],
      today: t("calendar.today") as string,
    };

    LocaleConfig.defaultLocale = currentLang;
  }, [i18n.language, t]);

  // Pomocna funkcija koja izdvaja samo datum iz stringa datuma i vremena
  const getDateOnly = (datetime: string): string => {
    const d = new Date(datetime);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Pomocna funkcija za tacno parsiranje datuma (obradjuje format YYYY-MM-DD)
  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // ---------------- Obrada rezervacija za kalendar ----------------
  useEffect(() => {
    const marks: { [key: string]: any } = {};
    const reservationsByDate: { [key: string]: Reservation[] } = {};

    const getDateRange = (startDate: string, endDate: string) => {
      const range: string[] = [];
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      const current = new Date(start);
      while (current <= end) {
        const dateStr = `${current.getFullYear()}-${String(
          current.getMonth() + 1
        ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        range.push(dateStr);
        current.setDate(current.getDate() + 1);
      }
      return range;
    };

    // Grupisanje rezervacija po datumu
    reservations.forEach((res) => {
      const startDate = getDateOnly(res.guest.dateTimeOfArrival);
      const endDate = getDateOnly(res.guest.dateTimeOfDeparture);

      getDateRange(startDate, endDate).forEach((d) => {
        if (!reservationsByDate[d]) {
          reservationsByDate[d] = [];
        }
        reservationsByDate[d].push(res);
      });
    });

    // Oznacavanje svakog perioda rezervacije pojedinacno
    reservations.forEach((res) => {
      const startDate = getDateOnly(res.guest.dateTimeOfArrival);
      const endDate = getDateOnly(res.guest.dateTimeOfDeparture);
      const dates = getDateRange(startDate, endDate);

      dates.forEach((date, index) => {
        const isStart = index === 0;
        const isEnd = index === dates.length - 1;
        const isOverlap = reservationsByDate[date].length > 1;

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
            color: isOverlap
              ? Colors.calendarPeriodOverlap
              : Colors.calendarPeriod,
            textColor: Colors.textPrimary,
          };
        }
      });
    });

    setMarkedDates(marks);
  }, [reservations, Colors]);

  // ---------------- Klik na dan ----------------
  const handleDayPress = (day: any) => {
    const clickedDate = day.dateString;

    const list = reservations.filter((r) => {
      const startDate = getDateOnly(r.guest.dateTimeOfArrival);
      const endDate = getDateOnly(r.guest.dateTimeOfDeparture);

      return clickedDate >= startDate && clickedDate <= endDate;
    });

    if (list.length > 0) {
      setSelectedReservations(list);
      setCurrentIndex(0);
      setModalVisible(true);
    }
  };

  const current = selectedReservations[currentIndex] ?? null;

  const formatDateTime = (iso: string) => {
    if (!iso) return "";
    const local = dayjs.utc(iso).tz("Europe/Sarajevo");
    return local.format("DD.MM.YYYY HH:mm");
  };

  // Priprema podataka za dialog
  const getDialogItems = (): QuickInfoItem[] => {
    if (!current) return [];

    const nights = calculateNights(
      current.guest.dateTimeOfArrival,
      current.guest.dateTimeOfDeparture
    );

    const items: QuickInfoItem[] = [
      {
        label: t("reservationsCalendar.guestCount"),
        value: current.guestQuantity,
        isBold: true,
      },
      {
        label: t("reservationsCalendar.nightsCount"),
        value: nights,
        isBold: true,
      },
      {
        label: t("reservationsCalendar.arrival"),
        value: formatDateTime(current.guest.dateTimeOfArrival),
        isBold: true,
        marginTop: 12,
      },
      {
        label: t("reservationsCalendar.departure"),
        value: formatDateTime(current.guest.dateTimeOfDeparture),
        isBold: true,
      },
    ];

    if (current.price) {
      items.push({
        label: t("reservationsCalendar.price"),
        value: `${current.price.toFixed(2)} ${t(
          "reservationsCalendar.currency"
        )}`,
        isBold: true,
        marginTop: 12,
      });
    }

    return items;
  };

  const styles = getStyles(Colors);

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

      <QuickInfoDialog
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={t("reservationsCalendar.modalTitle")}
        items={getDialogItems()}
        buttons={[
          {
            title: t("reservationsCalendar.okButton"),
            onPress: () => setModalVisible(false),
          },
          {
            title: t("reservationsCalendar.detailsButton"),
            onPress: () => {
              setModalVisible(false);
              onOpenDetails && onOpenDetails(current!);
            },
          },
        ]}
        multipleData={{
          currentIndex: currentIndex,
          total: selectedReservations.length,
          onNavigate: (direction) => {
            setCurrentIndex((prev) =>
              direction === "prev" ? prev - 1 : prev + 1
            );
          },
        }}
      />
    </View>
  );
};

// ------------------ STYLES ------------------
const getStyles = (Colors: any) =>
  StyleSheet.create({
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
      width: "100%",
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
  });