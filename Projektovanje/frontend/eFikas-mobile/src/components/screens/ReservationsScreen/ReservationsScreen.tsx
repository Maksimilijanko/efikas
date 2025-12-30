import React, { useMemo, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useUserReservations } from "@/src/hooks/useUserReservations";
import ReservationCard from "@/src/components/organisms/ReservationCard/ReservationCard";
import { SegmentedControl } from "@/src/components/atoms/SegmentedControl/SegmentedControl";
import { ReservationsCalendar } from "@/src/components/atoms/ReservationsCalendar/ReservationsCalendar";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { Reservation } from "@/src/types/types";

type SegmentOption = "finished" | "active" | "upcoming";
type ViewMode = "list" | "calendar";

/* ---------------- HELPERS ---------------- */

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}.${String(
    d.getMonth() + 1
  ).padStart(2, "0")}.${d.getFullYear()}`;
};

const filterReservationsBySegment = (
  reservations: Reservation[],
  segment: SegmentOption
) => {
  const now = new Date();

  return reservations.filter((r) => {
    const start = new Date(r.dateTimeOfArrival);
    const end = new Date(r.dateTimeOfDeparture);

    switch (segment) {
      case "finished":
        return end < now;
      case "active":
        return start <= now && end >= now;
      case "upcoming":
        return start > now;
      default:
        return true;
    }
  });
};

/* ---------------- SCREEN ---------------- */

export default function ReservationsScreen() {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const navigation = useNavigation();

  const [segment, setSegment] = useState<SegmentOption>("active");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const reservationsQuery = useUserReservations();

  const reservations = reservationsQuery.data ?? [];

  const filteredReservations = useMemo(
    () => filterReservationsBySegment(reservations, segment),
    [reservations, segment]
  );

  const segmentOptions = useMemo(() => [
    { label: t("reservations.segments.finished"), value: "finished" },
    { label: t("reservations.segments.active"), value: "active" },
    { label: t("reservations.segments.upcoming"), value: "upcoming" }
  ], [t]);

  const toggleView = () => {
    setViewMode((prev) => (prev === "list" ? "calendar" : "list"));
  };

  const styles = getStyles(Colors);

  if (reservationsQuery.isLoading) {
    return (
      <View style={{ marginTop: 80, alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={toggleView} style={{ paddingHorizontal: 24 }}>
          <Icon
            name={viewMode === "list" ? "Calendar" : "List"}
            size={24}
            strokeWidth={1.8}
            color={Colors.textPrimary}
          />
        </Pressable>
      ),
    });
  }, [navigation, viewMode, Colors.textPrimary]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ---- CONTENT ---- */}
        {viewMode === "list" ? (
          <FlatList
            data={filteredReservations}
            keyExtractor={(item) => item.reservationId.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ReservationCard
                reservationId={item.reservationId.toString()}
                name={item.apartment.name}
                address={item.apartment.address}
                dateFrom={formatDate(item.dateTimeOfArrival)}
                dateTo={formatDate(item.dateTimeOfDeparture)}
                onIconPress={() =>
                  router.push(`/(home)/reservations/${item.reservationId}`)
                }
              />
            )}
          />
        ) : (
          <ReservationsCalendar
            reservations={filteredReservations}
            onOpenDetails={(reservation) =>
              router.push(`/(home)/reservations/${reservation.reservationId}`)
            }
          />
        )}

        {/* ---- SEGMENTED CONTROL ---- */}
        <View style={styles.segmentedWrapper}>
          <SegmentedControl
            options={segmentOptions.map(o => o.label)}
            selectedOption={segmentOptions.find(o => o.value === segment)?.label || ""}
            onOptionPress={(label) => {
              const selected = segmentOptions.find(o => o.label === label);
              if (selected) setSegment(selected.value as SegmentOption);
            }}
          />
        </View>

        {/* ---- FLOAT BUTTON ---- */}
        <View style={styles.floatButtonContainer}>
          <FloatButton
            size="lg"
            placement="bottom right"
            onClick={() => router.push(`/(home)/reservations/addReservation`)}
          />
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const getStyles = (Colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      alignItems: "center",
    },
    content: {
      width: "92%",
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 120,
    },
    segmentedWrapper: {
      position: "absolute",
      bottom: 24,
      alignSelf: "center",
    },
    floatButtonContainer: {
      position: "absolute",
      bottom: 60,
      right: 0,
      zIndex: 20,
    },
  });
