import { Icon } from "@/src/components/atoms/Icon/Icon";
import { Tabs } from "expo-router";

import { useTranslation } from "react-i18next";


export default function TabsRootLayout() {
    const { t } = useTranslation();

    return(
        // Link ka ikonicama: https://icons.expo.fyi/Index
        <Tabs initialRouteName="index">
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