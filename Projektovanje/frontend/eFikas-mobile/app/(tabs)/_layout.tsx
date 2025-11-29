import { Icon } from "@/src/components/atoms/Icon/Icon";
import { useTheme } from "@/src/providers/ThemeProvider";
import { Tabs } from "expo-router";

import { useTranslation } from "react-i18next";


export default function TabsRootLayout() {
    const { t } = useTranslation();
    const { Colors } = useTheme();

    return(
        // Link ka ikonicama: https://icons.expo.fyi/Index
        <Tabs initialRouteName="index" screenOptions={{
            // --- In testing phase, can be left commented out for now... ---
            tabBarActiveTintColor: Colors.tabBarActiveTint,
            tabBarInactiveTintColor: Colors.tabBarInactiveTint,
            headerTintColor: Colors.textPrimary,
            headerStyle: {
                backgroundColor: Colors.tabBackground, // Desired background color here
            },
            sceneStyle: { backgroundColor: Colors.screenBackground },
            tabBarStyle: {
              backgroundColor: Colors.tabBackground // background color of tab bar
            }, 
        }}>
            <Tabs.Screen name="reservations" options={{
                title: t('tabs.reservations'),
                headerTitle: t('tabs.reservations'),
                tabBarIcon: ({ color }) => <Icon name="BookOpen" size={28} color={color} />,
                
            }} />
            <Tabs.Screen name="index" options={{
                title: t('tabs.home'),
                headerTitle: t('tabs.home'),
                tabBarIcon: ({ color }) => <Icon name="House" size={28} color={color} />,
            }} />
            <Tabs.Screen name="menu" options={{
                title: t('tabs.menu'),
                headerTitle: t('tabs.menu'),
                tabBarIcon: ({ color }) => <Icon name="Menu" size={28} color={color} />,
            }} />
        </Tabs>
    );
}