import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { OverlayProvider } from "@gluestack-ui/overlay";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient()
export default function App() {
    
    return(
        <GluestackUIProvider >
            <OverlayProvider>
                <QueryClientProvider client={queryClient}>
                    <Stack>
                        {/* Not logged in -> show auth flow */}
                        <Stack.Screen
                            name="(auth)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        {/* Authenticated users go to (tabs) */}
                        <Stack.Screen
                            name="(tabs)"
                            options={{
                                headerShown: false,
                            }}
                        />

                        <Stack.Screen name="+not-found" options={{}} />
                    </Stack>
                    {/* Toast component for messages */}
                    <Toast />
                </QueryClientProvider>
            </OverlayProvider>
        </GluestackUIProvider>
    );
}