import { Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useTranslation } from "react-i18next";

export default function TabsRootLayout() {
    const { t } = useTranslation();

    return(
        // Link ka ikonicama: https://icons.expo.fyi/Index
        <Tabs initialRouteName="index">
            <Tabs.Screen name="reservations" options={{
                title: t('tabs.reservations'),
                headerTitle: t('tabs.reservations'),
                tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28}  name="book-open-blank-variant-outline" color={color} />,
            }} />
            <Tabs.Screen name="index" options={{
                title: t('tabs.home'),
                headerTitle: t('tabs.home'),
                tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="home" color={color} />,
            }} />
            <Tabs.Screen name="menu" options={{
                title: t('tabs.menu'),
                headerTitle: t('tabs.menu'),
                tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="bars" color={color} />,
            }} />
        </Tabs>
    );
}