import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";



export default function App() {
    return(
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <GluestackUIProvider >
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
            </GestureHandlerRootView>
        </SafeAreaProvider>
        
        
        
    );
}