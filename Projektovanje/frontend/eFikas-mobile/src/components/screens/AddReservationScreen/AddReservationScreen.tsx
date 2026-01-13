import { useMemo, useState, useEffect } from "react";
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
} from "@/src/types/types";

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

const AddReservationScreen = () => {
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

  const [selectedApartment, setSelectedApartment] =
    useState<ApartmentOption | null>(null);
  const [guestType, setGuestType] = useState<GuestType>("DOMESTIC");
  const [dailyStay, setDailyStay] = useState(false);
  const [arrivalAt, setArrivalAt] = useState<Date | null>(null);
  const [departureAt, setDepartureAt] = useState<Date | null>(null);

  // Guest fields
  const [guestName, setGuestName] = useState("");
  const [guestSurname, setGuestSurname] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthPlace, setBirthPlace] = useState("");

  // Domestic guest fields
  const [citizenId, setCitizenId] = useState("");
  const [birthMunicipality, setBirthMunicipality] = useState("");

  // Foreign guest fields
  const [birthCountry, setBirthCountry] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportIssuedDate, setPassportIssuedDate] = useState<Date | null>(
    null
  );
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [entryPlace, setEntryPlace] = useState("");
  const [visaType, setVisaType] = useState("");
  const [visaNumber, setVisaNumber] = useState("");
  const [permittedResidenceDate, setPermittedResidenceDate] =
    useState<Date | null>(null);

  // Additional fields
  const [address, setAddress] = useState("");
  const [accommodationUnitNumber, setAccommodationUnitNumber] = useState("");
  const [accommodationUnitFloor, setAccommodationUnitFloor] = useState("");

  const [guestsCount, setGuestsCount] = useState(1);
  const [price, setPrice] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
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
  useEffect(() => {
    if (isEditMode && existingReservation) {
      const guest = existingReservation.guest;

      // podesavanje apartmana
      const aptOption = apartments.find(
        (apt) => apt.id === String(existingReservation.apartment.apartmentId)
      );
      if (aptOption) setSelectedApartment(aptOption);

      // podesavanje tipa rezervacije
      setDailyStay(existingReservation.reservationType === "Dnevni boravak");

      // podesavanje tipa gosta
      setGuestType(guest.isLocal ? "DOMESTIC" : "FOREIGN");

      // podesavanje datuma
      if (guest.dateTimeOfArrival) {
        setArrivalAt(new Date(guest.dateTimeOfArrival));
      }
      if (guest.dateTimeOfDeparture) {
        setDepartureAt(new Date(guest.dateTimeOfDeparture));
      }

      // podesavanje zajednickih polja za sve tipove gostiju
      setGuestName(guest.name || "");
      setGuestSurname(guest.surname || "");
      setGender(guest.gender || "Male");
      setPhone(guest.phoneNumber || "");
      if (guest.birthDate) {
        setBirthDate(new Date(guest.birthDate));
      }
      setBirthPlace(guest.birthPlace || "");
      setAddress(guest.address || "");
      setAccommodationUnitNumber(
        guest.accommodationUnitNumber
          ? String(guest.accommodationUnitNumber)
          : ""
      );
      setAccommodationUnitFloor(
        guest.accommodationUnitFloor ? String(guest.accommodationUnitFloor) : ""
      );

      // podesavanje polja za rezervaciju
      setGuestsCount(existingReservation.guestQuantity || 1);
      setPrice(
        existingReservation.price ? String(existingReservation.price) : ""
      );
      setInvoiceNumber(guest.issuedInvoiceNumber || "");
      setNote(existingReservation.note || "");
      setDocumentUri(guest.personalDocumentURL || null);

      // podesavanje polja za specifican tip gostiju
      if (guest.isLocal) {
        // domaci gost
        setCitizenId(guest.citizenId || "");
        setBirthMunicipality((guest as any).birthMunicipality || "");
      } else {
        // strani gost
        const foreignGuest = guest as any;
        setCitizenId(guest.citizenId || "");
        setBirthCountry(guest.birthCountry || "");
        setCitizenship(foreignGuest.citizenship || "");
        setPassportNumber(foreignGuest.passportNumber || "");
        if (foreignGuest.passportIssuedDate) {
          setPassportIssuedDate(new Date(foreignGuest.passportIssuedDate));
        }
        if (foreignGuest.entryDate) {
          setEntryDate(new Date(foreignGuest.entryDate));
        }
        setEntryPlace(foreignGuest.entryPlace || "");
        setVisaType(foreignGuest.visaType || "");
        setVisaNumber(foreignGuest.visaNumber || "");
        if (foreignGuest.permittedResidenceDate) {
          setPermittedResidenceDate(
            new Date(foreignGuest.permittedResidenceDate)
          );
        }
      }
    }
  }, [isEditMode, existingReservation, apartments]);

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
        setArrivalAt(value);
        break;
      case "DEPARTURE":
        setDepartureAt(value);
        break;
      case "BIRTH_DATE":
        setBirthDate(value);
        break;
      case "PASSPORT_ISSUED":
        setPassportIssuedDate(value);
        break;
      case "ENTRY_DATE":
        setEntryDate(value);
        break;
      case "PERMITTED_RESIDENCE":
        setPermittedResidenceDate(value);
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
    setGuestType("DOMESTIC");
    setGuestName("");
    setGuestSurname("");
    setGender("Male");
    setPhone("");
    setBirthDate(null);
    setBirthPlace("");
    setCitizenId("");
    setBirthMunicipality("");
    setBirthCountry("");
    setCitizenship("");
    setPassportNumber("");
    setPassportIssuedDate(null);
    setEntryDate(null);
    setEntryPlace("");
    setVisaType("");
    setVisaNumber("");
    setPermittedResidenceDate(null);
    setAddress("");
    setAccommodationUnitNumber("");
    setAccommodationUnitFloor("");
    setDailyStay(false);
    setArrivalAt(null);
    setDepartureAt(null);
    setGuestsCount(1);
    setPrice("");
    setInvoiceNumber("");
    setNote("");
    setDocumentUri(null);
    setErrors({});
    setPreviewVisible(false);
  };

  const buildReservationPayload = (): CreateReservationPayload => {
    const formatLocalDate = (date: Date | null): string | null => {
      if (!date) return null;
      return dayjs(date).format("YYYY-MM-DD");
    };

    // zajednicka polja za gosta
    const commonGuestFields = {
      name: guestName.trim(),
      surname: guestSurname.trim(),
      gender: gender,
      phoneNumber: phone.trim(),
      birthDate: formatLocalDate(birthDate) || "",
      birthPlace: birthPlace.trim(),
      birthCountry: guestType === "DOMESTIC" ? "" : birthCountry.trim(),
      address: address.trim() || "",
      accommodationUnitNumber: accommodationUnitNumber.trim()
        ? Number(accommodationUnitNumber.trim())
        : 0,
      accommodationUnitFloor: accommodationUnitFloor.trim()
        ? Number(accommodationUnitFloor.trim())
        : 0,
      dateTimeOfArrival: arrivalAt ? arrivalAt.toISOString() : "",
      dateTimeOfDeparture:
        dailyStay || !departureAt ? "" : departureAt.toISOString(),
      issuedInvoiceNumber: invoiceNumber.trim() || null,
      remarks: note.trim() || null,
    };

    let guest: any;

    if (guestType === "DOMESTIC") {
      guest = {
        ...commonGuestFields,
        isLocal: true,
        citizenId: citizenId.trim(),
        birthMunicipality: birthMunicipality.trim(),
      };
    } else {
      guest = {
        ...commonGuestFields,
        isLocal: false,
        citizenId: citizenId.trim() || "",
        citizenship: citizenship.trim(),
        passportNumber: passportNumber.trim(),
        passportIssuedDate: formatLocalDate(passportIssuedDate) || "",
        entryDate: formatLocalDate(entryDate) || null,
        entryPlace: entryPlace.trim() || null,
        visaType: visaType.trim() || null,
        visaNumber: visaNumber.trim() || null,
        permittedResidenceDate:
          permittedResidenceDate != null
            ? formatLocalDate(permittedResidenceDate)
            : null,
      };
    }

    return {
      guest,
      guestQuantity: guestsCount,
      price: price.trim() ? Number(price.trim()) : null,
      note: note.trim() || null,
      reservationType: dailyStay ? "Dnevni boravak" : "Nocenje",
    };
  };

  const buildUpdatePayload = (): UpdateReservationPayload => {
    return {
      apartmentId: selectedApartmentIdNum,
	  guest: existingReservation?.guest,
      guestQuantity: guestsCount,
      price: price.trim() ? Number(price.trim()) : null,
      note: note.trim() || null,
      reservationType: dailyStay ? "Dnevni boravak" : "Nocenje",
    };
  };

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};

    if (!selectedApartment || !selectedApartment.id) {
      Alert.alert(t("reservations.alerts.selectApartment.title"), t("reservations.alerts.selectApartment.message"));
      return;
    }

    if (!isEditMode) {
      if (!guestName.trim()) nextErrors.guestName = t("reservations.validation.required");
      if (!guestSurname.trim()) nextErrors.guestSurname = t("reservations.validation.required");
      if (!phone.trim()) nextErrors.phone = t("reservations.validation.required");
      if (!birthDate) nextErrors.birthDate = t("reservations.validation.required");
      if (!birthPlace.trim()) nextErrors.birthPlace = t("reservations.validation.required");

      if (guestType === "DOMESTIC") {
        if (!citizenId.trim()) {
          nextErrors.citizenId = t("reservations.validation.required");
        }
        if (!/^\d{13}$/.test(citizenId)) {
          nextErrors.citizenId = t("reservations.validation.id");
        }
        if (!birthMunicipality.trim()) {
          nextErrors.birthMunicipality = t("reservations.validation.required");
        }
      }

      if (guestType === "FOREIGN") {
        if (!birthCountry.trim()) nextErrors.birthCountry = t("reservations.validation.required");
        if (!citizenship.trim()) nextErrors.citizenship = t("reservations.validation.required");
        if (!passportNumber.trim())
          nextErrors.passportNumber = t("reservations.validation.required");
        if (!passportIssuedDate) {
          nextErrors.passportIssuedDate = t("reservations.validation.required");
        }
        if (!entryDate) nextErrors.entryDate = t("reservations.validation.required");
        if (!entryPlace.trim()) nextErrors.entryPlace = t("reservations.validation.required");
      }
    }

    // Common validation for both modes
    if (!arrivalAt) nextErrors.arrivalAt = t("reservations.validation.selectArrival");

    if (!dailyStay) {
      if (!departureAt) {
        nextErrors.departureAt = t("reservations.validation.selectDeparture");
      }
      if (arrivalAt && departureAt && arrivalAt >= departureAt) {
        nextErrors.departureAt = t("reservations.validation.departureAfterArrival");
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const apartmentIdNum = Number(selectedApartment.id);

    if (isNaN(apartmentIdNum) || apartmentIdNum <= 0) {
      Alert.alert(t("reservations.alerts.invalidApartment.title"), t("reservations.alerts.invalidApartment.message"));
      return;
    }

    if (isEditMode) {
      // UPDATE MODE
      const updatePayload = buildUpdatePayload();
      console.log("=== UPDATE PAYLOAD ===");
      console.log(JSON.stringify(updatePayload, null, 2));

      updateReservationMutation.mutate(
        {
          payload: updatePayload,
          documentPicture:
            documentUri && !documentUri.startsWith("http")
              ? {
                  uri: documentUri,
                  type: "image/jpeg",
                  name: `document_${Date.now()}.jpg`,
                }
              : undefined,
        },
        {
          onSuccess: (data) => {
            console.log("=== UPDATE SUCCESS ===", data);
            resetForm();
            navigation.goBack();
          },
          onError: (error: any) => {
            console.log("=== UPDATE ERROR ===");
            console.log("Error message:", error.message);
            console.log("Error response:", error.response?.data);
            console.log("Error status:", error.response?.status);
          },
        }
      );
    } else {
      // CREATE MODE
      const payload = buildReservationPayload();
      console.log("=== CREATE PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));

      createReservationMutation.mutate(
        {
          payload,
          documentPicture: documentUri
            ? {
                uri: documentUri,
                type: "image/jpeg",
                name: `document_${Date.now()}.jpg`,
              }
            : undefined,
        },
        {
          onSuccess: (data) => {
            console.log("=== CREATE SUCCESS ===", data);
            resetForm();
            navigation.goBack();
          },
          onError: (error: any) => {
            console.log("=== CREATE ERROR ===");
            console.log("Error message:", error.message);
            console.log("Error response:", error.response?.data);
            console.log("Error status:", error.response?.status);
          },
        }
      );
    }
  };

  const documentRow = (
    <View>
      <View style={styles.inlineRow}>
        <Label text={ t("reservations.form.fields.document")} size="lg" />
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
        return arrivalAt;
      case "DEPARTURE":
        return departureAt;
      case "BIRTH_DATE":
        return birthDate;
      case "PASSPORT_ISSUED":
        return passportIssuedDate;
      case "ENTRY_DATE":
        return entryDate;
      case "PERMITTED_RESIDENCE":
        return permittedResidenceDate;
      default:
        return null;
    }
  };

  const isSubmitting =
    createReservationMutation.isPending || updateReservationMutation.isPending;

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
            <Pressable onPress={() => openDateDialog("ARRIVAL")}>
              <View pointerEvents="none">
                <LabeledTextField
                  label={t("reservations.form.arrivalDateTime")}
                  value={arrivalAt ? formatDateTimeLabel(arrivalAt) : ""}
                  size="xl"
                  labelSize="lg"
                  rightElement={<Icon name="CalendarPlus" color="gray" />}
                  errorText={errors.arrivalAt}
                />
              </View>
            </Pressable>
          }
          departureField={
            <Pressable
              onPress={() => openDateDialog("DEPARTURE")}
              disabled={dailyStay}
            >
              <View
                pointerEvents="none"
                style={dailyStay ? { opacity: 0.4 } : undefined}
              >
                <LabeledTextField
                  label={t("reservations.form.departureDateTime")}
                  value={
                    dailyStay
                      ? ""
                      : departureAt
                      ? formatDateTimeLabel(departureAt)
                      : ""
                  }
                  size="xl"
                  labelSize="lg"
                  rightElement={<Icon name="CalendarPlus" color="gray" />}
                  errorText={errors.departureAt}
                />
              </View>
            </Pressable>
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
            <LabeledTextField
              label={t("reservations.form.fields.firstName")}
              value={guestName}
              size="xl"
              labelSize="lg"
              onChangeText={setGuestName}
              errorText={errors.guestName}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          guestSurnameField={
            <LabeledTextField
              label={t("reservations.form.fields.lastName")}
              value={guestSurname}
              size="xl"
              labelSize="lg"
              onChangeText={setGuestSurname}
              errorText={errors.guestSurname}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          genderField={
            <View style={styles.radioRow}>
              <Label text={t("reservations.form.gender.label")} size="lg" />
              {(["Male", "Female"] as Gender[]).map((g) => (
                <Pressable
                  key={g}
                  style={styles.radioOption}
                  onPress={() => setGender(g)}
                  disabled={isEditMode}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      gender === g && styles.radioOuterActive,
                      isEditMode && { opacity: 0.5 },
                    ]}
                  >
                    {gender === g && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioText, isEditMode && { opacity: 0.5 }]}>
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
            <LabeledTextField
              label={t("reservations.form.fields.phone")}
              value={phone}
              size="xl"
              labelSize="lg"
              onChangeText={setPhone}
              errorText={errors.phone}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          birthDateField={
            <Pressable
              onPress={() => openDateDialog("BIRTH_DATE")}
              disabled={isEditMode}
            >
              <View pointerEvents="none">
                <LabeledTextField
                  label={t("reservations.form.fields.birthDate")}
                  value={birthDate ? formatDateLabel(birthDate) : ""}
                  size="xl"
                  labelSize="lg"
                  rightElement={<Icon name="CalendarPlus" color="gray" />}
                  errorText={errors.birthDate}
                  inputProps={{
                    editable: !isEditMode,
                  }}
                />
              </View>
            </Pressable>
          }
          birthPlaceField={
            <LabeledTextField
              label={t("reservations.form.fields.birthPlace")}
              value={birthPlace}
              size="xl"
              labelSize="lg"
              onChangeText={setBirthPlace}
              errorText={errors.birthPlace}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          domesticFields={
            guestType === "DOMESTIC"
              ? {
                  citizenIdField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.citizenId")}
                      value={citizenId}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setCitizenId}
                      errorText={errors.citizenId}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  birthMunicipalityField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.birthMunicipality")}
                      value={birthMunicipality}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setBirthMunicipality}
                      errorText={errors.birthMunicipality}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                }
              : undefined
          }
          foreignFields={
            guestType === "FOREIGN"
              ? {
                  birthCountryField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.birthCountry")}
                      value={birthCountry}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setBirthCountry}
                      errorText={errors.birthCountry}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  citizenshipField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.citizenship")}
                      value={citizenship}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setCitizenship}
                      errorText={errors.citizenship}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  passportNumberField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.passportNumber")}
                      value={passportNumber}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setPassportNumber}
                      errorText={errors.passportNumber}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  passportIssuedDateField: (
                    <Pressable
                      onPress={() => openDateDialog("PASSPORT_ISSUED")}
                      disabled={isEditMode}
                    >
                      <View pointerEvents="none">
                        <LabeledTextField
                          label={t("reservations.form.fields.passportIssuedDate")}
                          value={
                            passportIssuedDate
                              ? formatDateLabel(passportIssuedDate)
                              : ""
                          }
                          size="xl"
                          labelSize="lg"
                          rightElement={
                            <Icon name="CalendarPlus" color="gray" />
                          }
                          errorText={errors.passportIssuedDate}
                          inputProps={{
                            editable: !isEditMode,
                          }}
                        />
                      </View>
                    </Pressable>
                  ),
                  entryDateField: (
                    <Pressable
                      onPress={() => openDateDialog("ENTRY_DATE")}
                      disabled={isEditMode}
                    >
                      <View pointerEvents="none">
                        <LabeledTextField
                          label={t("reservations.form.fields.entryDate")}
                          value={entryDate ? formatDateLabel(entryDate) : ""}
                          size="xl"
                          labelSize="lg"
                          rightElement={
                            <Icon name="CalendarPlus" color="gray" />
                          }
                          errorText={errors.entryDate}
                          inputProps={{
                            editable: !isEditMode,
                          }}
                        />
                      </View>
                    </Pressable>
                  ),
                  entryPlaceField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.entryPlace")}
                      value={entryPlace}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setEntryPlace}
                      errorText={errors.entryPlace}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  visaTypeField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.visaType")}
                      value={visaType}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setVisaType}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  visaNumberField: (
                    <LabeledTextField
                      label={t("reservations.form.fields.visaNumber")}
                      value={visaNumber}
                      size="xl"
                      labelSize="lg"
                      onChangeText={setVisaNumber}
                      inputProps={{
                        editable: !isEditMode,
                      }}
                    />
                  ),
                  permittedResidenceDateField: (
                    <Pressable
                      onPress={() => openDateDialog("PERMITTED_RESIDENCE")}
                      disabled={isEditMode}
                    >
                      <View pointerEvents="none">
                        <LabeledTextField
                          label={t("reservations.form.fields.permittedResidenceUntil")}
                          value={
                            permittedResidenceDate
                              ? formatDateLabel(permittedResidenceDate)
                              : ""
                          }
                          size="xl"
                          labelSize="lg"
                          rightElement={
                            <Icon name="CalendarPlus" color="gray" />
                          }
                          inputProps={{
                            editable: !isEditMode,
                          }}
                        />
                      </View>
                    </Pressable>
                  ),
                }
              : undefined
          }
          addressField={
            <LabeledTextField
              label={t("reservations.form.fields.address")}
              value={address}
              size="xl"
              labelSize="lg"
              onChangeText={setAddress}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          accommodationUnitNumberField={
            <LabeledTextField
              label={t("reservations.form.fields.unitNumber")}
              value={accommodationUnitNumber}
              size="xl"
              labelSize="lg"
              onChangeText={setAccommodationUnitNumber}
              inputProps={{
                editable: !isEditMode,
              }}
            />
          }
          accommodationUnitFloorField={
            <LabeledTextField
              label={t("reservations.form.fields.unitFloor")}
              value={accommodationUnitFloor}
              size="xl"
              labelSize="lg"
              onChangeText={setAccommodationUnitFloor}
              inputProps={{
                editable: !isEditMode,
              }}
            />
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
            <View style={styles.priceRow}>
              <Label text={t("reservations.form.fields.price")} size="lg" />
              <View style={styles.priceInputWrap}>
                <TextField
                  inputProps={{
                    value: price,
                    onChangeText: setPrice,
                    keyboardType: "numeric",
                  }}
                  size="xl"
                />
                <Text style={styles.priceCurrency}>BAM</Text>
              </View>
            </View>
          }
          invoiceNumberField={
            <LabeledTextField
              label={t("reservations.form.fields.invoiceNumber")}
              value={invoiceNumber}
              size="xl"
              labelSize="lg"
              onChangeText={setInvoiceNumber}
              inputProps={{
                editable: !isEditMode,
              }}
            />
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
                  ?t("reservations.form.buttons.saving")
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