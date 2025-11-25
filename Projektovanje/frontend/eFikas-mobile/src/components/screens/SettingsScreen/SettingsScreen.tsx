
import SettingsTemplate from "../../templates/SettingsTemplate/SettingsTemplate";
import { useTranslation } from "react-i18next";
import { Href, router } from "expo-router";
import { MenuSectionProps } from "@/src/types/types";

export default function SettingsScreen() {

    const { t } = useTranslation();

    const navigationHelper = (route: Href) => {
        router.push(route);
    }

    const MENU_SECTIONS: MenuSectionProps[] = [
        {
            title: t('menu.mainSettings.settings.general.mainTitle'),
            items: [
                { id: "language", icon: "Languages", text: t('menu.mainSettings.settings.general.languageTitle'), onPressMenuItem: () => navigationHelper('/(menu)/(mainSettings)/(settings)/language'), },
                { id: "theme", icon: "SunMoon", text: t('menu.mainSettings.settings.general.themeTitle'), onPressMenuItem: () => navigationHelper('/(menu)/(mainSettings)/(settings)/theme'), },

            ],
        },
        {
            title: t('menu.mainSettings.settings.feedback.mainTitle'),
            items: [
                { id: "bugReport", icon: "TriangleAlert", text: t('menu.mainSettings.settings.feedback.bugReportTitle'), onPressMenuItem: () => navigationHelper('/(menu)/(mainSettings)/(settings)/bugReport'), },
            ]
        },
    ];

    return (
        <SettingsTemplate 
            sections={MENU_SECTIONS}
        />
    );
}