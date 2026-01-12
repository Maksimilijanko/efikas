import { Stack } from "expo-router";
import { t } from "i18next";

export default function AuthRootLayout() {
    return(
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Prijava'}} />
			<Stack.Screen name="forgotPassword" options={{ headerShown: true, title: t('auth.forgotPassword.headerTitle')}} />
        </Stack>
    );
}