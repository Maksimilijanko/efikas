import { View, Pressable, StyleSheet } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ReservationDetailsTemplate from "@/src/components/templates/ReservationDetailsTemplate/ReservationDetailsTemplate";
import ApartmentCard from "@/src/components/organisms/ApartmentCard/ApartmentCard";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import DescriptionBox from "@/src/components/atoms/DescriptionBox/DescriptionBox";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";
import { DocumentDialog } from "@/src/components/organisms/Dialogs/IdDocumentDialog/DocumentDialog";
import { EditDeleteDialog } from "@/src/components/organisms/Dialogs/EditDeleteDialog/EditDeleteDialog";
// import { Colors } from "@/src/styles/style";
import { useTranslation } from "react-i18next";
import { useTheme } from '@/src/providers/ThemeProvider';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const ReservationDetailsScreen = ({ reservation }) => {
    const { t } = useTranslation();
    const { Colors } = useTheme();
    const [isDocumentDialogVisible, setDocumentDialogVisible] = useState(false);
    const documentUrl = reservation.personalDocumentURL;
    const navigation = useNavigation();
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    // Header sa tri tackice i opcijom Delete
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={() => setIsDialogVisible(true)} style={{ paddingHorizontal: 8 }}>
            <Icon name="Ellipsis" size={24} color={Colors.textPrimary} />
          </Pressable>
        ),
      });
    }, [navigation, Colors.textPrimary]);

    const handleDelete = () => {
      console.log("Delete reservation"); 
      setIsDialogVisible(false);
      // TODO poziv za brisanje
    };
    
    const formatDateTime = (iso: string) => {
      if (!iso) return "";

      // "Europe/Sarajevo" je lokalna zona
      const local = dayjs.utc(iso).tz("Europe/Sarajevo");

      const dateStr = `${local.date().toString().padStart(2, "0")}.${(
        local.month() + 1
      )
        .toString()
        .padStart(2, "0")}.${local.year()}.`;
      const timeStr = `${local.hour().toString().padStart(2, "0")}:${local.minute()
        .toString()
        .padStart(2, "0")}`;

      return `${dateStr} ${timeStr}`;
    };
    
    const infoItems = [
        (
            <ApartmentFeatureCard
                label={reservation.guestFullName}
                icon={<Icon name="User" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                label={reservation.guestPhoneNumber}
                icon={<Icon name="Phone" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                label={t('reservations.details.peopleCount', { count: reservation.guestNumber })}
                icon={<Icon name="Users" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                label={t("reservations.details.document")}                
                icon={<Icon name="IdCard" size={22} color={Colors.primary} />}
                rightElement={<Icon name="ChevronRight" size={22} color={Colors.iconMenu} />}
                onPress={() => setDocumentDialogVisible(true)}
            />
        ),
        (
            <ApartmentFeatureCard
                label={formatDateTime(reservation.dateTimeOfArrival)}
                icon={<Icon name="CalendarArrowDown" size={22} color={Colors.primary} />}
            />
        ),   
        (
            <ApartmentFeatureCard
                label={formatDateTime(reservation.dateTimeOfDeparture)}
                icon={<Icon name="CalendarArrowUp" size={22} color={Colors.primary} />}
            />
        )
    ];

    return (
    <>
        <ReservationDetailsTemplate
            headerCard={
                <ApartmentCard
                    title={reservation.apartment.name}
                    subtitle={reservation.apartment.address}
                    imageUrl={reservation.apartment.imageUrl}   // TODO slika stana (reservation.apartment.pictures) 
                    onPress={() => console.log("Otvori stan")}
                />
            }
            infoItems={
                infoItems
            }
            noteHeader={
                <Label 
                    text={t("reservations.details.note")}
                    align="left"
                    size="xl"
                    color={Colors.textPrimary}
                />
            }
            noteBody={
                <DescriptionBox size="lg" />
            }
            primaryAction={
                <BasicButton title={t("reservations.details.button")} onPress={() => console.log("print")} />
            }
        />
        <DocumentDialog
            visible={isDocumentDialogVisible}
            documentUrl={documentUrl}
            onClose={() => setDocumentDialogVisible(false)}
        />
         <EditDeleteDialog
            visible={isDialogVisible}
            onClose={() => setIsDialogVisible(false)}
            onEdit={() => {}}
            onDelete={handleDelete}
            showDelete={true}
            deleteText={t("reservations.details.deleteText")}
        />
    </>
    );
}

export default ReservationDetailsScreen;