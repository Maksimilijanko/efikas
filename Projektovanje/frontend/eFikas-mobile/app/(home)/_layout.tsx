import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeRootLayout() {
    const { t } = useTranslation();

    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="apartments" options={{ title: t('dashboard.navigation.apartmentsTitle') }} />
            <Stack.Screen name="reservations" options={{ title: t('dashboard.navigation.reservationsTitle') }} />
            <Stack.Screen name="expenses" options={{ title: t('dashboard.navigation.expensesTitle') }} />
            <Stack.Screen name="tasks" options={{ title: t('dashboard.navigation.tasksTitle') }} />
            <Stack.Screen name="damages" options={{ title: t('dashboard.navigation.damagesTitle') }} />
            <Stack.Screen name="analytics" options={{ title: t('dashboard.navigation.statisticsTitle') }} /> {/* Ista ruta kao meni/statistika? */}
        </Stack>
    );
}