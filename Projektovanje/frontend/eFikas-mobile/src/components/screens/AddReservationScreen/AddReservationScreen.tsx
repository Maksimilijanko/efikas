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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import AddReservationTemplate from "@/src/components/templates/AddReservationTemplate/AddReservationTemplate";
import LabeledTextField from "@/src/components/molecules/LabeledTextField/LabeledTextField";
import ToggleItem from "@/src/components/molecules/ToggleItem/ToggleItem";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import TextField from "@/src/components/atoms/TextField/TextField";
import { HStack } from "@/components/ui/hstack";

import ApartmentSelectDropdown from "../../organisms/ApartmentSelectDropdown/ApartmentSelectDropdown";
import DateTimeDialog from "../../organisms/Dialogs/DateTimeDialog/DateTimeDialog";

import styles from "./index.styles";

import { ApartmentOption } from "../../organisms/ApartmentSelectOverlay/ApartmentSelectOverlay";
import { Label } from "@/src/components/atoms/Label/Label";
import NoteBox from "../../molecules/NoteBox/NoteBox";
import { useCreateReservation } from "@/src/hooks/useReservation";
import { useApartmentsList } from "@/src/hooks/useApartmentsList";
import { useTheme } from "@/src/providers/ThemeProvider";

type GuestType = "DOMACI" | "STRANI";
type ActiveDateField = "ARRIVAL" | "DEPARTURE" | null;

const dayjs: any = require("dayjs");

const formatDateTimeLabel = (date: Date | null) => {
  if (!date) return "";
  return dayjs(date).format("DD.MM.YYYY. HH:mm");
};

const clampGuests = (n: number) => Math.max(1, Math.min(20, n));

