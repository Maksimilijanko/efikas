import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function MenuRootLayout() {
    const { t } = useTranslation();

    return (
        <Stack screenOptions={{ headerShown: true }}>
            {/* ========================================== SEKCIJA PROFIL ========================================== */}
            <Stack.Screen name="(profile)/profile" options={{ title: t('menu.stackNavigation.profile') }} />
            <Stack.Screen name="(profile)/notifications" options={{ title: t('menu.stackNavigation.notifications') }} />
            <Stack.Screen name="(profile)/myApartments" options={{ title: t('menu.stackNavigation.myApartments') }} />


            {/* ========================================== SEKCIJA RACUNOVODSTVO ========================================== */}
            <Stack.Screen name="(bookkeeping)/expenses" options={{ title: t('menu.stackNavigation.expenses') }} />
            <Stack.Screen name="(bookkeeping)/statistics" options={{ title: t('menu.stackNavigation.statistics') }} />
            <Stack.Screen name="(bookkeeping)/incomeBook" options={{ title: t('menu.stackNavigation.incomeBook') }} />
            <Stack.Screen name="(bookkeeping)/expensesBook" options={{ title: t('menu.stackNavigation.expensesBook') }} />
            <Stack.Screen name="(bookkeeping)/guestBook" options={{ title: t('menu.stackNavigation.guestBook') }} />


            {/* ========================================== SEKCIJA PODEŠAVANJA ========================================== */}
            <Stack.Screen name="(mainSettings)/(settings)/index" options={{ title: t('menu.stackNavigation.settingsMain') }} />
            <Stack.Screen name="(mainSettings)/(settings)/language" options={{ title: t('menu.stackNavigation.language') }} />
            <Stack.Screen name="(mainSettings)/(settings)/theme" options={{ title: t('menu.stackNavigation.theme') }} />
            <Stack.Screen name="(mainSettings)/(settings)/bugReport" options={{ title: t('menu.stackNavigation.bugReport') }} />
            <Stack.Screen name="(mainSettings)/aboutApp" options={{ title: t('menu.stackNavigation.aboutApp') }} />
        </Stack>
    );
}