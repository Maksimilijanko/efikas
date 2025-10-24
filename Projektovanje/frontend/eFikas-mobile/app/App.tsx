import { Stack } from "expo-router";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';



export default function App() {
    return(
        <GluestackUIProvider>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen name="+not-found" options={{}} />
            </Stack>
        </GluestackUIProvider>
        
    );
}