const AddReservationScreen = () => {
  const navigation = useNavigation<any>();

  const { Colors } = useTheme();

  const { data: apartmentsData, isLoading: apartmentsLoading, error: apartmentsError } = useApartmentsList();

  const apartments = useMemo<ApartmentOption[]>(() => {
    if (!apartmentsData) return [];
    
    return apartmentsData.map((apt) => ({
      id: String(apt.id),
      name: apt.name,
      address: apt.address,
      imageUrl: apt.imageUrl,
    }));
  }, [apartmentsData]);

  const [selectedApartment, setSelectedApartment] = useState<ApartmentOption | null>(null);
  const [guestType, setGuestType] = useState<GuestType>("DOMACI");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [dailyStay, setDailyStay] = useState(false);
  const [arrivalAt, setArrivalAt] = useState<Date | null>(null);
  const [departureAt, setDepartureAt] = useState<Date | null>(null);
  const [guestsCount, setGuestsCount] = useState(1);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [documentUri, setDocumentUri] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    guestName?: string;
    phone?: string;
    arrivalAt?: string;
    departureAt?: string;
  }>({});

  const [dateDialogVisible, setDateDialogVisible] = useState(false);
  const [activeDateField, setActiveDateField] = useState<ActiveDateField>(null);

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [submitPressed, setSubmitPressed] = useState(false);

  useEffect(() => {
    if (apartments.length > 0 && !selectedApartment) {
      setSelectedApartment(apartments[0]);
    }
  }, [apartments, selectedApartment]);

  const selectedApartmentIdNum = Number(selectedApartment?.id ?? 0);
  const createReservationMutation = useCreateReservation(selectedApartmentIdNum);

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
    if (activeDateField === "ARRIVAL") setArrivalAt(value);
    if (activeDateField === "DEPARTURE") setDepartureAt(value);
    closeDateDialog();
  };

  const handleDailyStayToggle = (value: boolean) => {
    setDailyStay(value);
    if (value) setDepartureAt(null);
  };

  const openCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (res.canceled) return;
    const uri = res.assets?.[0]?.uri;
    if (uri) setDocumentUri(uri);
  };

  const resetForm = () => {
    setGuestType("DOMACI");
    setGuestName("");
    setPhone("");
    setDailyStay(false);
    setArrivalAt(null);
    setDepartureAt(null);
    setGuestsCount(1);
    setPrice("");
    setNote("");
    setDocumentUri(null);
    setErrors({});
    setPreviewVisible(false);
  };

  const buildFormData = (): FormData => {
    const data = new FormData();

    data.append("guestFullName", guestName.trim());
    data.append("guestPhoneNumber", phone.trim());
    data.append("dateTimeOfArrival", arrivalAt ? arrivalAt.toISOString() : "");
    data.append(
      "dateTimeOfDeparture",
      dailyStay ? "" : departureAt ? departureAt.toISOString() : ""
    );
    data.append("guestNumber", String(guestsCount));
    data.append("reservationType", guestType);

    if (price.trim()) data.append("price", String(Number(price)));
    if (note.trim()) data.append("note", note.trim());

    if (documentUri) {
      data.append(
        "personalDocument",
        {
          uri: documentUri,
          name: `document_${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any
      );
    }

    return data;
  };

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};

    if (!guestName.trim()) nextErrors.guestName = "Obavezno polje.";
    if (!phone.trim()) nextErrors.phone = "Obavezno polje.";
    if (!arrivalAt) nextErrors.arrivalAt = "Izaberite datum i vrijeme dolaska.";

    if (!dailyStay) {
      if (!departureAt)
        nextErrors.departureAt = "Izaberite datum i vrijeme odlaska.";
      if (arrivalAt && departureAt && arrivalAt >= departureAt)
        nextErrors.departureAt = "Odlazak mora biti nakon dolaska.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = buildFormData();

    createReservationMutation.mutate(formData, {
      onSuccess: () => {
        resetForm();
      },
    });
  };

  const documentRow = (
    <View>
      <View style={styles.inlineRow}>
        <Label text="Lični dokument gosta" size="md" />
        <Pressable style={styles.cameraBtn} onPress={openCamera}>
          <Icon name="Camera" size={22} color={Colors.textLight} />
        </Pressable>
      </View>

      {documentUri && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "#fff",
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
              backgroundColor: "#fff",
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
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textLight }}>Učitavanje apartmana...</Text>
      </View>
    );
  }

  if (apartmentsError || apartments.length === 0) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center", padding: 20 }]}>
        <Icon name="AlertCircle" size={48} color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.textPrimary, fontSize: 16, textAlign: "center" }}>
          {apartmentsError ? "Greška pri učitavanju apartmana." : "Nema dostupnih apartmana."}
        </Text>
      </View>
    );
  }

  if (!selectedApartment) {
    return null;
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
          guestTypeRow={
            <View style={styles.radioRow}>
              {["DOMACI", "STRANI"].map((t) => (
                <Pressable
                  key={t}
                  style={styles.radioOption}
                  onPress={() => setGuestType(t as GuestType)}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      guestType === t && styles.radioOuterActive,
                    ]}
                  >
                    {guestType === t && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioText}>
                    {t === "DOMACI" ? "Domaći gost" : "Strani gost"}
                  </Text>
                </Pressable>
              ))}
            </View>
          }
          guestNameField={
            <LabeledTextField
              label="Ime i prezime"
              value={guestName}
              onChangeText={setGuestName}
              errorText={errors.guestName}
            />
          }
          phoneField={
            <LabeledTextField
              label="Broj telefona"
              value={phone}
              onChangeText={setPhone}
              errorText={errors.phone}
            />
          }
          dailyStayToggleRow={
            <View style={styles.toggleRow}>
              <Label text="Dnevni boravak" size="md" />
              <ToggleItem
                title=""
                initialValue={false}
                onValueChange={handleDailyStayToggle}
              />
            </View>
          }
          arrivalField={
            <Pressable onPress={() => openDateDialog("ARRIVAL")}>
              <View pointerEvents="none">
                <LabeledTextField
                  label="Datum i vrijeme dolaska"
                  value={arrivalAt ? formatDateTimeLabel(arrivalAt) : ""}
                  iconName="Calendar"
                  iconLocation="right"
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
                  label="Datum i vrijeme odlaska"
                  value={
                    dailyStay
                      ? ""
                      : departureAt
                      ? formatDateTimeLabel(departureAt)
                      : ""
                  }
                  iconName="Calendar"
                  iconLocation="right"
                  errorText={errors.departureAt}
                />
              </View>
            </Pressable>
          }
          guestsCounterRow={
            <View style={styles.inlineRow}>
              <Label text="Broj gostiju" size="md" />
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
              <Label text="Cijena" size="md" />
              <View style={styles.priceInputWrap}>
                <TextField
                  inputProps={{
                    value: price,
                    onChangeText: setPrice,
                    keyboardType: "numeric",
                  }}
                />
                <Text style={styles.priceCurrency}>KM</Text>
              </View>
            </View>
          }
          noteField={
            <View style={styles.noteWrap}>
              <Label text="Napomena" size="md" />
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
              disabled={createReservationMutation.isPending}
              style={[
                styles.submitBtn,
                submitPressed && styles.submitBtnPressed,
              ]}
            >
              <Text style={styles.submitBtnText}>
                {createReservationMutation.isPending
                  ? "Čuvanje..."
                  : "Sačuvaj rezervaciju"}
              </Text>
            </TouchableOpacity>
          }
        />
      </View>

      <DateTimeDialog
        visible={dateDialogVisible}
        initialValue={activeDateField === "ARRIVAL" ? arrivalAt : departureAt}
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