import React, { useMemo, useState, useEffect } from "react";
import {
	View,
	Text,
	Pressable,
	Image,
	Keyboard,
	Platform,
	Modal,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AddReservationTemplate from "@/src/components/templates/AddReservationTemplate/AddReservationTemplate";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import ToggleItem from "@/src/components/molecules/ToggleItem/ToggleItem";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import TextField from "@/src/components/atoms/TextField/TextField";
import { HStack } from "@/src/components/ui/hstack";
import ApartmentSelectDropdown from "../../organisms/ApartmentSelectDropdown/ApartmentSelectDropdown";
import DateTimePicker from "@/src/components/organisms/DateTimePicker/DateTimePicker";
import { createStyles } from "./index.styles";
import { ApartmentOption } from "../../organisms/ApartmentSelectOverlay/ApartmentSelectOverlay";
import { Label } from "@/src/components/atoms/Label/Label";
import NoteBox from "../../molecules/NoteBox/NoteBox";
import {
	useCreateReservation,
	useUpdateReservation,
} from "@/src/hooks/useReservation";
import { useApartments } from "@/src/hooks/useApartments";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import {
	CreateReservationPayload,
	UpdateReservationPayload,
	Reservation,
	Guest,
	DomesticGuest,
	ForeignGuest,
	LucideIconName,
} from "@/src/types/types";
import { Path, useForm } from "react-hook-form";
import { GuestValidation } from "@/src/util/validationSchemas";
import FormField from "../../molecules/FormField/FormField";
import { IconButton } from "../../atoms/IconButton/IconButton";




type GuestType = "DOMESTIC" | "FOREIGN";
type Gender = "Male" | "Female";
type ActiveDateField =
	| "ARRIVAL"
	| "DEPARTURE"
	| "BIRTH_DATE"
	| "PASSPORT_ISSUED"
	| "ENTRY_DATE"
	| "PERMITTED_RESIDENCE"
	| null;

const dayjs: any = require("dayjs");

const formatDateTimeLabel = (date: Date | null) => {
	if (!date) return "";
	return dayjs(date).format("DD.MM.YYYY. HH:mm");
};

const formatDateLabel = (date: Date | null) => {
	if (!date) return "";
	return dayjs(date).format("DD.MM.YYYY.");
};

const clampGuests = (n: number) => Math.max(1, Math.min(20, n));

function AddReservationScreen() {
	const navigation = useNavigation<any>();
	const route = useRoute<any>();
	const { Colors } = useTheme();
	const { t } = useTranslation();
	const styles = useMemo(() => createStyles(Colors), [Colors]);

	// Odlucivanje da li smo u edit modu
	const isEditMode = route.params?.mode === "edit";
	const reservationId = route.params?.reservationId;
	const existingReservation: Reservation | null = route.params?.reservationData
		? JSON.parse(route.params.reservationData)
		: null;

	const {
		data: apartmentsData,
		isLoading: apartmentsLoading,
		error: apartmentsError,
	} = useApartments();

	const apartments = useMemo<ApartmentOption[]>(() => {
		if (!apartmentsData) return [];

		return apartmentsData.map((apt) => ({
			id: String(apt.apartmentId),
			name: apt.name,
			address: apt.address,
			imageUrl: apt.pictures && apt.pictures.length > 0 ? apt.pictures[0] : "",
		}));
	}, [apartmentsData]);

	const [selectedApartment, setSelectedApartment] = useState<ApartmentOption | null>(null);
	const [guestType, setGuestType] = useState<GuestType>("DOMESTIC");
	const [dailyStay, setDailyStay] = useState(false);
	const [arrivalAt, setArrivalAt] = useState<Date | null>(null);
	const [departureAt, setDepartureAt] = useState<Date | null>(null);

	
	// Guest form
	const { control, handleSubmit: handleSubmit1, watch, getValues, setValue, reset, formState: { errors: errors1, isSubmitting: isSubmitting1 }} = useForm<GuestValidation.FormValues>({
		mode: "onBlur",
		defaultValues: {
			//guestType: "DOMESTIC",
			gender: "Male",
			//guestsCount: 1,
			//dailyStay: false,
		},
	});


	// Guest fields
	const [guestId, setGuestId] = useState(0);
	const [gender, setGender] = useState<Gender>("Male");

	// Additional fields

	const [guestsCount, setGuestsCount] = useState(1);
	const [price, setPrice] = useState("");
	const [note, setNote] = useState("");
	const [documentUri, setDocumentUri] = useState<string | null>(null);

	const [errors, setErrors] = useState<Record<string, string>>({});

	const [dateDialogVisible, setDateDialogVisible] = useState(false);
	const [activeDateField, setActiveDateField] = useState<ActiveDateField>(null);

	const [keyboardOffset, setKeyboardOffset] = useState(0);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [submitPressed, setSubmitPressed] = useState(false);

	const selectedApartmentIdNum = Number(selectedApartment?.id ?? 0);
	const createReservationMutation = useCreateReservation(
		selectedApartmentIdNum
	);
	const updateReservationMutation = useUpdateReservation(
		reservationId,
		selectedApartmentIdNum
	);

	// popunjavanje polja u edit modu
	// useEffect(() => {
	// 	if (isEditMode && existingReservation) {
	// 		const guest = existingReservation.guest;

	// 		// podesavanje apartmana
	// 		const aptOption = apartments.find(
	// 			(apt) => apt.id === String(existingReservation.apartment.apartmentId)
	// 		);
	// 		if (aptOption) setSelectedApartment(aptOption);

	// 		// podesavanje tipa rezervacije
	// 		setDailyStay(existingReservation.reservationType === "Dnevni boravak");

	// 		// podesavanje tipa gosta
	// 		setGuestType(guest.isLocal ? "DOMESTIC" : "FOREIGN");

	// 		// podesavanje datuma
	// 		if (guest.dateTimeOfArrival) {
	// 			setArrivalAt(new Date(guest.dateTimeOfArrival));
	// 		}
	// 		if (guest.dateTimeOfDeparture) {
	// 			setDepartureAt(new Date(guest.dateTimeOfDeparture));
	// 		}

	// 		// podesavanje zajednickih polja za sve tipove gostiju
	// 		setGuestId(guest.id || 0);
	// 		setGuestName(guest.name || "");
	// 		setGuestSurname(guest.surname || "");
	// 		setGender(guest.gender || "Male");
	// 		setPhone(guest.phoneNumber || "");
	// 		if (guest.birthDate) {
	// 			setBirthDate(new Date(guest.birthDate));
	// 		}
	// 		setBirthPlace(guest.birthPlace || "");
	// 		setAddress(guest.address || "");
	// 		setAccommodationUnitNumber(
	// 			guest.accommodationUnitNumber
	// 				? String(guest.accommodationUnitNumber)
	// 				: ""
	// 		);
	// 		setAccommodationUnitFloor(
	// 			guest.accommodationUnitFloor ? String(guest.accommodationUnitFloor) : ""
	// 		);

	// 		// podesavanje polja za rezervaciju
	// 		setGuestsCount(existingReservation.guestQuantity || 1);
	// 		setPrice(
	// 			existingReservation.price ? String(existingReservation.price) : ""
	// 		);
	// 		setInvoiceNumber(guest.issuedInvoiceNumber || "");
	// 		setNote(existingReservation.note || "");
	// 		setDocumentUri(guest.personalDocumentURL || null);

	// 		// podesavanje polja za specifican tip gostiju
	// 		if (guest.isLocal) {
	// 			// domaci gost
	// 			setCitizenId(guest.citizenId || "");
	// 			setBirthMunicipality((guest as any).birthMunicipality || "");
	// 		} else {
	// 			// strani gost
	// 			const foreignGuest = guest as any;
	// 			setCitizenId(guest.citizenId || "");
	// 			setBirthCountry(guest.birthCountry || "");
	// 			setCitizenship(foreignGuest.citizenship || "");
	// 			setPassportNumber(foreignGuest.passportNumber || "");
	// 			if (foreignGuest.passportIssuedDate) {
	// 				setPassportIssuedDate(new Date(foreignGuest.passportIssuedDate));
	// 			}
	// 			if (foreignGuest.entryDate) {
	// 				setEntryDate(new Date(foreignGuest.entryDate));
	// 			}
	// 			setEntryPlace(foreignGuest.entryPlace || "");
	// 			setVisaType(foreignGuest.visaType || "");
	// 			setVisaNumber(foreignGuest.visaNumber || "");
	// 			if (foreignGuest.permittedResidenceDate) {
	// 				setPermittedResidenceDate(
	// 					new Date(foreignGuest.permittedResidenceDate)
	// 				);
	// 			}
	// 		}
	// 	}
	// }, [isEditMode, existingReservation, apartments]);



	useEffect(() => {
		if (!isEditMode || !existingReservation) return;

		const guest = existingReservation.guest;

		// 1 Apartment
		const aptOption = apartments.find(
			(apt) => apt.id === String(existingReservation.apartment.apartmentId)
		);
		if (aptOption) setSelectedApartment(aptOption);

		// 2 Reservation-level state (still useState)
		setDailyStay(existingReservation.reservationType === "Dnevni boravak");

		if (guest.dateTimeOfArrival) {
			setArrivalAt(new Date(guest.dateTimeOfArrival));
		}

		if (guest.dateTimeOfDeparture) {
			setDepartureAt(new Date(guest.dateTimeOfDeparture));
		}

		setGuestsCount(existingReservation.guestQuantity || 1);
		setPrice(existingReservation.price ? String(existingReservation.price) : "");
		setNote(existingReservation.note || "");
		setDocumentUri(guest.personalDocumentURL || null);

		// 3 RHF form values
		reset({
			isLocal: guest.isLocal,
			name: guest.name ?? "",
			surname: guest.surname ?? "",
			gender: guest.gender ?? "Male",
			phoneNumber: guest.phoneNumber ?? "",
			birthDate: guest.birthDate ? new Date(guest.birthDate) : null,
			birthPlace: guest.birthPlace ?? "",
			address: guest.address ?? "",
			accommodationUnitNumber: guest.accommodationUnitNumber ?? null,
			accommodationUnitFloor: guest.accommodationUnitFloor ?? null,

			// Domestic
			jmbg: guest.citizenId ?? "",
			birthMunicipality: guest.isLocal
				? (guest as any).birthMunicipality ?? ""
				: undefined,

			// Foreign
			birthCountry: !guest.isLocal ? guest.birthCountry ?? "" : undefined,
			citizenship: !guest.isLocal ? (guest as any).citizenship ?? "" : undefined,
			passportNumber: !guest.isLocal
				? (guest as any).passportNumber ?? ""
				: undefined,
			passportIssuedDate:
				!guest.isLocal && (guest as any).passportIssuedDate
					? new Date((guest as any).passportIssuedDate)
					: null,
			entryDate:
				!guest.isLocal && (guest as any).entryDate
					? new Date((guest as any).entryDate)
					: null,
			entryPlace: !guest.isLocal ? (guest as any).entryPlace ?? "" : undefined,
			visaType: !guest.isLocal ? (guest as any).visaType ?? "" : undefined,
			visaNumber: !guest.isLocal ? (guest as any).visaNumber ?? "" : undefined,
			permittedResidenceDate:
				!guest.isLocal && (guest as any).permittedResidenceDate
					? new Date((guest as any).permittedResidenceDate)
					: null,
		});
	}, [isEditMode, existingReservation, apartments, reset]);



	// podesavanje default-nog apartmana u create mode
	useEffect(() => {
		if (!isEditMode && apartments.length > 0 && !selectedApartment) {
			setSelectedApartment(apartments[0]);
		}
	}, [isEditMode, apartments, selectedApartment]);

	// podesavanje header naslova u zavisnosti od mode-a
	useEffect(() => {
		navigation.setOptions({
			title: isEditMode ? t("reservations.navigationTitle.editTitle") : t("reservations.navigationTitle.addTitle"),
		});
	}, [navigation, isEditMode]);

	useEffect(() => {
		const showSub = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
			(e: any) => {
				const h = e?.endCoordinates?.height ?? 0;
				setKeyboardOffset(-h * 0.7);
			}
		);

		const hideSub = Keyboard.addListener(
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
			() => setKeyboardOffset(0)
		);

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	const openDateDialog = (field: ActiveDateField) => {
		if (field === "DEPARTURE" && dailyStay) return;
		setActiveDateField(field);
		setDateDialogVisible(true);
	};

	const closeDateDialog = () => {
		setDateDialogVisible(false);
		setActiveDateField(null);
	};

	const confirmDateDialog = (value: Date) => {
		console.log("RESERVATION DATE DIALOG VALUE: ", value)

		switch (activeDateField) {
			case "ARRIVAL":
				setValue("dateTimeOfArrival", value);
				break;
			case "DEPARTURE":
				setValue("dateTimeOfDeparture", value);
				break;
			case "BIRTH_DATE":
				setValue("birthDate", value);
				break;
			case "PASSPORT_ISSUED":
				setValue("passportIssuedDate", value);
				break;
			case "ENTRY_DATE":
				setValue("entryDate", value);
				break;
			case "PERMITTED_RESIDENCE":
				setValue("permittedResidenceDate", value);
				break;
		}
		closeDateDialog();
	};

	const handleDailyStayToggle = (value: boolean) => {
		setDailyStay(value);
		if (value) setDepartureAt(null);
	};

	const openImagePicker = () => {
		Alert.alert(
			t("reservations.alerts.pickDocument.title"),
			t("reservations.alerts.pickDocument.message"),
			[
				{
					text: t("reservations.alerts.pickDocument.camera"),
					onPress: openCamera,
				},
				{
					text: t("reservations.alerts.pickDocument.gallery"),
					onPress: pickFromGallery,
				},
				{
					text: t("reservations.alerts.pickDocument.cancel"),
					style: "cancel",
				},
			],
			{ cancelable: true }
		);
	};

	const openCamera = async () => {
		const perm = await ImagePicker.requestCameraPermissionsAsync();
		if (!perm.granted) {
			Alert.alert(t("reservations.alerts.permissionDenied.title"), t("reservations.alerts.permissionDenied.camera"));
			return;
		}

		const res = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
			allowsEditing: true,
		});

		if (res.canceled) return;
		const uri = res.assets?.[0]?.uri;
		if (uri) setDocumentUri(uri);
	};

	const pickFromGallery = async () => {
		const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!perm.granted) {
			Alert.alert(
				t("reservations.alerts.permissionDenied.title"),
				t("reservations.alerts.permissionDenied.gallery")
			);
			return;
		}

		const res = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 0.8,
			allowsEditing: true,
			allowsMultipleSelection: false,
		});

		if (res.canceled) return;
		const uri = res.assets?.[0]?.uri;
		if (uri) setDocumentUri(uri);
	};

	const resetForm = () => {		
		reset();
	};

	const formatLocalDate = (date: Date | null): string | null =>
		date ? dayjs(date).format("YYYY-MM-DD") : null;

	const buildGuestPayload = (data: GuestValidation.FormValues): Guest => {
		const common = {
			id: guestId,
			name: data.name.trim(),
			surname: data.surname.trim(),
			gender: data.gender,
			phoneNumber: data.phoneNumber,
			birthDate: data.birthDate,
			birthPlace: data.birthPlace,
			address: data.address,
			accommodationUnitNumber: data.accommodationUnitNumber,
			accommodationUnitFloor: data.accommodationUnitFloor,
			dateTimeOfArrival: arrivalAt,
			dateTimeOfDeparture: dailyStay ? null : departureAt,
			personalDocumentURL: documentUri,
		};

		return data.isLocal
			? {
					...common,
					isLocal: true,
					citizenId: data.jmbg!,
					birthMunicipality: data.birthMunicipality!,
					birthCountry: data.birthCountry
			}
			: {
					...common,
					isLocal: false,
					citizenId: data.passportNumber!,
					citizenship: data.citizenship!,
					passportNumber: data.passportNumber!,
					passportIssuedDate: data.passportIssuedDate,
					entryDate: data.entryDate,
					entryPlace: data.entryPlace,
					visaType: data.visaType,
					visaNumber: data.visaNumber,
					permittedResidenceDate: data.permittedResidenceDate,
					birthCountry: data.birthCountry
			};
	};

	const buildReservationPayload = (): CreateReservationPayload => {
		return {
			guest: buildGuestPayload(getValues()),
			guestQuantity: guestsCount,
			price: price ? Number(price) : null,
			note: note || null,
			reservationType: dailyStay ? "Dnevni boravak" : "Nocenje",
		};
	};

	const buildUpdatePayload = (): UpdateReservationPayload => {
		return {
			apartmentId: selectedApartmentIdNum,
			guest: buildGuestPayload(getValues()),
			guestQuantity: guestsCount,
			price: price ? Number(price) : null,
			note: note || null,
			reservationType: dailyStay ? "Dnevni boravak" : "Nocenje",
		};
	};

	// const handleSubmit = () => {
	// 	const nextErrors: Record<string, string> = {};

	// 	if (!selectedApartment || !selectedApartment.id) {
	// 		Alert.alert(t("reservations.alerts.selectApartment.title"), t("reservations.alerts.selectApartment.message"));
	// 		return;
	// 	}

	// 	if (!isEditMode) {
	// 		if (!guestName.trim()) nextErrors.guestName = t("reservations.validation.required");
	// 		if (!guestSurname.trim()) nextErrors.guestSurname = t("reservations.validation.required");
	// 		if (!phone.trim()) nextErrors.phone = t("reservations.validation.required");
	// 		if (!birthDate) nextErrors.birthDate = t("reservations.validation.required");
	// 		if (!birthPlace.trim()) nextErrors.birthPlace = t("reservations.validation.required");

	// 		if (guestType === "DOMESTIC") {
	// 			if (!citizenId.trim()) {
	// 				nextErrors.citizenId = t("reservations.validation.required");
	// 			}
	// 			if (!/^\d{13}$/.test(citizenId)) {
	// 				nextErrors.citizenId = t("reservations.validation.id");
	// 			}
	// 			if (!birthMunicipality.trim()) {
	// 				nextErrors.birthMunicipality = t("reservations.validation.required");
	// 			}
	// 		}

	// 		if (guestType === "FOREIGN") {
	// 			if (!birthCountry.trim()) nextErrors.birthCountry = t("reservations.validation.required");
	// 			if (!citizenship.trim()) nextErrors.citizenship = t("reservations.validation.required");
	// 			if (!passportNumber.trim())
	// 				nextErrors.passportNumber = t("reservations.validation.required");
	// 			if (!passportIssuedDate) {
	// 				nextErrors.passportIssuedDate = t("reservations.validation.required");
	// 			}
	// 			if (!entryDate) nextErrors.entryDate = t("reservations.validation.required");
	// 			if (!entryPlace.trim()) nextErrors.entryPlace = t("reservations.validation.required");
	// 		}
	// 	}

	// 	// Common validation for both modes
	// 	if (!arrivalAt) nextErrors.arrivalAt = t("reservations.validation.selectArrival");

	// 	if (!dailyStay) {
	// 		if (!departureAt) {
	// 			nextErrors.departureAt = t("reservations.validation.selectDeparture");
	// 		}
	// 		if (arrivalAt && departureAt && arrivalAt >= departureAt) {
	// 			nextErrors.departureAt = t("reservations.validation.departureAfterArrival");
	// 		}
	// 	}

	// 	setErrors(nextErrors);
	// 	if (Object.keys(nextErrors).length > 0) return;

	// 	const apartmentIdNum = Number(selectedApartment.id);

	// 	if (isNaN(apartmentIdNum) || apartmentIdNum <= 0) {
	// 		Alert.alert(t("reservations.alerts.invalidApartment.title"), t("reservations.alerts.invalidApartment.message"));
	// 		return;
	// 	}

	// 	if (isEditMode) {
	// 		// UPDATE MODE
	// 		const updatePayload = buildUpdatePayload();
	// 		console.log("=== UPDATE PAYLOAD ===");
	// 		console.log(JSON.stringify(updatePayload, null, 2));

	// 		updateReservationMutation.mutate(
	// 			{
	// 				payload: updatePayload,
	// 				documentPicture:
	// 					documentUri && !documentUri.startsWith("http")
	// 						? {
	// 							uri: documentUri,
	// 							type: "image/jpeg",
	// 							name: `document_${Date.now()}.jpg`,
	// 						}
	// 						: undefined,
	// 			},
	// 			{
	// 				onSuccess: (data) => {
	// 					console.log("=== UPDATE SUCCESS ===", data);
	// 					resetForm();
	// 					navigation.goBack();
	// 				},
	// 				onError: (error: any) => {
	// 					console.log("=== UPDATE ERROR ===");
	// 					console.log("Error message:", error.message);
	// 					console.log("Error response:", error.response?.data);
	// 					console.log("Error status:", error.response?.status);
	// 				},
	// 			}
	// 		);
	// 	} else {
	// 		// CREATE MODE
	// 		const payload = buildReservationPayload();
	// 		console.log("=== CREATE PAYLOAD ===");
	// 		console.log(JSON.stringify(payload, null, 2));

	// 		createReservationMutation.mutate(
	// 			{
	// 				payload,
	// 				documentPicture: documentUri
	// 					? {
	// 						uri: documentUri,
	// 						type: "image/jpeg",
	// 						name: `document_${Date.now()}.jpg`,
	// 					}
	// 					: undefined,
	// 			},
	// 			{
	// 				onSuccess: (data) => {
	// 					console.log("=== CREATE SUCCESS ===", data);
	// 					resetForm();
	// 					navigation.goBack();
	// 				},
	// 				onError: (error: any) => {
	// 					console.log("=== CREATE ERROR ===");
	// 					console.log("Error message:", error.message);
	// 					console.log("Error response:", error.response?.data);
	// 					console.log("Error status:", error.response?.status);
	// 				},
	// 			}
	// 		);
	// 	}
	// };

	const handleSubmit = () => {
		if (!arrivalAt) {
			Alert.alert(t("reservations.alerts.selectApartment.title"), t("reservations.alerts.selectApartment.message"));
			return;
		}

		if(isEditMode) {
			
			const payload = buildUpdatePayload();
			console.log("=== UPDATE PAYLOAD ===");
			console.log(JSON.stringify(payload, null, 2));

			// updateReservationMutation.mutate(
			// 	{
			// 		payload,
			// 		documentPicture:
			// 			documentUri && !documentUri.startsWith("http")
			// 				? {
			// 					uri: documentUri,
			// 					type: "image/jpeg",
			// 					name: `document_${Date.now()}.jpg`,
			// 				}
			// 				: undefined,
			// 	},
			// 	{
			// 		onSuccess: (data) => {
			// 			console.log("=== UPDATE SUCCESS ===", data);
			// 			resetForm();
			// 			navigation.goBack();
			// 		},
			// 		onError: (error: any) => {
			// 			console.log("=== UPDATE ERROR ===");
			// 			console.log("Error message:", error.message);
			// 			console.log("Error response:", error.response?.data);
			// 			console.log("Error status:", error.response?.status);
			// 		},
			// 	}
			// );
		}
		else {
			const payload = buildReservationPayload();
			console.log("=== UPDATE PAYLOAD ===");
			console.log(JSON.stringify(payload, null, 2));

			// createReservationMutation.mutate({
			// 	payload,
			// 	documentPicture:
			// 		documentUri && !documentUri.startsWith("http")
			// 			? {
			// 				uri: documentUri,
			// 				type: "image/jpeg",
			// 				name: `document_${Date.now()}.jpg`,
			// 			}
			// 			: undefined,
			// },
			// {
			// 	onSuccess: (data) => {
			// 		console.log("=== UPDATE SUCCESS ===", data);
			// 		resetForm();
			// 		navigation.goBack();
			// 	},
			// 	onError: (error: any) => {
			// 		console.log("=== UPDATE ERROR ===");
			// 		console.log("Error message:", error.message);
			// 		console.log("Error response:", error.response?.data);
			// 		console.log("Error status:", error.response?.status);
			// 	},
			// });
		}
	};


	const documentRow = (
		<View>
			<View style={styles.inlineRow}>
				<Label text={t("reservations.form.fields.document")} size="lg" />
				<Pressable style={styles.cameraBtn} onPress={openImagePicker}>
					<Icon name="Camera" size={24} color={Colors.textLight} />
				</Pressable>
			</View>

			{documentUri && (
				<View
					style={{
						marginTop: 12,
						backgroundColor: Colors.background,
						padding: 8,
						borderRadius: 16,
						position: "relative",
						alignSelf: "flex-start",
					}}
				>
					<Pressable onPress={() => setPreviewVisible(true)}>
						<Image
							source={{ uri: documentUri }}
							style={{ width: 80, height: 80, borderRadius: 12 }}
						/>
					</Pressable>

					<Pressable
						onPress={() => {
							setDocumentUri(null);
							setPreviewVisible(false);
						}}
						hitSlop={10}
						style={{
							position: "absolute",
							top: -6,
							right: -6,
							width: 26,
							height: 26,
							borderRadius: 13,
							backgroundColor: Colors.background,
							borderWidth: 1,
							borderColor: Colors.borderColor,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Icon name="X" size={14} color={Colors.textPrimary} />
					</Pressable>
				</View>
			)}
		</View>
	);

	if (apartmentsLoading) {
		return (
			<View
				style={[
					styles.screen,
					{ justifyContent: "center", alignItems: "center" },
				]}
			>
				<ActivityIndicator size="large" color={Colors.primary} />
				<Text style={{ marginTop: 16, color: Colors.textLight }}>
					{t("reservations.load.message")}
				</Text>
			</View>
		);
	}

	if (apartmentsError || apartments.length === 0) {
		return (
			<View
				style={[
					styles.screen,
					{ justifyContent: "center", alignItems: "center", padding: 20 },
				]}
			>
				<Icon name="AlertCircle" size={48} color={Colors.primary} />
				<Text
					style={{
						marginTop: 16,
						color: Colors.textPrimary,
						fontSize: 16,
						textAlign: "center",
					}}
				>
					{apartmentsError
						? t("reservations.alerts.noApartments.title")
						: t("reservations.alerts.noApartments.message")}
				</Text>
			</View>
		);
	}

	if (!selectedApartment) {
		return null;
	}

	const getDateDialogInitialValue = () => {
		switch (activeDateField) {
			case "ARRIVAL":
				return new Date(getValues("dateTimeOfArrival"));
			case "DEPARTURE":
				return new Date(getValues("dateTimeOfDeparture"));
			case "BIRTH_DATE":
				return new Date(getValues("birthDate"));
			case "PASSPORT_ISSUED":
				return new Date(getValues("passportIssuedDate"));
			case "ENTRY_DATE":
				return new Date(getValues("entryDate"));
			case "PERMITTED_RESIDENCE":
				return new Date(getValues("permittedResidenceDate"));
			default:
				return null;
		}
	};

	const isSubmitting =
		createReservationMutation.isPending || updateReservationMutation.isPending;

	const renderFormField = (
		label: string, 
		name: Path<GuestValidation.FormValues>, 
		placeholder: string, 
		helperText: string,
		type: 'text' | 'password',
		iconName: LucideIconName,
		rightElement?: React.ReactNode,
		disabled?: boolean,
		formatValue?: (value: any) => string
	) => {
		return(
			<FormField
				control={control}
				name={name}
				label={label}
				placeholder={t(placeholder)}
				helperText={helperText}
				type={type}
				iconName={iconName}
				isInvalid={false}
				rightElement={rightElement}
				size="xl"
				labelSize="lg"
				disabled={disabled}
				formatValue={formatValue}
			/>
		);
	}

	return (
		<View style={styles.screen}>
			<View style={{ flex: 1, transform: [{ translateY: keyboardOffset }] }}>
				<AddReservationTemplate
					apartmentCard={
						<ApartmentSelectDropdown
							value={selectedApartment}
							options={apartments}
							onChange={setSelectedApartment}
						/>
					}
					dailyStayToggleRow={
						<View style={styles.toggleRow}>
							<Label text={t("reservations.form.dailyStay")} size="lg" />
							<ToggleItem
								title=""
								initialValue={dailyStay}
								onValueChange={handleDailyStayToggle}
							/>
						</View>
					}
					arrivalField={
						renderFormField(
							t("reservations.form.arrivalDateTime"), 
							'dateTimeOfArrival', 
							undefined, 
							undefined, 
							'text', 
							undefined, 
							<IconButton iconName="CalendarPlus" onPress={() => openDateDialog("ARRIVAL")} color='gray' />,
							false,
							formatDateTimeLabel
						)
					}
					departureField={
						renderFormField(
							t("reservations.form.departureDateTime"), 
							'dateTimeOfDeparture', 
							undefined, 
							undefined, 
							'text', 
							undefined, 
							<IconButton iconName="CalendarPlus" onPress={() => openDateDialog("DEPARTURE")} color='gray' />, 
							dailyStay,
							formatDateTimeLabel
						)
					}
					guestTypeRow={
						<View style={styles.radioRow}>
							{["DOMESTIC", "FOREIGN"].map((g) => (
								<Pressable
									key={g}
									style={styles.radioOption}
									onPress={() => setGuestType(g as GuestType)}
									disabled={isEditMode} // Disable in edit mode
								>
									<View
										style={[
											styles.radioOuter,
											guestType === g && styles.radioOuterActive,
											isEditMode && { opacity: 0.5 }, // Dim in edit mode
										]}
									>
										{guestType === g && <View style={styles.radioInner} />}
									</View>
									<Text style={[styles.radioText, isEditMode && { opacity: 0.5 }]}>
										{t(
											g === "DOMESTIC"
												? "reservations.form.guestType.domestic"
												: "reservations.form.guestType.foreign"
										)}
									</Text>
								</Pressable>
							))}
						</View>
					}
					guestNameField={
						renderFormField(t("reservations.form.fields.firstName"), 'name', 'Marko', undefined, 'text', "User")
					}
					guestSurnameField={
						renderFormField(t("reservations.form.fields.lastName"), 'surname', 'Marković', undefined, 'text', "User")
					}
					genderField={
						<View style={styles.radioRow}>
							<Label text={t("reservations.form.gender.label")} size="lg" />
							{(["Male", "Female"] as Gender[]).map((g) => (
								<Pressable
									key={g}
									style={styles.radioOption}
									onPress={() => setGender(g)}
								>
									<View
										style={[
											styles.radioOuter,
											gender === g && styles.radioOuterActive,
										]}
									>
										{gender === g && <View style={styles.radioInner} />}
									</View>
									<Text style={[styles.radioText]}>
										{t(
											g === "Male"
												? "reservations.form.gender.male"
												: "reservations.form.gender.female"
										)}
									</Text>
								</Pressable>
							))}
						</View>
					}
					phoneField={
						renderFormField(t("reservations.form.fields.phone"), 'phoneNumber', '065/123-456', undefined, 'text', "Phone")
					}
					birthDateField={
						renderFormField(t("reservations.form.fields.birthDate"), 'birthDate', undefined, undefined, 'text', undefined, <IconButton iconName="CalendarPlus" onPress={() => openDateDialog("BIRTH_DATE")} color='gray' />)
					}
					birthPlaceField={
						renderFormField(t("reservations.form.fields.birthPlace"), 'birthPlace', 'Banja Luka', undefined, 'text', "MapPinned")
					}
					domesticFields={
						guestType === "DOMESTIC"
							? {
								citizenIdField: (
									renderFormField(t("reservations.form.fields.citizenId"), 'jmbg', '1234567891234', undefined, 'text', "Key")
								),
								birthMunicipalityField: (
									renderFormField(t("reservations.form.fields.birthMunicipality"), 'birthMunicipality', 'Banja Luka', undefined, 'text', "MapPin")
								),
							}
							: undefined
					}
					foreignFields={
						guestType === "FOREIGN"
							? {
								birthCountryField: (
									renderFormField(t("reservations.form.fields.birthCountry"), 'birthCountry', 'BiH', undefined, 'text', "MapPinned")
								),
								citizenshipField: (
									renderFormField(t("reservations.form.fields.citizenship"), 'citizenship', 'Srbija', undefined, 'text', "Flag")
								),
								passportNumberField: (
									renderFormField(t("reservations.form.fields.passportNumber"), 'passportNumber', 'W0000208', undefined, 'text', "IdCard")
								),
								passportIssuedDateField: (
									renderFormField(
										t("reservations.form.fields.passportIssuedDate"), 
										'passportIssuedDate',
										undefined, 
										undefined, 
										'text', 
										undefined, 
										<IconButton iconName="CalendarPlus" onPress={() => openDateDialog("PASSPORT_ISSUED")} color='gray' />
									)
								),
								entryDateField: (
									renderFormField(
										t("reservations.form.fields.entryDate"), 
										'entryDate',
										undefined, 
										undefined, 
										'text', 
										undefined, 
										<IconButton iconName="CalendarPlus" onPress={() => openDateDialog("ENTRY_DATE")} color='gray' />
									)
								),
								entryPlaceField: (
									renderFormField(t("reservations.form.fields.entryPlace"), 'entryPlace', 'BiH', undefined, 'text', "MapPinned")
								),
								visaTypeField: (
									renderFormField(t("reservations.form.fields.visaType"), 'visaType', 'Type C', undefined, 'text', "Stamp")
								),
								visaNumberField: (
									renderFormField(t("reservations.form.fields.visaNumber"), 'visaNumber', 'D12345678', undefined, 'text', "Hash")
								),
								permittedResidenceDateField: (
									renderFormField(
										t("reservations.form.fields.permittedResidenceUntil"), 
										'permittedResidenceDate',
										undefined, 
										undefined, 
										'text', 
										undefined, 
										<IconButton iconName="CalendarPlus" onPress={() => openDateDialog("PERMITTED_RESIDENCE")} color='gray' />,
										false,
										formatDateLabel
									)
								),
							}
							: undefined
					}
					addressField={
						renderFormField(t("reservations.form.fields.address"), 'address', 'Ulica 123', undefined, 'text', "House")
					}
					accommodationUnitNumberField={
						renderFormField(t("reservations.form.fields.unitNumber"), 'accommodationUnitNumber', '13', undefined, 'text', "Hash")
					}
					accommodationUnitFloorField={
						renderFormField(t("reservations.form.fields.unitFloor"), 'accommodationUnitFloor', '4', undefined, 'text', "Hash")
					}
					guestsCounterRow={
						<View style={styles.inlineRow}>
							<Label text={t("reservations.form.fields.guestsCount")} size="lg" />
							<HStack space="md">
								<Pressable
									onPress={() => setGuestsCount((p) => clampGuests(p - 1))}
									style={styles.counterBtn}
								>
									<Text style={styles.counterSymbol}>–</Text>
								</Pressable>
								<View style={styles.counterMid}>
									<Text style={styles.counterValue}>{guestsCount}</Text>
								</View>
								<Pressable
									onPress={() => setGuestsCount((p) => clampGuests(p + 1))}
									style={styles.counterBtn}
								>
									<Text style={styles.counterSymbol}>+</Text>
								</Pressable>
							</HStack>
						</View>
					}
					priceField={
						renderFormField(t("reservations.form.fields.price") + ' (BAM)', 'price', '50.00', undefined, 'text', "DollarSign")
						// <View style={styles.priceRow}>
						// 	<Label text={t("reservations.form.fields.price")} size="lg" />
						// 	<View style={styles.priceInputWrap}>
						// 		<TextField
						// 			inputProps={{
						// 				value: price,
						// 				onChangeText: setPrice,
						// 				keyboardType: "numeric",
						// 			}}
						// 			size="xl"
						// 		/>
						// 		<Text style={styles.priceCurrency}>BAM</Text>
						// 	</View>
						// </View>
					}
					invoiceNumberField={
						renderFormField(t("reservations.form.fields.invoiceNumber"), 'issuedInvoiceNumber', '65413211', undefined, 'text', "Receipt")
						// <LabeledTextField
						// 	label={t("reservations.form.fields.invoiceNumber")}
						// 	value={invoiceNumber}
						// 	size="xl"
						// 	labelSize="lg"
						// 	onChangeText={setInvoiceNumber}
						// />
					}
					noteField={
						<View style={styles.noteWrap}>
							<Label text={t("reservations.form.fields.note")} size="lg" />
							<NoteBox value={note} onChangeText={setNote} />
						</View>
					}
					documentRow={documentRow}
					submitButton={
						<TouchableOpacity
							activeOpacity={0.85}
							onPressIn={() => setSubmitPressed(true)}
							onPressOut={() => setSubmitPressed(false)}
							onPress={handleSubmit}
							disabled={isSubmitting}
							style={[
								styles.submitBtn,
								submitPressed && styles.submitBtnPressed,
								isSubmitting && { opacity: 0.6 },
							]}
						>
							<Text style={styles.submitBtnText}>
								{isSubmitting
									? t("reservations.form.buttons.saving")
									: isEditMode
										? t("reservations.form.buttons.update")
										: t("reservations.form.buttons.save")}
							</Text>
						</TouchableOpacity>
					}
				/>
			</View>

			<DateTimePicker
				visible={dateDialogVisible}
				initialValue={getDateDialogInitialValue()}
				timePicker={
					activeDateField === "ARRIVAL" || activeDateField === "DEPARTURE"
				}
				onClose={closeDateDialog}
				onConfirm={confirmDateDialog}
			/>

			{documentUri && (
				<Modal
					visible={previewVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setPreviewVisible(false)}
				>
					<Pressable
						style={{
							flex: 1,
							backgroundColor: "rgba(0,0,0,0.9)",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() => setPreviewVisible(false)}
					>
						<Image
							source={{ uri: documentUri }}
							style={{
								width: "90%",
								height: "80%",
								resizeMode: "contain",
								borderRadius: 12,
							}}
						/>
					</Pressable>
				</Modal>
			)}
		</View>
	);
};

export default AddReservationScreen;