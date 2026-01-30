import { useState, useEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import ReservationDetailsTemplate from "@/src/components/templates/ReservationDetailsTemplate/ReservationDetailsTemplate";
import ApartmentCard from "@/src/components/organisms/ApartmentCard/ApartmentCard";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import DescriptionBox from "@/src/components/atoms/DescriptionBox/DescriptionBox";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";
import { IdDocumentDialog } from "@/src/components/organisms/Dialogs/IdDocumentDialog/IdDocumentDialog";
import { EditDeleteDialog } from "@/src/components/organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
import { QuickInfoDialog } from "../../organisms/Dialogs/QuickInfoDialog/QuickInfoDialog";
import { MessageDialog } from "@/src/components/organisms/Dialogs/MessageDialog/MessageDialog";
import { useRouter } from "expo-router";
import { useDeleteReservation } from "@/src/hooks/useReservation";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useProfile } from "@/src/hooks/useProfile"; 
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { calculateNights } from "@/src/util/dateUtils";
import { dateService } from "@/src/services/dateService";
import { Pressable, Alert } from "react-native";
import { API_URLS } from "@/src/util/apiConstants";

dayjs.extend(utc);
dayjs.extend(timezone);


const ReservationDetailsScreen = ({ reservation }) => {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const { profile } = useProfile();

  // -------------------- Dialog state --------------------
  const [dialogs, setDialogs] = useState({
    idDocument: false,
    editDelete: false,
    deleteConfirm: false,
    fiscalization: false,
  });

  const toggleDialog = (dialogName: keyof typeof dialogs, value: boolean) => {
    setDialogs((prev) => ({ ...prev, [dialogName]: value }));
  };

  const deleteMutation = useDeleteReservation(
    reservation.reservationId,
    reservation.apartment.apartmentId
  );

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
      toggleDialog("deleteConfirm", false);
      toggleDialog("editDelete", false);
      router.back();
    } catch (err) {
      console.log("Greška pri brisanju:", err);
    }
  };

  const handleEdit = () => {
    toggleDialog("editDelete", false);
    
    router.replace({
      pathname: "/(home)/reservations/addReservation",
      params: {
        mode: "edit",
        reservationId: reservation.reservationId,
        reservationData: JSON.stringify(reservation),
      },
    });
  };

  // const handleFiscalizationConfirm = () => {
  //   // Logika za fikalizaciju... TODO
  //   console.log("Fiskalizacija potvrđena");
  //   toggleDialog("fiscalization", false);
  // };

  const handleFiscalizationConfirm = async () => {
    toggleDialog("fiscalization", false);
  
    const IP_ADRESA = API_URLS.cash_register.ip_address; 
    const PORT = API_URLS.cash_register.port;                 
    const API_TOKEN = API_URLS.cash_register.api_token;           
    const URL = `http://${IP_ADRESA}:${PORT}/api/invoices`;

    const nights = calculateNights(
      reservation.guest.dateTimeOfArrival,
      reservation.guest.dateTimeOfDeparture
    );

    const cashierName = profile 
        ? `${profile.name} ${profile.surname}` 
        : "Prodavac 1";

    const totalPrice = reservation.price || 0;
    const unitPrice = nights > 0 ? totalPrice / nights : totalPrice;
    
    const uniqueRequestId = Date.now().toString();

    const payload = {
      invoiceRequest: {
        invoiceType: "Normal",
        businessName: "eFikas",
        transactionType: "Sale",
        cashier: cashierName,
        payment: [
          {
            amount: totalPrice.toFixed(2),
            paymentType: "Cash",
          },
        ],
        items: [
          {
            name: `Nocenje "${reservation.apartment.name}"`,
            gtin: "5449000131805", 
            quantity: nights,
            unitPrice: unitPrice.toFixed(2), 
            totalAmount: totalPrice.toFixed(2), 
            labels: ["B"],
          },
        ],
      },
    };

    console.log("Šaljem na fiskalnu:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`,
          "RequestId": uniqueRequestId,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Uspješna fiskalizacija:", data);

        Alert.alert(
          t("reservations.details.fiscalization.successTitle"),
          `${t("reservations.details.fiscalization.successMessage")}\n${t("reservations.details.fiscalization.invoiceNumber")}: ${data.invoiceNumber || "N/A"}`,
          [
            {
              text: t("reservations.details.fiscalization.fiscalizationButton"),
              onPress: () => toggleDialog("fiscalization", false),
            },
          ]
        );
        
        
      } else {
        const errorText = await response.text();
        console.error("Greška s kase:", errorText);
        Alert.alert(
            t("reservations.toastMessages.genericError"), 
            `Status: ${response.status}\n${errorText}`
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert(
        t("reservations.details.fiscalization.errorTitle"),
        t("reservations.details.fiscalization.errorMessage")
      );
    }
  };

  // header - tri tackice
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => toggleDialog("editDelete", true)}
          style={{ paddingHorizontal: 8 }}
        >
          <Icon name="Ellipsis" size={24} color={Colors.textPrimary} />
        </Pressable>
      ),
    });
  }, [navigation, Colors.textPrimary]);

  // Memoizacija INFO_ITEMS
  const INFO_ITEMS = useMemo(
    () => [
      {
        key: "guest",
        label: `${reservation.guest.name} ${reservation.guest.surname}`,
        icon: "User" as const,
      },
      {
        key: "phone",
        label: reservation.guest.phoneNumber,
        icon: "Phone" as const,
      },
      {
        key: "people",
        label: t("reservations.details.peopleCount", {
          count: reservation.guestQuantity,
        }),
        icon: "Users" as const,
      },
      {
        key: "document",
        label: t("reservations.details.document"),
        icon: "IdCard" as const,
        rightElement: (
          <Icon name="ChevronRight" size={22} color={Colors.iconMenu} />
        ),
        onPress: () => toggleDialog("idDocument", true),
      },
      {
        key: "arrival",
        label: dateService.formatLocalDateTime(reservation.guest.dateTimeOfArrival),
        icon: "CalendarArrowDown" as const,
      },
      {
        key: "departure",
        label: dateService.formatLocalDateTime(reservation.guest.dateTimeOfDeparture),
        icon: "CalendarArrowUp" as const,
      },
    ],
    [
      reservation.guest.name,
      reservation.guest.surname,
      reservation.guest.phoneNumber,
      reservation.guestQuantity,
      reservation.guest.dateTimeOfArrival,
      reservation.guest.dateTimeOfDeparture,
      Colors.iconMenu,
      t,
    ]
  );

  // wrap-ovano sa useMemo
  const infoItems = useMemo(
    () =>
      INFO_ITEMS.map((item) => (
        <ApartmentFeatureCard
          key={item.key}
          label={item.label}
          icon={<Icon name={item.icon} size={22} color={Colors.primary} />}
          rightElement={item.rightElement}
          onPress={item.onPress}
        />
      )),
    [INFO_ITEMS, Colors.primary]
  );

  // wrap-ovano sa useMemo
  const dialogConfigs = useMemo(
    () => ({
      idDocument: {
        visible: dialogs.idDocument,
        onClose: () => toggleDialog("idDocument", false),
        documentUrl: reservation.guest.personalDocumentURL,
      },
      editDelete: {
        visible: dialogs.editDelete,
        onClose: () => toggleDialog("editDelete", false),
        onEdit: handleEdit,
        onDelete: () => {
          toggleDialog("editDelete", false);
          toggleDialog("deleteConfirm", true);
        },
        showDelete: true,
        deleteText: t("reservations.details.deleteText"),
      },
      deleteConfirm: {
        visible: dialogs.deleteConfirm,
        title: t("reservations.details.deleteConfirm.title"),
        description: t("reservations.details.deleteConfirm.description"),
        primaryText: t("reservations.details.deleteConfirm.confirm"),
        secondaryText: t("reservations.details.deleteConfirm.cancel"),
        onPrimary: handleDelete,
        onSecondary: () => toggleDialog("deleteConfirm", false),
        onRequestClose: () => toggleDialog("deleteConfirm", false),
      },
      fiscalization: {
        visible: dialogs.fiscalization,
        onClose: () => toggleDialog("fiscalization", false),
        title: t("reservations.details.fiscalization.title"),
        items: [
          {
            label: t("reservations.details.fiscalization.reservationType"),
            value: reservation.reservationType,
            isBold: true,
          },
          {
            label: t("reservations.details.fiscalization.peopleCount"),
            value: reservation.guestQuantity,
            isBold: true,
          },
          {
            label: t("reservations.details.fiscalization.nightsCount"),
            value: calculateNights(
              reservation.guest.dateTimeOfArrival,
              reservation.guest.dateTimeOfDeparture
            ),
            isBold: true,
          },
          {
            label: t("reservations.details.fiscalization.amount"),
            value: reservation.price
              ? `${reservation.price.toFixed(2)} ${t(
                  "reservationsCalendar.currency"
                )}`
              : "N/A",
            isBold: true,
            marginTop: 12,
          },
        ],
        buttons: [
          {
            title: t("reservations.details.fiscalization.button.confirmButton"),
            onPress: handleFiscalizationConfirm,
          },
          {
            title: t("reservations.details.fiscalization.button.cancelButton"),
            onPress: () => toggleDialog("fiscalization", false),
          },
        ],
      },
    }),
    [
      dialogs,
      reservation.guest.personalDocumentURL,
      reservation.reservationType,
      reservation.guestQuantity,
      reservation.guest.dateTimeOfArrival,
      reservation.guest.dateTimeOfDeparture,
      reservation.price,
      t,
      handleDelete,
      handleEdit,
      handleFiscalizationConfirm,
    ]
  );

  return (
    <>
      <ReservationDetailsTemplate
        headerCard={
          <ApartmentCard
            name={reservation.apartment.name}
            address={reservation.apartment.address}
            imageUrl={reservation.apartment.pictures?.[0] ?? undefined}
            onPress={() => console.log("...")}
            showArrow={false}
          />
        }
        infoItems={infoItems}
        noteHeader={
          <Label
            text={t("reservations.details.note")}
            align="left"
            size="xl"
            color={Colors.textPrimary}
          />
        }
        noteBody={
          <DescriptionBox
            size="lg"
            placeholder={reservation.note ?? ""}
            isReadOnly
          />
        }
        primaryAction={
          <BasicButton
            title={t("reservations.details.button")}
            onPress={() => toggleDialog("fiscalization", true)}
          />
        }
      />

      {/* Svi dialozi na ekranu */}
      <IdDocumentDialog {...dialogConfigs.idDocument} />

      <EditDeleteDialog {...dialogConfigs.editDelete} />

      <MessageDialog {...dialogConfigs.deleteConfirm} />

      <QuickInfoDialog {...dialogConfigs.fiscalization} />
    </>
  );
};

export default ReservationDetailsScreen;
