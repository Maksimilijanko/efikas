// import { useEffect, useState } from "react";
// import { Text, View, ActivityIndicator } from "react-native";
// import { router } from "expo-router";
// import { dashboardService } from "@/src/api/services/dashboardService";
// import DashboardTemplate from "@/src/components/templates/DashboardTemplate/DashboardTemplate";
// import { StatChart } from "@/src/components/organisms/StatChart/StatChart";
// import { IconCard } from "@/src/components/molecules/IconCard/IconCard";
// import { Label } from "@/src/components/atoms/Label/Label";
// import { ReservationsCalendar } from "@/src/components/atoms/ReservationsCalendar/ReservationsCalendar";
// // import { Colors } from "@/src/styles/style";
// import { ApartmentsButton } from "@/src/components/atoms/ApartmentsButton/ApartmentsButton";
// import { SectionHeader } from "@/src/components/molecules/SectionHeader/SectionHeader";
// import { useTranslation } from "react-i18next";
// import { useTheme } from "@/src/providers/ThemeProvider";

// export default function DashboardScreen() {
//   const { Colors } = useTheme();
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(true);
//   const [fullName, setFullName] = useState("");
//   const [statistics, setStatistics] = useState([]);
//   const [reservations, setReservations] = useState([]);

//   useEffect(() => {
//     async function loadDashboard() {
//       try {
//         const data = await dashboardService.getDashboardData();

//         setFullName(data.fullName);
//         setStatistics(data.statistics.data);
//         setReservations(data.reservations);
//       } catch (error) {
//         console.log("Dashboard load error:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadDashboard();
//   }, []);

//   // --- Navigation handlers ---
//   function goToReservations() {
//     router.push("/(tabs)/reservations");
//   }
//   function goToExpenses() {
//     router.push("/(home)/expenses");
//   }
//   function goToTasks() {
//     router.push("/(home)/tasks");
//   }
//   function goToDamages() {
//     router.push("/(home)/damages");
//   }
//   function goToApartments() {
//     router.push("/(home)/apartments");
//   }
//   function goToAnalytics() {
//     router.push("/(home)/analytics");
//   }

//   if (loading) {
//     return (
//       // <Text style={{ marginTop: 40, textAlign: "center" }}>
//       //   {t("dashboard.loading")}
//       // </Text>
//       <View style={{ marginTop: 80, alignItems: "center" }}>
//         <ActivityIndicator size="large" color={Colors.tertiary} />
//       </View>
//     );
//   }

//   return (
//     <DashboardTemplate
//       headerLeft={
//         <View>
//           <Label 
//             text={t("dashboard.greeting").toUpperCase()}
//             align="left"
//             size="xl"
//             color={Colors.tertiary}
//             className="font-semibold"
//           />
//           <Label
//             text={fullName.toUpperCase()}
//             align="left"
//             size="xl"
//             color={Colors.textPrimary}
//             className="font-semibold"
//           />
//         </View>
//       }
//       headerRight={<ApartmentsButton onPress={goToApartments} />}
//       reservationsHeader={
//         <SectionHeader 
//           title={t("dashboard.sections.reservationsTitle")}
//           onPress={goToReservations}
//         />
//       }
//       calendar={
//         <ReservationsCalendar reservations={reservations} 
//           // onOpenDetails={(r) => router.push(`/(home)/reservations/${r.ReservationId}`)}
//         />
//       }
//       shortcuts={[
//         <IconCard
//           key="1"
//           label={t("dashboard.shortcuts.expenses")}
//           iconName="Wallet"
//           color={Colors.primary}
//           onPress={goToExpenses}
//           labelProps={{ color: Colors.textPrimary }}
//         />,
//         <IconCard
//           key="2"
//           label={t("dashboard.shortcuts.tasks")}
//           iconName="Wrench"
//           color={Colors.primary}
//           onPress={goToTasks}
//           labelProps={{ color: Colors.textPrimary }}
//         />,
//         <IconCard
//           key="3"
//           label={t("dashboard.shortcuts.damages")}
//           iconName="BrushCleaning"
//           color={Colors.primary}
//           onPress={goToDamages}
//           labelProps={{ color: Colors.textPrimary }}
//         />,
//       ]}
//       statisticsHeader={
//         <SectionHeader 
//           title={t("dashboard.sections.statisticsTitle")}
//           onPress={goToAnalytics}
//         />
//       }
//       statisticsCard={
//         <StatChart
//           title=""
//           data={statistics}
//         />
//       }
//     />
//   );
// }



