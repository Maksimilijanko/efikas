import { Stack } from "expo-router";

export default function AuthRootLayout() {
    return(
        <Stack>
            <Stack.Screen name="auth" options={{ headerShown: false, title: 'Prijava'}} />
        </Stack>
    );
}