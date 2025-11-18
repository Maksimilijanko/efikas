import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { OverlayProvider } from "@gluestack-ui/overlay";
import { Stack } from "expo-router";


export default function App() {
    
    return(
        <GluestackUIProvider >
            <OverlayProvider>
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
            </OverlayProvider>
        </GluestackUIProvider>
    );
}