import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import DashboardTemplate from "@/src/components/templates/DashboardTemplate/DashboardTemplate";
import { StatChart } from "@/src/components/organisms/StatChart/StatChart";
import { IconCard } from "@/src/components/molecules/IconCard/IconCard";
import { Label } from "@/src/components/atoms/Label/Label";
import { ReservationsCalendar } from "@/src/components/atoms/ReservationsCalendar/ReservationsCalendar";
import { ApartmentsButton } from "@/src/components/atoms/ApartmentsButton/ApartmentsButton";
import { SectionHeader } from "@/src/components/molecules/SectionHeader/SectionHeader";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useUserReservations } from "@/src/hooks/useUserReservations";
import { useDashboardStats } from "@/src/hooks/useDashboardStats";
import { useProfile } from "@/src/hooks/useProfile";

export default function DashboardScreen() {
  const { Colors } = useTheme();
  const { t } = useTranslation();

  // --- Fetch podataka preko odvojenih hookova ---
  const userQuery = useProfile();
  const reservationsQuery = useUserReservations();
  const statsQuery = useDashboardStats();

  // Navigacija
  const goToReservations = () => router.push("/(tabs)/reservations");
  const goToExpenses = () => router.push("/(home)/expenses");
  const goToTasks = () => router.push("/(home)/tasks");
  const goToDamages = () => router.push("/(home)/damages");
  const goToApartments = () => router.push("/(home)/apartments");
  const goToAnalytics = () => router.push("/(home)/analytics");

  const loading =
    userQuery.isLoading || reservationsQuery.isLoading || statsQuery.isLoading;

  if (loading) {
    return (
      <View style={{ marginTop: 80, alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  }

  const fullName = `${userQuery.profile?.firstName ?? ""} ${userQuery.profile?.lastName ?? ""}`;
  const reservations = reservationsQuery.data ?? [];
  const statistics = statsQuery.data?.data ?? [];

  return (
    <DashboardTemplate
      headerLeft={
        <View>
          <Label
            text={t("dashboard.greeting").toUpperCase()}
            align="left"
            size="xl"
            color={Colors.tertiary}
            className="font-semibold"
          />
          <Label
            text={fullName.toUpperCase()}
            align="left"
            size="xl"
            color={Colors.textPrimary}
            className="font-semibold"
          />
        </View>
      }
      headerRight={<ApartmentsButton onPress={goToApartments} />}

      reservationsHeader={
        <SectionHeader
          title={t("dashboard.sections.reservationsTitle")}
          onPress={goToReservations}
        />
      }

      calendar={
        <ReservationsCalendar
          reservations={reservations}
          onOpenDetails={(r) =>
            router.push(`/(home)/reservations/${r.reservationId}`)
          }
        />
      }

      shortcuts={[
        <IconCard
          key="1"
          label={t("dashboard.shortcuts.expenses")}
          iconName="Wallet"
          color={Colors.primary}
          onPress={goToExpenses}
          labelProps={{ color: Colors.textPrimary }}
        />,
        <IconCard
          key="2"
          label={t("dashboard.shortcuts.tasks")}
          iconName="Wrench"
          color={Colors.primary}
          onPress={goToTasks}
          labelProps={{ color: Colors.textPrimary }}
        />,
        <IconCard
          key="3"
          label={t("dashboard.shortcuts.damages")}
          iconName="BrushCleaning"
          color={Colors.primary}
          onPress={goToDamages}
          labelProps={{ color: Colors.textPrimary }}
        />,
      ]}

      statisticsHeader={
        <SectionHeader
          title={t("dashboard.sections.statisticsTitle")}
          onPress={goToAnalytics}
        />
      }

      statisticsCard={
        <StatChart
          title=""
          data={statistics}
        />
      }
    />
  );
}
