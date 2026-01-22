import { useTheme } from "@/src/providers/ThemeProvider";
import { Stack } from "expo-router";
import { t } from "i18next";

export default function AuthRootLayout() {
	const { Colors } = useTheme();

    return(
        <Stack screenOptions={{ 
			headerShown: false, 
			headerTintColor: Colors.textPrimary,
			headerStyle: {
                backgroundColor: Colors.tabBackground,
            }, 
		}}>
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Prijava'}} />
			<Stack.Screen name="forgotPassword" options={{ headerShown: true, title: t('auth.forgotPassword.headerTitle')}} />
        </Stack>
    );
}