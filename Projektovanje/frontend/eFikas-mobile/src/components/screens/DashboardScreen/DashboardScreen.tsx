import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { dashboardService } from "@/src/api/services/dashboardService";
import DashboardTemplate from "@/src/components/templates/DashboardTemplate/DashboardTemplate";
import { StatChart } from "@/src/components/organisms/StatChart/StatChart";
import { IconCard } from "@/src/components/molecules/IconCard/IconCard";
import { Label } from "@/src/components/atoms/Label/Label";
import { ReservationsCalendar } from "@/src/components/atoms/ReservationsCalendar/ReservationsCalendar";
import { Colors } from "@/src/styles/style";
import { ApartmentsButton } from "@/src/components/atoms/ApartmentsButton/ApartmentsButton";
import { SectionHeader } from "@/src/components/molecules/SectionHeader/SectionHeader";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [statistics, setStatistics] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await dashboardService.getDashboardData();

        setFullName(data.fullName);
        setStatistics(data.statistics.data);
        setReservations(data.reservations);
      } catch (error) {
        console.log("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // --- Navigation handlers ---
  function goToReservations() {
    router.push("/reservations");
  }
  function goToExpenses() {
    router.push("/expenses");
  }
  function goToTasks() {
    router.push("/tasks");
  }
  function goToDamages() {
    router.push("/damages");
  }
  function goToApartments() {
    router.push("/apartments");
  }
  function goToAnalytics() {
    router.push("/analytics");
  }

  if (loading) {
    return (
      <Text style={{ marginTop: 40, textAlign: "center" }}>
        Učitavanje...
      </Text>
    );
  }

  return (
    <DashboardTemplate
      headerLeft={
        <View>
          <Label 
            text="ZDRAVO,"
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
          title="Rezervacije" 
          onPress={goToReservations}
        />
      }
      calendar={
        <ReservationsCalendar reservations={reservations} />
      }
      shortcuts={[
        <IconCard
          key="1"
          label="Troškovi"
          iconName="Wallet"
          color={Colors.primary}
          onPress={goToExpenses}
        />,
        <IconCard
          key="2"
          label="Zadaci"
          iconName="Wrench"
          color={Colors.primary}
          onPress={goToTasks}
        />,
        <IconCard
          key="3"
          label="Štete"
          iconName="BrushCleaning"
          color={Colors.primary}
          onPress={goToDamages}
        />,
      ]}
      statisticsHeader={
        <SectionHeader 
          title="Statistika" 
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
