import React, { useCallback, useMemo, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useUserReservations } from "@/src/hooks/useUserReservations";
import ReservationCard from "@/src/components/organisms/ReservationCard/ReservationCard";
import { ReservationsCalendar } from "@/src/components/atoms/ReservationsCalendar/ReservationsCalendar";
import FloatButton from "@/src/components/atoms/FloatButton/FloatButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { Reservation } from "@/src/types/types";
import ReservationsSwitcher from "../../molecules/ReservationsSwitcher/ReservationsSwitcher";
import { BlurView } from "expo-blur";
import MissingItemsNotifier from "../../molecules/MissingItemsNotifier/MissingItemsNotifier";
import { VStack } from "../../ui/vstack";
import { dateService } from "@/src/services/dateService";
import { Label } from "../../atoms/Label/Label";

type SegmentOption = "finished" | "active" | "upcoming";
type ViewMode = "list" | "calendar";

/* ---------------- HELPERS ---------------- */

const filterReservationsBySegment = (
	reservations: Reservation[],
	segment: SegmentOption
) => {
	const now = new Date();

	return reservations.filter((r) => {
		const start = dateService.parseBackendDate(r.guest.dateTimeOfArrival);
		const end = dateService.parseBackendDate(r.guest.dateTimeOfDeparture);

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

	const toggleView = () => {
		setViewMode((prev) => (prev === "list" ? "calendar" : "list"));
	};

	const styles = getStyles(Colors);

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
	}, [navigation, viewMode, Colors.textPrimary, toggleView]);

	if (reservationsQuery.isLoading) {
		return (
			<View style={{ marginTop: 80, alignItems: "center" }}>
				<ActivityIndicator size="large" color={Colors.tertiary} />
			</View>
		);
	}

	const getTranslatedSegment = () => {
		switch(segment) {
			case "finished":
				return t('reservations.segments.missing.finished')
			case "active":
				return t('reservations.segments.missing.active')
			case "upcoming":
				return t('reservations.segments.missing.upcoming')
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{/* ---- CONTENT ---- */}
				{viewMode === "list" ? (
					filteredReservations.length !== 0 ?
						<FlatList
							data={filteredReservations}
							keyExtractor={(item) => item.reservationId.toString()}
							contentContainerStyle={styles.listContent}
							renderItem={({ item }) => {
								return (
									<ReservationCard
										reservationId={item.reservationId.toString()}
										name={item.apartment.name}
										address={item.apartment.address}
										dateFrom={dateService.formatLocalDate(item.guest.dateTimeOfArrival).replaceAll(" ", "")}
										dateTo={dateService.formatLocalDate(item.guest.dateTimeOfDeparture).replaceAll(" ", "")}
										onIconPress={() =>
											router.push({
												pathname: '/(home)/reservations/[id]',
												params: {
													id: item.reservationId,        // dynamic route param
													apartmentId: item.apartment.apartmentId, // search param
													segment: segment
												},
											})
										}
									/>
								);
							}}
						/>
						:
						<VStack style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
							<MissingItemsNotifier label={t('reservations.alerts.missingReservationsNotification', { type: getTranslatedSegment() })} />
						</VStack>

						
				) : (
					<ReservationsCalendar
						reservations={filteredReservations}
						onOpenDetails={(reservation) =>
							router.push({
								pathname: '/(home)/reservations/[id]',
								params: {
									id: reservation.reservationId,        // dynamic route param
									apartmentId: reservation.apartment.apartmentId // search param
								},
							})
						}
					/>
				)}

				{/* ---- SEGMENTED CONTROL ---- */}
				<View style={styles.segmentedWrapper}>
					<BlurView
						intensity={15}
						tint="default"
						style={styles.segmentedBlur}
					/>
					<ReservationsSwitcher
						segment={segment}
						onSegmentChange={setSegment}
					/>
				</View>

				{/* ---- FLOAT BUTTON BLUR ---- */}
				<BlurView
					intensity={5}
					tint="default"
					style={styles.floatButtonBlur}
				/>

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
			alignItems: "center"
		},
		content: {
			width: "92%",
			flex: 1,
		},
		listContent: {
			paddingTop: 12,
			paddingBottom: 120,
			paddingHorizontal: 2
		},
		segmentedWrapper: {
			position: "absolute",
			bottom: 24,
			alignSelf: "center",
		},
		segmentedBlur: {
			position: "absolute",
			top: -24,
			bottom: -24,
			left: -16,
			right: -16,
		},
		floatButtonContainer: {
			position: "absolute",
			bottom: 60,
			right: 0,
			zIndex: 20,
		},
		floatButtonBlur: {
			position: "absolute",
			bottom: 66,
			right: 6,
			width: 72,
			height: 72,
			borderRadius: 35,
			overflow: "hidden",
		},
	});
