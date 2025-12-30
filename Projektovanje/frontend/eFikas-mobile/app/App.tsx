import '@/global.css';
import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { useTheme } from '@/src/providers/ThemeProvider';
import { ToastConfig } from "@/src/util/ToastConfig";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient()
export default function App() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    
    return(
        <GluestackUIProvider mode={theme}>
            <OverlayProvider>
                <QueryClientProvider client={queryClient}>
                    <Stack >
                        {/* Not logged in -> show auth flow (komentarisano za sada za lak pristup meniju, inače radi :D ) */}
                        {/* <Stack.Screen
                            name="(auth)"
                            options={{
                                headerShown: false,
                            }}
                        /> */}

                        {/* Authenticated users go to (tabs) */}
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen
                            name="(menu)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen
                            name="(home)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen name="+not-found" options={{}} />
                    </Stack>
                    
                    {/* Toast component for messages */}
                    <Toast config={ToastConfig} />
                </QueryClientProvider>
            </OverlayProvider>
        </GluestackUIProvider>
    );
}