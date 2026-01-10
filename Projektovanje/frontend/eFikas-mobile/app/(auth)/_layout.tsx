import { Stack } from "expo-router";

export default function AuthRootLayout() {
    return(
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Prijava'}} />
			<Stack.Screen name="forgotPassword" options={{ headerShown: true, title: 'Zaboravljena lozinka'}} />
        </Stack>
    );
}