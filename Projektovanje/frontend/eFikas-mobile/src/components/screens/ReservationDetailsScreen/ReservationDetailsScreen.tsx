import { Pressable } from "react-native";
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper funkcije
const formatDateTime = (iso: string) => {
  if (!iso) return "";
  const local = dayjs.utc(iso).tz("Europe/Sarajevo");
  return local.format("DD.MM.YYYY HH:mm");
};

const calculateNights = (arrivalDate: string, departureDate: string) => {
  const arrival = dayjs(arrivalDate);
  const departure = dayjs(departureDate);
  return Math.max(1, departure.diff(arrival, "day"));
};

const ReservationDetailsScreen = ({ reservation }) => {
  const { t } = useTranslation();
  const { Colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

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

  const handleFiscalizationConfirm = () => {
    // Logika za fikalizaciju... TODO
    console.log("Fiskalizacija potvrđena");
    toggleDialog("fiscalization", false);
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
        label: reservation.guestFullName,
        icon: "User" as const,
      },
      {
        key: "phone",
        label: reservation.guestPhoneNumber,
        icon: "Phone" as const,
      },
      {
        key: "people",
        label: t("reservations.details.peopleCount", {
          count: reservation.guestNumber,
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
        label: formatDateTime(reservation.dateTimeOfArrival),
        icon: "CalendarArrowDown" as const,
      },
      {
        key: "departure",
        label: formatDateTime(reservation.dateTimeOfDeparture),
        icon: "CalendarArrowUp" as const,
      },
    ],
    [
      reservation.guestFullName,
      reservation.guestPhoneNumber,
      reservation.guestNumber,
      reservation.dateTimeOfArrival,
      reservation.dateTimeOfDeparture,
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
        documentUrl: reservation.personalDocumentURL,
      },
      editDelete: {
        visible: dialogs.editDelete,
        onClose: () => toggleDialog("editDelete", false),
        onEdit: () => {
          toggleDialog("editDelete", false);
          // router.push("/(tabs)/reservations")   // TODO: otvaranje sceen-a za dodavanje rezervacije
        },
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
            value: reservation.guestNumber,
            isBold: true,
          },
          {
            label: t("reservations.details.fiscalization.nightsCount"),
            value: calculateNights(
              reservation.dateTimeOfArrival,
              reservation.dateTimeOfDeparture
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
      reservation.personalDocumentURL,
      reservation.reservationType,
      reservation.guestNumber,
      reservation.dateTimeOfArrival,
      reservation.dateTimeOfDeparture,
      reservation.price,
      t,
      handleDelete,
      handleFiscalizationConfirm,
    ]
  );

  return (
    <>
      <ReservationDetailsTemplate
        headerCard={
          <ApartmentCard
            title={reservation.apartment.name}
            subtitle={reservation.apartment.address}
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
