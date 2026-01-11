import { useTheme } from "@/src/providers/ThemeProvider";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function MenuRootLayout() {
    const { t } = useTranslation();
    const { Colors } = useTheme();

    return (
        <Stack screenOptions={{ 
            headerShown: true,
            headerTintColor: Colors.textPrimary,
            headerStyle: {
                backgroundColor: Colors.tabBackground, // Set your desired background color here
            },
        }} >
            {/* ========================================== SEKCIJA PROFIL ========================================== */}
            <Stack.Screen name="(profile)/profile" options={{ title: t('menu.stackNavigation.profile') }} />
            <Stack.Screen name="(profile)/notifications" options={{ title: t('menu.stackNavigation.notifications') }} />
            <Stack.Screen name="(profile)/myApartments" options={{ title: t('menu.stackNavigation.myApartments') }} />
            <Stack.Screen name="(profile)/addApartment" options={{ title: t('menu.stackNavigation.addApartment') }} />
            <Stack.Screen name="(profile)/chosenApartment" />

            {/* ========================================== SEKCIJA RACUNOVODSTVO ========================================== */}
            <Stack.Screen name="(bookkeeping)/expenses" options={{ title: t('menu.stackNavigation.expenses') }} />
            <Stack.Screen name="(bookkeeping)/statistics" options={{ title: t('menu.stackNavigation.statistics') }} />
            <Stack.Screen name="(bookkeeping)/incomeBook" options={{ title: t('menu.stackNavigation.incomeBook') }} />
            <Stack.Screen name="(bookkeeping)/expensesBook" options={{ title: t('menu.stackNavigation.expensesBook') }} />
            <Stack.Screen name="(bookkeeping)/guestBook" options={{ title: t('menu.stackNavigation.guestBook') }} />
            <Stack.Screen name="(bookkeeping)/pdfView" options={{ title: t('menu.stackNavigation.pdfView') }} />


            {/* ========================================== SEKCIJA PODEŠAVANJA ========================================== */}
            <Stack.Screen name="(mainSettings)/settings" options={{ title: t('menu.stackNavigation.settingsMain') }} />
            <Stack.Screen name="(mainSettings)/aboutApp" options={{ title: t('menu.stackNavigation.aboutApp') }} />
        </Stack>
    );
}