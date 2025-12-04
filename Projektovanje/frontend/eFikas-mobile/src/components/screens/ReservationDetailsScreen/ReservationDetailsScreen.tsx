import { ScrollView, View, ScrollViewProps } from 'react-native';
import ReservationDetailsTemplate from "@/src/components/templates/ReservationDetailsTemplate/ReservationDetailsTemplate";
import ApartmentCard from "@/src/components/organisms/ApartmentCard/ApartmentCard";
import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
import DescriptionBox from "@/src/components/atoms/DescriptionBox/DescriptionBox";
import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Label } from "@/src/components/atoms/Label/Label";
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
        <ReservationDetailsTemplate
            headerCard={
                <ApartmentCard
                    title={reservation.apartment.title}
                    subtitle={reservation.apartment.subtitle}
                    imageUrl={reservation.apartment.imageUrl}
                    status={reservation.apartment.status}
                    statusUntil={reservation.apartment.statusUntil}
                    nextGuestsDate={reservation.apartment.nextGuestsDate}
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
    );
};

export default ReservationDetailsScreen;
