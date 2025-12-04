// import React from "react";
// import { View } from "react-native";
// import ReservationDetailsTemplate from "@/src/components/templates/ReservationDetailsTemplate/ReservationDetailsTemplate";
// import ApartmentCard from "@/src/components/organisms/ApartmentCard/ApartmentCard";
// import ApartmentFeatureCard from "@/src/components/molecules/ApartmentFeatureCard/ApartmentFeatureCard";
// import DescriptionBox from "@/src/components/atoms/DescriptionBox/DescriptionBox";
// import { BasicButton } from "@/src/components/atoms/BasicButton/BasicButton";
// import { Icon } from "@/src/components/atoms/Icon/Icon";
// import { Label } from "@/src/components/atoms/Label/Label";
// import { Colors } from "@/src/styles/style";


// const ReservationDetailsScreen = () => {

//     // --- INFO ITEMS ---
//     const infoItems = [
//         (
//             <ApartmentFeatureCard
//                 label="Janko Janković"
//                 icon={<Icon name="User" size={22} color={Colors.primary} />}
//             />
//         ),
//         (
//             <ApartmentFeatureCard
//                 label="066/123-123"
//                 icon={<Icon name="Phone" size={22} color={Colors.primary} />}
//             />
//         ),
//         (
//             <ApartmentFeatureCard
//                 label="3 osobe"
//                 icon={<Icon name="Users" size={22} color={Colors.primary} />}
//             />
//         ),
//         (
//             <ApartmentFeatureCard
//                 label="Dokument"
//                 icon={<Icon name="IdCard" size={22} color={Colors.primary} />}
//                 rightElement={<Icon name="ChevronRight" size={22} color={Colors.iconMenu} />}
//             />
//         ),
//         (
//             <ApartmentFeatureCard
//                 label="05.01.2025. 13:30"
//                 icon={<Icon name="CalendarArrowDown" size={22} color={Colors.primary} />}
//             />
//         ),
//         (
//             <ApartmentFeatureCard
//                 label="29.02.2025. 22:25"
//                 icon={<Icon name="CalendarArrowUp" size={22} color={Colors.primary} />}
//             />
//         )
//     ];


//     return (
//         <ReservationDetailsTemplate
//             // --- GORNJA KARTICA ---
//             headerCard={
//                 <ApartmentCard
//                     title="Stan Centar"
//                     subtitle="Jevrejska 14A"
//                     imageUrl="https://picsum.photos/300/300"
//                     status={true}
//                     statusUntil="08.01.2025."
//                     nextGuestsDate="10.01.2025."
//                     onPress={() => console.log("Otvori stan")}
//                 />
//             }

//             // --- INFO ---
//             infoItems={infoItems}

//             // --- NAPOMENA HEADER ---
//             noteHeader={
//                 <Label text="Napomena" className="font-semibold text-lg" />
//             }

//             // --- NAPOMENA BODY (textarea) ---
//             noteBody={
//                 <DescriptionBox size="lg" />
//             }

//             // --- DONJE DUGME ---
//             primaryAction={
//                 <BasicButton title="Štampaj račun" onPress={() => console.log("print")} />
//             }
//         />
//     );
// };

// export default ReservationDetailsScreen;



import React from "react";
import { View } from "react-native";
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

const ReservationDetailsScreen = ({ reservation }) => {
    const { t } = useTranslation();
    const { Colors } = useTheme();
    
    const infoItems = [
        (
            <ApartmentFeatureCard
                label={reservation.guestName}
                icon={<Icon name="User" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                label={reservation.phone}
                icon={<Icon name="Phone" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                // label={`${reservation.peopleCount} ${t("reservationDetails.person")}`}
                label={t('reservations.details.peopleCount', { count: reservation.peopleCount })}
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
                label={reservation.checkIn}
                icon={<Icon name="CalendarArrowDown" size={22} color={Colors.primary} />}
            />
        ),
        (
            <ApartmentFeatureCard
                label={reservation.checkOut}
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
